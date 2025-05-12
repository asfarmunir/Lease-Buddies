"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Agreements from "@/components/shared/modals/Agreements";
import { useRouter } from "next/navigation";

const steps = [
  "type",
  "audience",
  // "Location",
  "Address",
  "Basics",
  "Amenities",
  "Pet Policy",
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
    title: "Any",
    description: "No price preference, explore all options.",
  },
];

const petTypes = [
  {
    title: "I have a dog",
    description: "Accommodates spaces where pets are welcome.",
  },
  {
    title: "I have a cat",
    description: "Accommodates spaces where pets are welcome.",
  },
  {
    title: "I don't have a pet",
    description: "",
  },
];

const amenitiesCategories = {
  interior: [
    { name: "Air Conditioning", included: true },
    { name: "Hardwood Floors", included: true },
    { name: "Walk-in Closet", included: true },
    { name: "Carpet", included: true },
    { name: "Fireplace", included: true },
  ],
  outdoor: [
    { name: "Balcony", included: true },
    { name: "Patio", included: true },
    { name: "Garden", included: true },
    { name: "Swimming Pool", included: true },
    { name: "Garage", included: true },
  ],
  utilities: [
    { name: "Water Included", included: true },
    { name: "Electricity Included", included: true },
    { name: "Gas Included", included: true },
    { name: "Trash Removal", included: true },
    { name: "Recycling", included: true },
  ],
  otherFeatures: [
    { name: "Wheelchair Access", included: true },
    { name: "Elevator", included: true },
    { name: "Gym", included: true },
    { name: "Laundry Facilities", included: true },
    { name: "Security System", included: true },
  ],
};

export default function PropertyListingForm() {
  const router = useRouter();
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
    amenities: {
      interior: [],
      outdoor: [],
      utilities: [],
      otherFeatures: [],
    },
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
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleNext = () => step < steps.length - 1 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);
  const handleChange = (field: any, value: any) =>
    setFormData({ ...formData, [field]: value });

  const toggleAmenity = (
    category: keyof typeof formData.amenities,
    amenityName: string
  ) => {
    setFormData((prev) => {
      const categoryAmenities = [...prev.amenities[category]];
      const existingIndex = categoryAmenities.findIndex(
        //@ts-ignore
        (a) => a.name === amenityName
      );

      if (existingIndex >= 0) {
        categoryAmenities.splice(existingIndex, 1);
      } else {
        //@ts-ignore
        categoryAmenities.push({ name: amenityName, included: true });
      }

      return {
        ...prev,
        amenities: {
          ...prev.amenities,
          [category]: categoryAmenities,
        },
      };
    });
  };

  const handleComplete = () => {
    const params = new URLSearchParams();

    // Property type
    if (formData.type) params.set("type", formData.type);

    // Audience (price category)
    if (formData.audience && formData.audience !== "Any") {
      params.set("audience", formData.audience);
    }

    // Location search
    if (formData.location) params.set("search", formData.location);

    // Bedrooms (only if > 1)
    if (formData.bedrooms > 1) {
      if (formData.bedrooms >= 4) {
        params.set("bedrooms", "4+");
      } else {
        params.set("bedrooms", formData.bedrooms.toString());
      }
    }

    // Beds (only if > 1)
    if (formData.beds > 1) {
      if (formData.beds >= 4) {
        params.set("beds", "4+");
      } else {
        params.set("beds", formData.beds.toString());
      }
    }

    // Bathrooms (only if > 1)
    if (formData.bathrooms > 1) {
      if (formData.bathrooms >= 4) {
        params.set("bathrooms", "4+");
      } else {
        params.set("bathrooms", formData.bathrooms.toString());
      }
    }

    // Balcony (only if > 1)
    if (formData.balcony > 1) {
      if (formData.balcony >= 4) {
        params.set("balcony", "4+");
      } else {
        params.set("balcony", formData.balcony.toString());
      }
    }

    // Price range
    if (formData.price) {
      const minPrice = Math.max(0, Math.floor(formData.price * 0.8));
      const maxPrice = Math.floor(formData.price * 1.2);
      params.set("minPrice", minPrice.toString());
      params.set("maxPrice", maxPrice.toString());
    }

    // Pets
    formData.petsAllowed.forEach((pet) => {
      if (pet === "I have a dog") params.append("petsAllowed", "Dogs Allowed");
      if (pet === "I have a cat") params.append("petsAllowed", "Cats Allowed");
      if (pet === "I don't have a pet") params.append("petsAllowed", "No Pets");
    });

    // Amenities - flatten all selected amenities from all categories
    const allAmenities = Object.values(formData.amenities)
      .flat()
      //@ts-ignore
      .map((amenity) => amenity.name);

    // Add each amenity to the URL params
    allAmenities.forEach((amenity) => {
      params.append("amenities", amenity);
    });

    // Redirect to home with all filters
    router.push(`/home?${params.toString()}`);
  };

  return (
    <div className="w-full wrapper mb-8">
      {!termsAccepted ? (
        <div className="flex my-12 xl:my-20 items-center gap-4 xl:gap-6 2xl:gap-12 justify-center w-full">
          <div>
            <Image
              src={"/images/list2.webp"}
              alt="Find your home"
              width={500}
              height={500}
            />
          </div>
          <div className="">
            <h2 className="text-xl max-w-md 3xl:max-w-lg 2xl:text-2xl mb-2.5 3xl:text3xl font-semibold">
              Let's find you a new home
            </h2>
            <p className="res_text text-primary-200 max-w-md 3xl:max-w-lg mb-5 text-justify">
              Discover your perfect space! 🏡 Let us help you find a cozy,
              modern, and welcoming place to call home. Whether it's your first
              move or a fresh start, your dream home is just around the corner!
            </p>
            <Agreements acceptTerm={setTermsAccepted} />
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-3xl mx-auto p-6">
            <div className="w-full bg-[#28303F1A] rounded-full h-2 my-8">
              <motion.div
                className="bg-[#28303F] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Step 0 - Property Type */}
            {step === 0 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What type of property are you looking for
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please choose the type of property here.
                </p>
                <div className="w-full my-4 space-y-2">
                  {propertyTypes.map((type, index) => (
                    <div
                      key={index}
                      onClick={() => handleChange("type", type.title)}
                      className={`w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                        ${
                          formData.type === type.title
                            ? "bg-primary/15"
                            : "bg-[#F7F7F7]"
                        }`}
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

            {/* Step 1 - Audience/Budget Preference */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Tell us a little more.. What is your budget?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Let us know your budget
                </p>
                <div className="w-full my-4 space-y-2">
                  {audienceTypes.map((type, index) => (
                    <div
                      key={index}
                      onClick={() => handleChange("audience", type.title)}
                      className={`w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                        ${
                          formData.audience === type.title
                            ? "bg-primary/15"
                            : "bg-[#F7F7F7]"
                        }`}
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

            {/* Step 2 - Location */}
            {/* {step === 2 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Where are you looking to rent?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please enter your ideal location from here.
                </p>
                <Input
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            )} */}

            {/* Step 3 - Basics */}
            {step === 2 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Let's make it more your style
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Let us find your perfect home.
                </p>

                {/* Bedrooms */}
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Bedrooms</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.bedrooms === 1}
                      onClick={() =>
                        handleChange("bedrooms", formData.bedrooms - 1)
                      }
                      className="disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
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

                {/* Beds */}
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Beds</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.beds === 1}
                      onClick={() => handleChange("beds", formData.beds - 1)}
                      className="disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
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

                {/* Bathrooms */}
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Bathrooms</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.bathrooms === 1}
                      onClick={() =>
                        handleChange("bathrooms", formData.bathrooms - 1)
                      }
                      className="disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
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

                {/* Balcony */}
                <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <p className="res-text font-[500]">Balcony</p>
                  <div className="flex items-center gap-2 xl:gap-6">
                    <button
                      disabled={formData.balcony === 1}
                      onClick={() =>
                        handleChange("balcony", formData.balcony - 1)
                      }
                      className="disabled:opacity-40"
                    >
                      <Image
                        src="/images/minus.svg"
                        width={35}
                        height={35}
                        alt="minus"
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
              </div>
            )}

            {/* Step 4 - Amenities */}
            {step === 3 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What features are essential for your housing?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please choose your essentials from here.
                </p>
                <div className="w-full my-4 space-y-6">
                  {Object.entries(amenitiesCategories).map(
                    ([category, items]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold capitalize">
                          {category.replace(/([A-Z])/g, " $1")}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {items.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-4 2xl:p-6 rounded-full cursor-pointer transition-colors ${
                                formData.amenities[
                                  category as keyof typeof formData.amenities
                                ].some((a: any) => a.name === item.name)
                                  ? "bg-primary/15 border border-primary/30"
                                  : "bg-[#F7F7F7] border border-transparent"
                              }`}
                              onClick={() =>
                                toggleAmenity(
                                  category as keyof typeof formData.amenities,
                                  item.name
                                )
                              }
                            >
                              <span className="font-medium">{item.name}</span>
                              <Checkbox
                                checked={formData.amenities[
                                  category as keyof typeof formData.amenities
                                ].some((a: any) => a.name === item.name)}
                                className="data-[state=checked]:bg-primary border-primary"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 5 - Pet Policy */}
            {step === 4 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What is your pet policy?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please choose your price range from here.
                </p>
                <div className="w-full my-4 space-y-2">
                  {petTypes.map((type, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        //@ts-ignore
                        if (formData.petsAllowed.includes(type.title)) {
                          setFormData((prev) => ({
                            ...prev,
                            petsAllowed: prev.petsAllowed.filter(
                              (item) => item !== type.title
                            ),
                          }));
                        } else {
                          setFormData((prev: any) => ({
                            ...prev,
                            petsAllowed: [...prev.petsAllowed, type.title],
                          }));
                        }
                      }}
                      className={`w-full border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6
                        ${
                          formData.petsAllowed.includes(type.title)
                            ? "bg-primary/15"
                            : "bg-[#F7F7F7]"
                        }`}
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

            {/* Step 6 - Price (Final Step) */}
            {step === 5 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl text-center 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What's your budget?
                </h2>
                <p className="res_text text-[#28303FCC] mb-1.5 text-center">
                  please set your price from here.
                </p>
                <div className="bg-[#F7F7F7] border border-[#28303F1A] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-2xl py-4 2xl:py-5 px-5 xl:px-10 w-full text-[#28303FCC]">
                  <button
                    disabled={formData.price === 0}
                    onClick={() =>
                      handleChange("price", Math.max(0, formData.price - 100))
                    }
                    className="disabled:opacity-40"
                  >
                    <Image
                      src="/images/minus.svg"
                      width={35}
                      height={35}
                      alt="minus"
                    />
                  </button>
                  <div className="flex items-center gap-1">
                    <select
                      className="bg-transparent focus:outline-none px-4"
                      value={formData.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                    >
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                    </select>
                    <p className="text-lg font-semibold">
                      {formData.currency === "USD" ? "$" : "C"}
                    </p>
                    <input
                      placeholder="Enter price"
                      value={formData.price === 0 ? "" : formData.price}
                      className="bg-transparent w-24 focus:outline-none text-lg font-semibold"
                      onChange={(e) =>
                        handleChange(
                          "price",
                          isNaN(parseInt(e.target.value))
                            ? 0
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <button
                    onClick={() => handleChange("price", formData.price + 100)}
                  >
                    <Image
                      src="/images/plus.svg"
                      width={35}
                      height={35}
                      alt="plus"
                    />
                  </button>
                </div>
                <p className="res_text mt-1.5 font-medium">Per Month</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-1">
            <Button
              onClick={handleBack}
              className="bg-[#D4D4D41A] px-8 hover:text-white py-3.5 text-primary-200 rounded-full border border-primary-100 font-semibold"
              disabled={step === 0}
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold"
                onClick={handleNext}
                disabled={
                  (step === 0 && !formData.type) ||
                  (step === 1 && !formData.audience)
                  // (step === 2 && !formData.location)
                }
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold"
                onClick={handleComplete}
              >
                Find My Home
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
