"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Agreements from "@/components/shared/modals/Agreements";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { RiLoader3Line } from "react-icons/ri";
import LocationInput from "@/components/shared/AutoCompleteField";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
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
  // {
  //   title: "Townhouse",
  //   description: "Multi-level home sharing walls with neighbors.",
  // },
  // {
  //   title: "Other",
  //   description: "Any property type outside the standard categories.",
  // },
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
    title: "Dogs Allowed",
    description: "Accommodates spaces where dogs are welcome.",
  },
  {
    title: "Cats Allowed",
    description: "Suitable for places that allow cats.",
  },
  {
    title: "No Pets",
    description: "Filters locations with a strict no-pets policy.",
  },
];

const amenitiesCategories = {
  interior: [
    { name: "Air Conditioning", included: true },
    { name: "Hardwood Floors", included: true },
    { name: "Walk-in Closet", included: true },
    { name: "Carpet", included: true },
    { name: "Fireplace", included: true },
    {
      name: "Interior Parking Space",
      included: true,
    },
  ],
  outdoor: [
    { name: "Balcony", included: true },
    { name: "Patio", included: true },
    { name: "Garden", included: true },
    { name: "Swimming Pool", included: true },
    { name: "Garage", included: true },
    {
      name: "Exterior Parking Space",
      included: true,
    },
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
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });
  const router = useRouter();
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
      lat: 0, // Add latitude
      lng: 0, // Add longitude
      formattedAddress: "", // Add formatted address
      apartmentNumber: "",
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
    petsAllowed: [] as string[],
    photos: [] as string[],
    title: "",
    type: "",
    audience: "",
    description: "",
    price: 0,
    currency: "USD",
    contactDetails: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phoneNumber: "",
    },
  });

  const validateCurrentStep = () => {
    switch (steps[step]) {
      case "type":
        return !!formData.type; // Must select a property type
      // case "audience":
      //   return !!formData.audience; // Must select an audience
      case "Location":
        return (
          !!formData.location.trim() &&
          formData.address.lat !== 0 &&
          formData.address.lng !== 0
        );
      case "Address":
        return (
          !!formData.address.address1.trim() &&
          !!formData.address.city.trim() &&
          !!formData.address.state.trim() &&
          !!formData.address.zip.trim()
        );
      case "Basics":
        return !!formData.squareFeet.trim(); // Square feet must be provided
      case "Amenities":
        return true; // No required fields (all optional)
      case "Pet Policy":
        return true; // No required fields (all optional)
      case "Photos":
        return formData.photos.length >= 5; // At least 5 photos
      case "Title":
        return !!formData.title.trim() && formData.title.length <= 32;
      case "Description":
        return (
          !!formData.description.trim() && formData.description.length <= 500
        );
      case "Price":
        return formData.price > 0; // Price must be greater than 0
      case "Contact":
        return (
          !!formData.contactDetails.name.trim() &&
          !!formData.contactDetails.email.trim() &&
          !!formData.contactDetails.phoneNumber.trim()
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      // Show error message based on current step
      showValidationError();
      return;
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const showValidationError = () => {
    switch (steps[step]) {
      case "type":
        toast.error("Please select a property type");
        break;
      // case "audience":
      //   toast.error("Please select an audience type");
      //   break;
      case "Location":
        toast.error("Please enter a location");
        break;
      case "Address":
        toast.error("Please add required information");
        break;
      case "Basics":
        toast.error("Please enter square footage");
        break;
      case "Photos":
        toast.error("Please upload at least 5 photos");
        break;
      case "Title":
        toast.error("Please enter a title");
        break;
      case "Description":
        toast.error("Please enter a description");
        break;
      case "Price":
        toast.error("Please enter a valid price");
        break;
      case "Contact":
        toast.error("Please complete all contact information");
        break;
      default:
        toast.error("Please complete all required fields");
    }
  };
  const handleBack = () => step > 0 && setStep(step - 1);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        // Remove if already exists
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

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check total images count
    const totalImages = formData.photos.length + files.length;
    if (totalImages > 10) {
      toast.error("You can upload a maximum of 10 photos");
      return;
    }

    setUploading(true);

    try {
      const newImageUrls = await uploadImagesToCloudinary(files);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newImageUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload some images");
    } finally {
      setUploading(false);
    }
  };

  const uploadImagesToCloudinary = async (
    files: FileList
  ): Promise<string[]> => {
    const uploadPromises = Array.from(files).map((file) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "leasebuddi");
      data.append("cloud_name", "unionwealthmanagement");

      return fetch(
        "https://api.cloudinary.com/v1_1/unionwealthmanagement/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => data.secure_url)
        .catch((error) => {
          console.error("Error uploading image:", error);
          return null;
        });
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null) as string[];
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };

  const handleSubmit = async () => {
    if (step !== steps.length - 1) {
      if (step === 7 && formData.photos.length < 5) {
        toast.error("Please upload at least 5 photos");
        return;
      }
      handleNext();
      return;
    }

    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.title || !formData.description || formData.price <= 0) {
        throw new Error("Please fill all required fields");
      }

      if (formData.photos.length < 5) {
        throw new Error("Please upload at least 5 photos");
      }

      console.log("Form data before submission:", formData);

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          featuredImage: formData.photos[0], // Set first image as featured
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create listing");
      }

      await response.json();
      toast.success("Property listed successfully!");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // <GoogleMapsWrapper>
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
            {/* {step === 1 && (
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
            )} */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Where's your place located?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Start typing your address and select from Google suggestions
                </p>

                <div className="w-full">
                  {loadError ? (
                    <div className="text-red-500">
                      Error loading maps. Please refresh the page.
                    </div>
                  ) : !isLoaded ? (
                    <div className="flex justify-center items-center h-20">
                      <RiLoader3Line className="animate-spin text-2xl" />
                    </div>
                  ) : (
                    <>
                      <LocationInput
                        onPlaceSelected={(place) => {
                          if (place) {
                            const city = place.address_components?.find(
                              (component) =>
                                component.types.includes("locality")
                            )?.long_name;

                            const state = place.address_components?.find(
                              (component) =>
                                component.types.includes(
                                  "administrative_area_level_1"
                                )
                            )?.short_name;

                            const zip = place.address_components?.find(
                              (component) =>
                                component.types.includes("postal_code")
                            )?.long_name;

                            const country = place.address_components?.find(
                              (component) => component.types.includes("country")
                            )?.short_name;

                            const streetNumber = place.address_components?.find(
                              (component) =>
                                component.types.includes("street_number")
                            )?.long_name;

                            const route = place.address_components?.find(
                              (component) => component.types.includes("route")
                            )?.long_name;

                            const address1 =
                              streetNumber && route
                                ? `${streetNumber} ${route}`
                                : place.formatted_address || "";

                            const address = {
                              address1,
                              address2: "",
                              address3: "",
                              city: city || "",
                              state: state || "",
                              zip: zip || "",
                              country: country || "US",
                              lat: place.geometry?.location?.lat() || 0,
                              lng: place.geometry?.location?.lng() || 0,
                              formattedAddress: place.formatted_address || "",
                            };

                            handleChange(
                              "location",
                              place.formatted_address || ""
                            );
                            handleChange("address", address);
                          }
                        }}
                      />

                      {/* Show selected location on a small map preview */}
                      {formData.address.lat && formData.address.lng ? (
                        <div className="mt-4 h-60 xl:h-80 rounded-lg overflow-hidden">
                          <GoogleMap
                            zoom={15}
                            center={{
                              lat: formData.address.lat,
                              lng: formData.address.lng,
                            }}
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Marker
                              position={{
                                lat: formData.address.lat,
                                lng: formData.address.lng,
                              }}
                            />
                          </GoogleMap>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
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
                    Apartment Number
                  </label>
                  <Input
                    placeholder="Enter your apartment number (optional)"
                    value={formData.address.apartmentNumber}
                    className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                    onChange={(e) =>
                      handleChange("address", {
                        ...formData.address,
                        apartmentNumber: e.target.value,
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
                    State/Province
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
                    placeholder="Enter postal code"
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
            {step === 3 && (
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
                {/* <div className="bg-[#F7F7F7] flex items-center justify-between text-xs md:text-sm 3xl:text-base rounded-full  py-5 2xl:py-6 3xl:py-7 px-5 xl:px-10 w-full text-[#28303FCC]">
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
                </div> */}
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
                    className=" bg-transparent focus:outline-none w-full"
                    onChange={(e) => handleChange("squareFeet", e.target.value)}
                  />
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Does your property offer any amenities?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  What extras to offer a potential renter?
                </p>

                <div className="w-full my-4 space-y-6">
                  {Object.entries(amenitiesCategories).map(
                    ([category, items]) => (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold capitalize">
                          {category.replace(/([A-Z])/g, " $1")}{" "}
                          {/* Convert camelCase to words */}
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
            {step === 5 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  What is your pet policy?
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Please select your pet policy from here.
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
            {step === 6 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Add Photos
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  {formData.photos.length > 0
                    ? `You've added ${formData.photos.length} photos (min 5, max 10)`
                    : "You can add your photos from here (min 5, max 10)."}
                </p>
                {uploading && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <div className="bg-white/80 p-6 rounded-lg shadow-lg">
                      <p className="res_text">Uploading Images...</p>
                      <RiLoader3Line className="text-5xl text-primary mx-auto mt-3 animate-spin" />
                    </div>
                  </div>
                )}
                <div className="mt-6 w-full">
                  {formData.photos.length === 0 ? (
                    <div className="relative ">
                      <Image
                        src="/images/upload.svg"
                        width={700}
                        height={700}
                        alt="upload"
                        className="mx-auto mb-4"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Property ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {formData.photos.length < 10 && (
                        <div className="relative border-2 h-40 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="p-4 text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 mx-auto text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <p className="res_text text-sm text-[#28303FCC]">
                              Add more photos
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {formData.photos.length > 0 && formData.photos.length < 5 && (
                  <p className="text-red-500 res_text mt-4">
                    Please add at least {5 - formData.photos.length} more photos
                  </p>
                )}
              </div>
            )}
            {step === 7 && (
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
            {step === 8 && (
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
                      {formData.description.length} / 500
                    </p>
                  </div>
                </div>
              </div>
            )}
            {step === 9 && (
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 3xl:text-3xl">
                  Now set your price
                </h2>
                <p className="res_text text-[#28303FCC] text-center">
                  Monthly rent cost.
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
                      {formData.currency === "USD" ? "$" : "CA$"}
                    </p>
                    <input
                      placeholder="Enter price"
                      type="number"
                      min={0}
                      max={1000000}
                      value={formData.price === 0 ? "" : formData.price}
                      className="bg-transparent w-24 xl:w-40 focus:outline-none text-lg font-semibold"
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
            {step === 10 && (
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
                    placeholder="Enter phone"
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
    // </GoogleMapsWrapper>
  );
}
