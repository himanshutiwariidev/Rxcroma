"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const steps = [
  { id: 1, title: "Find Medicines" },
  { id: 2, title: "Upload Prescription" },
  { id: 3, title: "Verify Prescription" },
  { id: 4, title: "Place Order" },
  { id: 5, title: "Payment" },
];

const descriptions = {
  1: {
    title: "Find Medicines",
    text: "Explore a wide range of medicines, healthcare products, wellness essentials, and daily care items from trusted brands.",
  },
  2: {
    title: "Upload Prescription",
    text: "Upload your doctor’s prescription easily for prescription medicines. Our team verifies it for a smooth process.",
  },
  3: {
    title: "Verify Prescription",
    text: "Our team verifies your prescription for a smooth and compliant ordering process.",
  },
  4: {
    title: "Place Order",
    text: "Add products to your cart, choose your delivery address, and complete checkout using secure payment options.",
  },
  5: {
    title: "Payment",
    text: "Complete your payment securely through our encrypted payment gateway.",
  },
  
};

const Howtoorder = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) =>
        prevStep === steps.length ? 1 : prevStep + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        
        {/* Left Image */}
        <div className="flex-1 flex justify-center mb-8 lg:mb-0">
          <Image
            src="/images/medicines.jpg"
            alt="Online pharmacy"
            width={500}
            height={500}
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
            priority
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            How To Order
          </h2>

          <p className="text-gray-600 mb-6 text-sm md:text-base lg:text-lg">
            Ordering medicines online is quick, simple, and secure in just five easy steps.
          </p>

          {/* Stepper */}
          <div className="flex items-center justify-center lg:justify-start mb-4 flex-wrap">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm md:text-base ${
                    activeStep === step.id
                      ? "bg-green-500 text-white animate-glow"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id}
                </div>

                {index < steps.length - 1 && (
                  <div className="w-8 md:w-19 h-1 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Titles */}
          <div className="flex justify-between items-center text-xs md:text-base font-medium text-gray-600 max-w-xl mx-auto lg:mx-0 gap-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`flex-1 text-align:start  ${
                  activeStep === step.id ? "text-green-500" : ""
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>

          {/* Dynamic Description */}
          <div className="mt-6">
            <h3 className="text-base md:text-lg font-semibold">
              {descriptions[activeStep].title}
            </h3>

            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {descriptions[activeStep].text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howtoorder;