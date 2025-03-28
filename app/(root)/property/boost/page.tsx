"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Agreements from "@/components/shared/modals/Agreements";
import { DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const steps = ["type", "audience", "Location", "Address"];

const boostType = [
  {
    title: "Find a home faster",
    description: "Let listing come in your inbox that match your criteria ",
  },
  {
    title: "Boost my listing",
    description: "Find leads 5x faster with boosting",
  },
];
const propertyTypes = [
  {
    title: "Apartment",
    description: "Multi-unit housing in a building or complex.",
  },
  {
    title: "Condo",
    description: "Privately-owned unit in a shared building or community.",
  },
  {
    title: "House",
    description: "Standalone property with private space.",
  },
  {
    title: "Townhouse",
    description: "Multi-level home sharing walls with neighbors.",
  },
  {
    title: "Other",
    description: "Any property type outside the standard categories.",
  },
];
const planTypes = [
  {
    title: "monthly plan",
    description: "Perfect for quick boosts",
    price: 47,
  },
  {
    title: "quarterly plan",
    description: "Save with a 3-month package",
    price: 95,
  },
];

export default function PropertyListingForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    location: "",
    addressDetails: {
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    balcony: 1,
    squareFeet: "",
    amenities: [],
    petsAllowed: [],
    photos: [],
    title: "",
    type: "",
    audience: "",
    description: "",
    price: 0,
    currency: "USD",
    contactDetails: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const handleNext = () => step < steps.length - 1 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);
  const handleChange = (field: any, value: any) =>
    setFormData({ ...formData, [field]: value });
  const toggleAmenity = (amenity: any) => {
    setFormData((prev: any) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((item: any) => item !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  return (
    <div className=" w-full wrapper mb-8 md:min-h-svh">
      <div
        className=" w-full md:min-h-[80svh] rounded-[40px] overflow-hidden p-4  flex items-start flex-col justify-start"
        style={{
          backgroundImage: `url('/images/boost-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-xl bg-white rounded-[40px]  p-6">
          <div className="w-full bg-[#28303F1A] rounded-full h-2 mt-3 mb-6 ">
            <motion.div
              className="bg-[#28303F] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {step === 0 && (
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                Change for We can help rent your property faster!
              </h2>
              <p className="res_text text-[#28303FCC] text-center">
                Let’s boost for 5x the results.
              </p>

              <div className=" w-full my-4 space-y-3">
                {boostType.map((type, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      handleChange("type", type.title);
                    }}
                    className={` w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                    ${
                      formData.type === type.title
                        ? "bg-primary/15"
                        : "bg-[#F7F7F7]"
                    }
                    `}
                  >
                    <h2 className="2xl:text-lg mb-1 font-semibold 3xl:text-xl text-primary-50">
                      {type.title}
                    </h2>
                    <p className="res_text text-primary-200">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                what type of property do you need to rent out
              </h2>
              <p className="res_text text-[#28303FCC] text-center">
                Please choose the type of property here.
              </p>

              <div className=" w-full my-4 space-y-2">
                {propertyTypes.map((type, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      handleChange("audience", type.title);
                    }}
                    className={` w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                    ${
                      formData.audience === type.title
                        ? "bg-primary/15"
                        : "bg-[#F7F7F7]"
                    }
                    `}
                  >
                    <h2 className="2xl:text-lg mb-1 font-semibold 3xl:text-xl text-primary-50">
                      {type.title}
                    </h2>
                    <p className="res_text text-primary-200">
                      {type.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col sm:min-w-[506px] items-center gap-3">
              <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                Choose Your Boost Plan
              </h2>
              <p className="res_text text-[#28303FCC] text-center">
                Select the plan that works best for you
              </p>

              <div className=" w-full  my-4 space-y-2">
                {planTypes.map((type, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      handleChange("audience", type.title);
                    }}
                    className={` w-full flex items-center justify-between text-primary-50 border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                    
                        ${
                          formData.audience === type.title
                            ? "bg-primary/45"
                            : type.title === "monthly plan"
                            ? "bg-[#F7F7F7] "
                            : "bg-primary text-white"
                        }
                    `}
                  >
                    <div>
                      <h2 className="2xl:text-lg capitalize mb-1 font-semibold 3xl:text-xl ">
                        {type.title}
                      </h2>
                      <p className="res_text ">{type.description}</p>
                    </div>
                    <p className="res_text font-semibold  mt-2">
                      ${type.price}/month
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col sm:min-w-[506px] items-center gap-4 ">
              <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                Enter credit card details
              </h2>
              <p className="res_text -mt-1 text-[#28303FCC] text-center">
                Please enter your credit details from here.
              </p>
              <div className=" w-full space-y-2">
                <label
                  htmlFor=""
                  className=" pl-4   res_text font-[500] text-start"
                >
                  Cardholder Name
                </label>
                <Input
                  placeholder="Enter carholder name"
                  value={formData.addressDetails.country}
                  className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                  onChange={(e) =>
                    handleChange("addressDetails", {
                      ...formData.addressDetails,
                      country: e.target.value,
                    })
                  }
                />
              </div>
              <div className=" w-full space-y-2">
                <label
                  htmlFor=""
                  className=" pl-4   res_text font-[500] text-start"
                >
                  Card number
                </label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formData.addressDetails.address1}
                  className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                  onChange={(e) =>
                    handleChange("addressDetails", {
                      ...formData.addressDetails,
                      address1: e.target.value,
                    })
                  }
                />
              </div>
              <div className=" w-full space-y-2">
                <label
                  htmlFor=""
                  className=" pl-4   res_text font-[500] text-start"
                >
                  Email
                </label>
                <Input
                  placeholder="Enter email"
                  value={formData.addressDetails.address2}
                  className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                  onChange={(e) =>
                    handleChange("addressDetails", {
                      ...formData.addressDetails,
                      address2: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4 w-full">
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Expiry Date
                  </label>
                  <Input
                    placeholder="MM/YY"
                    value={formData.addressDetails.address3}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("addressDetails", {
                        ...formData.addressDetails,
                        address3: e.target.value,
                      })
                    }
                  />
                </div>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    CVV
                  </label>
                  <Input
                    placeholder="123"
                    value={formData.addressDetails.city}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("addressDetails", {
                        ...formData.addressDetails,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex mt-5 md:mt-12 justify-between  ">
        <Button
          onClick={handleBack}
          className="bg-[#D4D4D41A] px-8 hover:text-white py-3.5 text-primary-200 rounded-full border border-primary-100 font-semibold"
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          className=" bg-primary text-white px-8 py-3.5 rounded-full font-semibold"
          onClick={handleNext}
          disabled={step === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
