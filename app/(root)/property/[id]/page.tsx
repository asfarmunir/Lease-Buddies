"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPhone, FaCheck, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";

const PropertyDetails: React.FC = () => {
  // Dummy images for the gallery
  const images = [
    "/images/home.png",
    "/images/home.png",
    "/images/home.png",
    "/images/home.png",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className=" wrapper mx-auto p-4 md:p-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className=" bg-red-50">
          <Image
            src={selectedImage}
            alt="Property"
            width={800}
            height={500}
            className="rounded-lg w-full  h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              width={150}
              height={100}
              className={`rounded-lg cursor-pointer w-full   object-cover `}
            />
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-col md:flex-row mt-6 gap-6">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center gap-2">
            <span className="bg-[#E2E2E21A] text-primary-50 text-xs px-2 2xl:px-3 py-2 rounded-full">
              Featured
            </span>
            <p className="bg-[#28303F1A]  px-3 inline-flex items-center gap-1.5  py-1.5 text-xs rounded-full">
              <FaStar className="text-base -mt-0.5" />
              4.3
            </p>
          </div>

          <h1 className="text-xl 2xl:text-2xl mb-1.5 font-semibold text-gray-800">
            Merchandise Mart
          </h1>
          <p className="text-gray-600 res_text">New York City, United States</p>

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
                <span>2 Baths</span>
              </p>
            </div>
            <div className=" flex-1  p-3 md:p-4 2xl:p-6 border-r border-[#28303F1A]">
              <h3 className="res_text mb-3  text-[#28303FCC]">Bedrooms</h3>
              <p className="flex items-center gap-3">
                <Image src="/images/bed.svg" width={40} height={40} alt="Bed" />
                <span>2 Beds</span>
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
                <span>360 sq.ft</span>
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="mt-4 p-4 bg-[#FDFDFD] md:p-6  rounded-2xl border border-[#28303F1A]">
            <h2 className="2xl:text-lg font-semibold">About This Property</h2>
            <p className="text-gray-600 my-4">
              Experience luxury at its finest in this modern 5-bedroom home fe
              indoor pool, open-concept living spaces, and scenic city
              views.aturing an indoor pool, open-concept living spaces, and
              scenic city views. Experience luxury at its finest in this modern
              5-bedroom home featuring an open-concept living spaces, and scenic
              city views.aturing an indoor pool.
            </p>
            <button className="px-5 py-3 rounded-full bg-[#F7F7F7] font-semibold res_text border border-[#28303F1A]">
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
                {Array.from({ length: 6 }).map((_, index) => (
                  <p key={index} className="res_text text-[#28303FCC]">
                    Interior Details
                  </p>
                ))}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <p key={index} className="res_text text-[#28303FCC]">
                    Interior Details
                  </p>
                ))}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <p key={index} className="res_text text-[#28303FCC]">
                    Interior Details
                  </p>
                ))}
              </div>
              <div className=" bg-white space-y-3 border flex-grow border-[#28303F1A] rounded-2xl p-4 xl:p-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <p key={index} className="res_text text-[#28303FCC]">
                    Interior Details
                  </p>
                ))}
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
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map will be embedded here</p>
            </div>
          </div>
        </div>

        {/* Right Section (Pricing & Contact) */}
        <div className="space-y-4">
          <div className="w-full md:w-[300px] 2xl:w-[400px] bg-white border border-primary-100  rounded-2xl p-4">
            <h2 className="text-xl font-semibold ">$1,075–$1,650/month</h2>
            <button className="bg-primary text-white font-semibold w-full py-3 rounded-full mt-4">
              Check Availability
            </button>
            <button className="bg-[#3A99D31A] text-primary font-semibold w-full py-3 rounded-full mt-4">
              Request Visit
            </button>
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
              <span className="text-gray-800 underline">(555) 123-9876</span>
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
