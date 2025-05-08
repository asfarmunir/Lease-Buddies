"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaPhone, FaCheck, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { useParams } from "next/navigation";
import { Property } from "@/lib/types/property";
import CheckAvailability from "@/components/shared/modals/CheckAvailability";
import BookVisit from "@/components/shared/modals/BookVisit";
import PropertyImageCarousel from "@/components/shared/PropertyImageCarousel";
const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const [showAvailability, setShowAvailability] = useState(false);
  const [showBookVisit, setShowBookVisit] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  console.log("🚀 ~ property:", property);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const images = [
    "/images/home.png",
    "/images/home.png",
    "/images/home.png",
    "/images/home.png",
  ];
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        console.log("🚀 ~ fetchProperty ~ data:", data);
        setProperty(data);
        if (data.photos?.length > 0) {
          setSelectedImage(data.photos[0]);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="wrapper mx-auto h-80 items-center p-4 md:p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="wrapper mx-auto p-4 md:p-8">
        <p>Property not found</p>
      </div>
    );
  }

  return (
    <div className=" wrapper mx-auto p-4 md:p-8">
      {/* Image Gallery */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className=" bg-slate-50">
          <Image
            src={selectedImage}
            alt="Property"
            width={800}
            height={500}
            className="rounded-lg w-full   h-[407px] 2xl:h-[570px] object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {property.photos.slice(1, 5).map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Image-${index}`}
              width={150}
              height={100}
              className={`rounded-lg h-[200px] 2xl:h-[280px] cursor-pointer w-full   object-cover `}
            />
          ))}
        </div>
      </div> */}

      <PropertyImageCarousel
        images={property.photos}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
      />
      {/* Property Details */}
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex justify-between mb-2 items-center gap-2">
            {property.isFeatured ? (
              <span className="bg-primary text-white text-xs  px-2 2xl:px-4 py-2 rounded-full">
                Featured
              </span>
            ) : (
              <p className="opacity-0">p</p>
            )}
            <p className="bg-[#28303F1A]  px-3 inline-flex items-center gap-1.5  py-1.5 text-xs rounded-full">
              <FaStar className="text-base -mt-0.5" />
              4.3
            </p>
          </div>

          <h1 className="text-xl 2xl:text-2xl mb-1.5 font-semibold text-gray-800">
            {property.title}
          </h1>
          <p className="text-gray-600 res_text">
            {property.address.city}, {property.address.state}
          </p>

          <div className="mt-4 bg-[#FDFDFD] flex rounded-2xl border gap-3 md:gap-6 border-[#28303F1A]">
            <div className=" flex-1  p-3 md:p-4 2xl:p-6 border-r border-[#28303F1A]">
              <h3 className="res_text mb-3  text-[#28303FCC]">Bathrooms</h3>
              <p className="flex items-center gap-3">
                <Image
                  src="/images/bath.svg"
                  width={40}
                  height={40}
                  alt="Bed"
                />
                <span>
                  {property.bathrooms < 10
                    ? `0${property.bathrooms}`
                    : property.bathrooms}{" "}
                  Baths
                </span>
              </p>
            </div>
            <div className=" flex-1  p-3 md:p-4 2xl:p-6 border-r border-[#28303F1A]">
              <h3 className="res_text mb-3  text-[#28303FCC]">Bedrooms</h3>
              <p className="flex items-center gap-3">
                <Image src="/images/bed.svg" width={40} height={40} alt="Bed" />
                <span>
                  {property.bedrooms < 10
                    ? `0${property.bedrooms}`
                    : property.bedrooms}{" "}
                  Beds
                </span>
              </p>
            </div>
            <div className=" flex-1  p-3 md:p-4 2xl:p-6 ">
              <h3 className="res_text mb-3  text-[#28303FCC]">Square</h3>
              <p className="flex items-center gap-3">
                <Image
                  src="/images/area.svg"
                  width={40}
                  height={40}
                  alt="Bed"
                />
                <span>{property.squareFeet} sq.ft</span>
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="mt-4 p-4 bg-[#FDFDFD] md:p-6  rounded-2xl border border-[#28303F1A]">
            <h2 className="2xl:text-lg font-semibold">About This Property</h2>
            <p className="text-gray-600 my-4">{property.description}</p>
            <button className="px-5 py-3 xl:px-9 rounded-full bg-[#F7F7F7] font-semibold res_text border border-[#28303F1A]">
              Show More
            </button>
          </div>

          {/* Features & Amenities */}
          <div className="mt-6 p-4 md:p-6 bg-[#FDFDFD]  rounded-2xl border border-[#28303F1A]">
            <h2
              className="2xl:text-lg font-semibold mb-3
            "
            >
              Amenities & Features
            </h2>
            <div className=" flex w-full flex-wrap gap-4 ">
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                <h3 className="text-sm 2xl:text-base font-semibold">
                  Interior Details
                </h3>

                {property.amenities.interior.length === 0 ? (
                  <p className="res_text text-[#28303FCC]">
                    No indoor amenities available.
                  </p>
                ) : (
                  property.amenities.interior.map((item, index) => (
                    <p
                      key={index}
                      className="res_text flex items-center gap-2.5 text-[#28303FCC]"
                    >
                      {item.included && (
                        <span className="text-green-500 ml-2">
                          <FaCheck />
                        </span>
                      )}
                      {item.name}
                    </p>
                  ))
                )}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                <h3 className="text-sm 2xl:text-base font-semibold">
                  Outdoor Details
                </h3>
                {property.amenities.outdoor.length === 0 ? (
                  <p className="res_text text-[#28303FCC]">
                    No outdoor amenities available.
                  </p>
                ) : (
                  property.amenities.outdoor.map((item, index) => (
                    <p
                      key={index}
                      className="res_text flex items-center gap-2.5 text-[#28303FCC]"
                    >
                      {item.included && (
                        <span className="text-green-500 ml-2">
                          <FaCheck />
                        </span>
                      )}
                      {item.name}
                    </p>
                  ))
                )}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                <h3 className="text-sm 2xl:text-base font-semibold">
                  Utilities
                </h3>
                {property.amenities.utilities.length === 0 ? (
                  <p className="res_text text-[#28303FCC]">
                    No utilities available.
                  </p>
                ) : (
                  property.amenities.utilities.map((item, index) => (
                    <p
                      key={index}
                      className="res_text flex items-center gap-2.5 text-[#28303FCC]"
                    >
                      {item.included && (
                        <span className="text-green-500 ml-2">
                          <FaCheck />
                        </span>
                      )}
                      {item.name}
                    </p>
                  ))
                )}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                <h3 className="text-sm 2xl:text-base font-semibold">
                  Other Features
                </h3>
                {property.amenities.otherFeatures.length === 0 ? (
                  <p className="res_text text-[#28303FCC]">
                    No other features available.
                  </p>
                ) : (
                  property.amenities.otherFeatures.map((item, index) => (
                    <p
                      key={index}
                      className="res_text flex items-center gap-2.5 text-[#28303FCC]"
                    >
                      {item.included && (
                        <span className="text-green-500 ml-2">
                          <FaCheck />
                        </span>
                      )}
                      {item.name}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 md:p-6 bg-[#FDFDFD]  rounded-2xl border border-[#28303F1A]">
            <h2
              className="2xl:text-lg font-semibold mb-3
            "
            >
              Overall Rating
            </h2>

            <div className="mt-4 bg-white flex flex-wrap rounded-2xl border gap-3 md:gap-6 border-[#28303F1A]">
              <div className=" flex-1 p-3 sm:p-4 md:p-6 border-r border-[#28303F1A]">
                <h3 className="res_text mb-3  text-[#28303FCC]">Cleanliness</h3>
                <p className="flex items-center gap-3">
                  <Image
                    src="/images/clean.svg"
                    width={40}
                    height={40}
                    alt="Bed"
                  />
                  <span>2.3</span>
                </p>
              </div>
              <div className=" flex-1 p-3 sm:p-4 md:p-6 border-r border-[#28303F1A]">
                <h3 className="res_text mb-3  text-[#28303FCC]">Accuracy</h3>
                <p className="flex items-center gap-3">
                  <Image
                    src="/images/accurate.svg"
                    width={40}
                    height={40}
                    alt="Bed"
                  />
                  <span>2.3</span>
                </p>
              </div>
              <div className=" flex-1 p-3 sm:p-4 md:p-6 border-r border-[#28303F1A]">
                <h3 className="res_text mb-3  text-[#28303FCC]">
                  Communication
                </h3>
                <p className="flex items-center gap-3">
                  <Image
                    src="/images/message.svg"
                    width={40}
                    height={40}
                    alt="Bed"
                  />
                  <span>3.6</span>
                </p>
              </div>
              <div className=" flex-1 p-3 sm:p-4 md:p-6 border-r border-[#28303F1A]">
                <h3 className="res_text mb-3  text-[#28303FCC]">Location</h3>
                <p className="flex items-center gap-3">
                  <Image
                    src="/images/location.svg"
                    width={40}
                    height={40}
                    alt="Bed"
                  />
                  <span>3.6</span>
                </p>
              </div>
              <div className=" flex-1 p-3 sm:p-4 md:p-6 ">
                <h3 className="res_text mb-3  text-[#28303FCC]">Value</h3>
                <p className="flex items-center gap-3">
                  <Image
                    src="/images/value.svg"
                    width={40}
                    height={40}
                    alt="Bed"
                  />
                  <span>3.6</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 my-4 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className=" p-4 xl:p-6 border border-[#28303F1A] rounded-2xl bg-white"
                >
                  <div className="flex items-center  gap-2">
                    <Image src="/user.svg" width={50} height={50} alt="Heart" />
                    <div>
                      <h3
                        className="text
                    -lg font-semibold"
                      >
                        John Doe
                      </h3>
                      <p className="res_text text-[#28303FCC]">
                        Oak Park, Illinois
                      </p>
                    </div>
                  </div>
                  <div className="flex w-fit items-center border border-gray-300 gap-2 my-4 bg-[#28303F1A] rounded-full px-3 py-2">
                    <FaStar className="text-[#28303F]" />
                    <FaStar className="text-[#28303F]" />
                    <FaStar className="text-[#28303F]" />
                    <FaStar className="text-[#28303F]" />
                    <FaStar className="text-gray-300" />
                  </div>
                  <p className="text-gray-600 text-sm 2xl:text-base">
                    What a beautiful place to spend three nights. We wish we
                    could have stayed longer! Stunning property with loads of
                    character. Gorgeous grounds, authentic castle.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-lg mb-4 font-semibold">Where You Will Be</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <StaticPropertyMap
                lat={property.address.lat}
                lng={property.address.lng}
                formattedAddress={property.address.formattedAddress}
              />
            </div>
            <p className="mt-2 text-gray-600">
              {property.address.formattedAddress}
            </p>
          </div>
        </div>

        {/* Right Section (Pricing & Contact) */}
        <div className="space-y-4">
          <div className="w-full md:w-[300px] 2xl:w-[400px] bg-white border border-primary-100  rounded-2xl p-4">
            <h2 className="text-xl font-semibold ">
              {property.currency === "USD" ? "$" : "CA$"}
              {property.price}/month
            </h2>
            <button
              onClick={() => setShowAvailability(true)}
              className="bg-primary text-white font-semibold w-full py-3 rounded-full mt-4"
            >
              Check Availability
            </button>
            <CheckAvailability
              propertyId={property._id}
              open={showAvailability}
              onOpenChange={setShowAvailability}
            />
            <button
              onClick={() => setShowBookVisit(true)}
              className="bg-[#3A99D31A] text-primary font-semibold w-full py-3 rounded-full mt-4"
            >
              Request Visit
            </button>
            <BookVisit
              propertyId={property._id}
              open={showBookVisit}
              onOpenChange={setShowBookVisit}
            />

            <p className="text-[#28303F] text-center res_text mt-4">
              By sending this inquiry, I accept LeaseBuddi’s Terms and
              Conditions, Privacy Policy, and Community Values.
            </p>
          </div>
          {/* Contact Info */}
          <div className="w-full md:w-[300px] 2xl:w-[400px] bg-white border border-primary-100  rounded-2xl p-4">
            <div className="flex items-center gap-2 mt-2">
              <Image
                src="/images/phone.svg"
                width={40}
                height={40}
                alt="User"
              />
              <span className="text-gray-800 underline">
                {property.contactDetails.phoneNumber}
              </span>
            </div>
          </div>
          <div className="w-full md:w-[300px] 2xl:w-[400px] bg-[#28303F1A] border border-primary-100  rounded-2xl p-4">
            <div className="flex flex-col  gap-2 mt-2">
              <Image
                src="/images/promotion.svg"
                width={40}
                height={40}
                alt="User"
              />
              <p className="text-gray-800 font-semibold 2xl:text-lg">
                Promotions
              </p>
              <p className="text-[#28303FCC] res_text">
                Waived Admin Fee Restrictions apply Waived Admin Fee If holding
                fee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
    </div>
  );
};

export default PropertyDetails;

interface PropertyMapProps {
  lat: number;
  lng: number;
  formattedAddress: string;
}

const StaticPropertyMap = ({
  lat,
  lng,
  formattedAddress,
}: PropertyMapProps) => {
  const markerIcon = encodeURIComponent(
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  );
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?
    center=${lat},${lng}&
    zoom=14&
    size=800x400&
    scale=2&
    format=png&
    maptype=roadmap&
    style=feature:all|element:labels|visibility:on&
    markers=color:red%7C${lat},${lng}&
    key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`.replace(/\s/g, "");

  return (
    <div className="w-full h-[400px] relative rounded-lg overflow-hidden">
      <Image
        src={staticMapUrl}
        alt={`Map of ${formattedAddress}`}
        fill
        className="object-cover"
        quality={100}
        priority
      />
      <a
        href={`https://www.google.com/maps/?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-md hover:bg-gray-100"
      >
        View on Google Maps
      </a>
    </div>
  );
};
