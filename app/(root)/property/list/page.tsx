"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Agreements from "@/components/shared/modals/Agreements";
import { DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const steps = [
  "type",
  "audience",
  "Location",
  "Address",
  "Basics",
  "Amenities",
  "Pet Policy",
  "Photos",
  "Title",
  "Description",
  "Price",
  "Contact",
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
const audienceTypes = [
  {
    title: "Affordable",
    description: "Budget-friendly and affordable options.",
  },
  {
    title: "Luxury",
    description: "Premium and high-end choices.",
  },
  {
    title: "Any ",
    description: "No price preference, explore all options.",
  },
];
const petTypes = [
  {
    title: "Dogs Allowed",
    description: "Accommodates spaces where dogs are welcome.",
  },
  {
    title: "Cats Allowed",
    description: "Suitable for places that allow cats",
  },
  {
    title: "No Pets",
    description: "Filters locations with a strict no-pets policy.",
  },
];

export default function PropertyListingForm() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    address: {
      address1: "",
      address2: "",
      address3: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
    },
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    balcony: 1,
    squareFeet: "",
    amenities: [] as string[],
    petsAllowed: [] as string[],
    photos: [] as string[],
    title: "",
    type: "",
    audience: "Any",
    description: "",
    price: 0,
    currency: "USD",
    contactDetails: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phoneNumber: "",
    },
  });

  const handleNext = () => step < steps.length - 1 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (
    parentField: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        //@ts-ignore
        ...prev[parentField as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const togglePetPolicy = (policy: string) => {
    setFormData((prev) => ({
      ...prev,
      petsAllowed: prev.petsAllowed.includes(policy)
        ? prev.petsAllowed.filter((item) => item !== policy)
        : [...prev.petsAllowed, policy],
    }));
  };

  const handleSubmit = async () => {
    if (step !== steps.length - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.title || !formData.description || formData.price <= 0) {
        throw new Error("Please fill all required fields");
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create listing");
      }

      const result = await response.json();
      toast.success("Property listed successfully!");
      // Reset form or redirect as needed
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" w-full wrapper mb-8">
      {!termsAccepted ? (
        <div className="flex my-12 xl:my-20 items-center gap-4 xl:gap-6 2xl:gap-12 justify-center w-full">
          <div>
            <Image
              src={"/home/hero2.webp"}
              alt="hehe"
              width={500}
              height={500}
            />
          </div>
          <div className="">
            <h2 className="text-xl max-w-md 3xl:max-w-lg 2xl:text-2xl mb-2.5 3xl:text3xl font-semibold">
              Let’s setup your new listing and get you a rental
            </h2>
            <p className="res_text text-primary-200 max-w-md 3xl:max-w-lg mb-5 text-justify">
              Start your journey to a home filled with comfort, joy, and endless
              possibilities. Let’s make finding your dream space fun and
              exciting!
            </p>
            <Agreements acceptTerm={setTermsAccepted} />
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div className="max-w-3xl mx-auto p-6">
            <div className="w-full bg-[#28303F1A] rounded-full h-2 my-8">
              <motion.div
                className="bg-[#28303F] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {step === 0 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What type of property do you own?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please choose the type of property here.
                </p>

                <div className=" w-full my-4 space-y-2">
                  {propertyTypes.map((type, index) => (
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
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Tell us a little more.. What is your audience?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Let us know your audience
                </p>

                <div className=" w-full my-4 space-y-2">
                  {audienceTypes.map((type, index) => (
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
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Where’s your place located?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please enter your property location from here.
                </p>
                <Input
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center gap-4 ">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Confirm your address
                </h2>
                <p className="res_text -mt-1 text-[#28303FCC] text-center">
                  Please confirm your address from here.
                </p>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Country
                  </label>
                  <Input
                    placeholder="Enter country"
                    value={formData.address.country}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
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
                    Address line 1
                  </label>
                  <Input
                    placeholder="Enter address line 1"
                    value={formData.address.address1}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
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
                    Address line 2
                  </label>
                  <Input
                    placeholder="Enter address line 2 (optional)"
                    value={formData.address.address2}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
                        address2: e.target.value,
                      })
                    }
                  />
                </div>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Address line 3
                  </label>
                  <Input
                    placeholder="Enter address line 3 (optional)"
                    value={formData.address.address3}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
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
                    City
                  </label>
                  <Input
                    placeholder="Enter city"
                    value={formData.address.city}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    State
                  </label>
                  <Input
                    placeholder="Enter state/province"
                    value={formData.address.state}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Postal Code
                  </label>
                  <Input
                    placeholder="Enter postal code (otpional)"
                    value={formData.address.zip}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
                        zip: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Share some basics about your place
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please enter your home basic informations from here.
                </p>
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Bedrooms</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.bedrooms === 1}
                      onClick={() =>
                        handleChange("bedrooms", formData.bedrooms - 1)
                      }
                      className=" disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
                        className="                    "
                      />
                    </button>
                    <span className="res_text font-semibold md:w-6 text-center">
                      {formData.bedrooms}
                    </span>
                    <button
                      onClick={() =>
                        handleChange("bedrooms", formData.bedrooms + 1)
                      }
                    >
                      <Image
                        src="/images/plus.svg"
                        width={35}
                        height={35}
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Beds</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.beds === 1}
                      onClick={() => handleChange("beds", formData.beds - 1)}
                      className=" disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
                        className="                    "
                      />
                    </button>
                    <span className="res_text font-semibold md:w-6 text-center">
                      {formData.beds}
                    </span>
                    <button
                      onClick={() => handleChange("beds", formData.beds + 1)}
                    >
                      <Image
                        src="/images/plus.svg"
                        width={35}
                        height={35}
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Bathrooms</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.bathrooms === 1}
                      onClick={() =>
                        handleChange("bathrooms", formData.bathrooms - 1)
                      }
                      className=" disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
                        className="                    "
                      />
                    </button>
                    <span className="res_text font-semibold md:w-6 text-center">
                      {formData.bathrooms}
                    </span>
                    <button
                      onClick={() =>
                        handleChange("bathrooms", formData.bathrooms + 1)
                      }
                    >
                      <Image
                        src="/images/plus.svg"
                        width={35}
                        height={35}
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Balcony</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.balcony === 1}
                      onClick={() =>
                        handleChange("balcony", formData.balcony - 1)
                      }
                      className=" disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
                        className="                    "
                      />
                    </button>
                    <span className="res_text font-semibold md:w-6 text-center">
                      {formData.balcony}
                    </span>
                    <button
                      onClick={() =>
                        handleChange("balcony", formData.balcony + 1)
                      }
                    >
                      <Image
                        src="/images/plus.svg"
                        width={35}
                        height={35}
                        alt="plus"
                      />
                    </button>
                  </div>
                </div>
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <input
                    placeholder="Enter Listing’s Square feet"
                    value={formData.squareFeet}
                    className=" bg-transparent focus:outline-none"
                    onChange={(e) => handleChange("squareFeet", e.target.value)}
                  />
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Does your property offer any amenities?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  What extras to offer a potential renter?
                </p>
                <div className=" w-full my-4 space-y-2">
                  <div
                    className={`w-full  flex items-center justify-between gap-2 px-4 xl:px-8 py-5 res_text rounded-full text-left 
                    ${
                      //@ts-ignore
                      formData.amenities.includes("Air Conditioning")
                        ? "bg-[#28303F1A]"
                        : "bg-[#F7F7F7]"
                    }
                           `}
                  >
                    <p className=" font-[500]">Air Conditioning</p>
                    <Checkbox
                      className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                      onCheckedChange={() => toggleAmenity("Air Conditioning")}
                    />
                  </div>
                  <div
                    className={`w-full  flex items-center justify-between gap-2 px-4 xl:px-8 py-5 res_text rounded-full text-left 
                    ${
                      //@ts-ignore
                      formData.amenities.includes("Carpet")
                        ? "bg-[#28303F1A]"
                        : "bg-[#F7F7F7]"
                    }
                           `}
                  >
                    <p className=" font-[500]">Carpets</p>
                    <Checkbox
                      className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                      onCheckedChange={() => toggleAmenity("Air Conditioning")}
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 6 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What is your pet policy?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please choose your price range from here.
                </p>

                <div className=" w-full my-4 space-y-2">
                  {petTypes.map((type, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        //@ts-ignore
                        if (formData.petsAllowed.includes(type.title)) {
                          setFormData((prev) => {
                            const newAmenities = prev.petsAllowed.filter(
                              (item) => item !== type.title
                            );
                            return { ...prev, petsAllowed: newAmenities };
                          });
                        } else {
                          //@ts-ignore
                          setFormData((prev) => {
                            const newAmenities = [
                              ...prev.petsAllowed,
                              type.title,
                            ];
                            return { ...prev, petsAllowed: newAmenities };
                          });
                        }
                      }}
                      className={` w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                    ${
                      //@ts-ignore
                      formData.petsAllowed.includes(type.title)
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
            {step === 7 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Rental Unit
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  you can add your house photos from here.
                </p>
              </div>
            )}
            {step === 8 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Now, lets give your listing a title
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  please add short listing title from here.{" "}
                </p>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    House Title
                  </label>
                  <textarea
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base xl:h-40 rounded-2xl border border-[#28303F1A] py-5 sm:px-5 w-full text-[#28303FCC]"
                    placeholder="Write a short listing title.."
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                  <div className="flex items-center justify-end">
                    <p className="res_text font-[500] text-primary-50">
                      {formData.title.length} / 32
                    </p>
                  </div>
                </div>
              </div>
            )}
            {step === 9 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Now, Let’s create description
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  please add short house description from here.
                </p>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    House Description
                  </label>
                  <textarea
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base xl:h-40 rounded-2xl border border-[#28303F1A] py-5 sm:px-5 w-full text-[#28303FCC]"
                    placeholder="Write a short house description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                  <div className="flex items-center justify-end">
                    <p className="res_text font-[500] text-primary-50">
                      {formData.description.length} / 32
                    </p>
                  </div>
                </div>
              </div>
            )}
            {step === 10 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Now set your price
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  please set your price from here.
                </p>
                <div className="bg-[#F7F7F7] border border-[#28303F1A] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-2xl  py-4 2xl:py-5  px-5 xl:px-10 w-full text-[#28303FCC]">
                  <button
                    disabled={formData.price === 1}
                    onClick={() => handleChange("price", formData.price - 1)}
                    className=" disabled:opacity-40"
                  >
                    <Image
                      src="/images/minus.svg"
                      width={35}
                      height={35}
                      alt="minus"
                      className="                    "
                    />
                  </button>{" "}
                  <div className="flex items-center gap-1 ">
                    <select
                      name=""
                      id=""
                      className="bg-transparent focus:outline-none px-4"
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                    >
                      <option value="USD" className=" px-4">
                        USD
                      </option>
                      <option value="CAD" className=" px-4">
                        CAD
                      </option>
                    </select>
                    <p className="text-lg font-semibold">
                      {formData.currency === "USD" ? "$" : "C"}
                    </p>
                    <input
                      placeholder="Enter price"
                      value={formData.price === 0 ? "" : formData.price}
                      className="bg-transparent w-24 focus:outline-none text-lg font-semibold"
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => handleChange("price", formData.price + 1)}
                  >
                    <Image
                      src="/images/plus.svg"
                      width={35}
                      height={35}
                      alt="plus"
                    />
                  </button>
                </div>
              </div>
            )}
            {step === 11 && (
              <div className="flex flex-col items-center gap-4 ">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  How can they contact you
                </h2>
                <p className="res_text -mt-1 text-[#28303FCC] text-center">
                  Let’s get potential clients to contact you.
                </p>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Name
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.contactDetails.name}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("contactDetails", {
                        ...formData.contactDetails,
                        name: e.target.value,
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
                    placeholder="Enter your email"
                    type="email"
                    value={formData.contactDetails.email}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("contactDetails", {
                        ...formData.contactDetails,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className=" w-full space-y-2">
                  <label
                    htmlFor=""
                    className=" pl-4   res_text font-[500] text-start"
                  >
                    Phone Number
                  </label>
                  <Input
                    placeholder="Enter phone number"
                    type="number"
                    value={formData.contactDetails.phoneNumber}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("contactDetails", {
                        ...formData.contactDetails,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between  mt-1">
            <Button
              onClick={handleBack}
              className="bg-[#D4D4D41A] px-8 hover:text-white py-3.5 text-primary-200 rounded-full border border-primary-100 font-semibold"
              disabled={step === 0}
            >
              Back
            </Button>
            <Button
              className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold"
              onClick={step === steps.length - 1 ? handleSubmit : handleNext}
              disabled={step === steps.length - 1 && isSubmitting}
            >
              {step === steps.length - 1
                ? isSubmitting
                  ? "Submitting..."
                  : "Submit"
                : "Next"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
