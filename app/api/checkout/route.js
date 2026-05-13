import { NextResponse } from "next/server";
import { sendCheckoutEmails } from "../../../lib/mailer";

export const runtime = "nodejs";

const requiredCustomerFields = [
  "fullName",
  "email",
  "country",
  "phone",
  "state",
  "address",
  "city",
  "zipCode",
  "age",
  "bodyWeight",
  "gender",
  "diseases",
  "allergies",
];

const countryPattern = /^[A-Z]{2}$/i;
const phonePattern = /^\+?[0-9][0-9\s().-]{5,24}$/i;
const postalPattern = /^([A-Z0-9][A-Z0-9\s-]{1,14}|N\/?A)$/i;

function parseJsonField(formData, fieldName, fallback) {
  const value = formData.get(fieldName);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const customerDetails = parseJsonField(formData, "customerDetails", {});
    const items = parseJsonField(formData, "items", []);
    const orderTotal = Number(formData.get("orderTotal") || 0);
    const prescriptionFile = formData.get("prescription");

    const missingField = requiredCustomerFields.find((field) => !customerDetails[field]?.trim());

    if (missingField) {
      return NextResponse.json(
        { message: "Please complete all required checkout fields." },
        { status: 400 },
      );
    }

    if (!countryPattern.test(customerDetails.country.trim())) {
      return NextResponse.json(
        { message: "Please choose a valid country." },
        { status: 400 },
      );
    }

    if (!phonePattern.test(customerDetails.phone.trim())) {
      return NextResponse.json(
        { message: "Use an international phone number, preferably with country code." },
        { status: 400 },
      );
    }

    if (!postalPattern.test(customerDetails.zipCode.trim())) {
      return NextResponse.json(
        { message: "Use your postal/ZIP code, or N/A if your address does not use one." },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 },
      );
    }

    if (!prescriptionFile || typeof prescriptionFile.arrayBuffer !== "function") {
      return NextResponse.json(
        { message: "Prescription upload is required." },
        { status: 400 },
      );
    }

    const prescriptionBuffer = Buffer.from(await prescriptionFile.arrayBuffer());

    await sendCheckoutEmails({
      attachment: {
        content: prescriptionBuffer,
        contentType: prescriptionFile.type || "application/octet-stream",
        filename: prescriptionFile.name || "prescription",
      },
      customerDetails,
      items,
      orderTotal,
      prescriptionFileName: prescriptionFile.name,
    });

    return NextResponse.json({
      message: "Order request submitted. Confirmation emails have been sent.",
    });
  } catch (error) {
    console.error("Checkout submission failed", error);

    return NextResponse.json(
      { message: error.message || "Unable to submit checkout right now." },
      { status: 500 },
    );
  }
}
