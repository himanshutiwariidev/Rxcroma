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

const countryRules = {
  CA: {
    phonePattern: /^\+1\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
    phoneTitle: "Use a Canadian number like +1 (416) 555-0123.",
    postalPattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    postalTitle: "Use a Canadian postal code like M5V 3L9.",
  },
  GB: {
    phonePattern: /^\+44\s?\d{2,5}\s?\d{3,4}\s?\d{3,4}$/i,
    phoneTitle: "Use a UK number like +44 20 7946 0958.",
    postalPattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    postalTitle: "Use a UK postcode like SW1A 1AA.",
  },
  US: {
    phonePattern: /^\+1\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
    phoneTitle: "Use a US number like +1 (555) 000-0000.",
    postalPattern: /^\d{5}(-\d{4})?$/i,
    postalTitle: "Use a 5-digit ZIP code or ZIP+4, like 10001 or 10001-1234.",
  },
};

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

    const selectedCountryRules = countryRules[customerDetails.country];

    if (!selectedCountryRules) {
      return NextResponse.json(
        { message: "Please choose United States, United Kingdom, or Canada." },
        { status: 400 },
      );
    }

    if (!selectedCountryRules.phonePattern.test(customerDetails.phone.trim())) {
      return NextResponse.json(
        { message: selectedCountryRules.phoneTitle },
        { status: 400 },
      );
    }

    if (!selectedCountryRules.postalPattern.test(customerDetails.zipCode.trim())) {
      return NextResponse.json(
        { message: selectedCountryRules.postalTitle },
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
