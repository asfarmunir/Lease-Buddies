"use client";
import { useState } from "react";
import Image from "next/image";
import { FaBath, FaBed, FaRulerCombined, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineShieldCheck } from "react-icons/hi2";

const properties = [
  {
    id: 1,
    title: "Merchandise Mart",
    location: "New York City, United States",
    beds: 2,
    baths: 8,
    size: "360 SqFt",
    rating: 4.9,
    price: "$1200",
    tags: ["Featured", "Rent Special"],
    verified: true,
  },
  {
    id: 2,
    title: "Merchandise Mart",
    location: "New York City, United States",
    beds: 2,
    baths: 8,
    size: "360 SqFt",
    rating: 4.9,
    price: "$1000",
    tags: ["Featured", "Rent Special"],
    verified: true,
  },
  {
    id: 3,
    title: "Merchandise Mart",
    location: "New York City, United States",
    beds: 2,
    baths: 8,
    size: "360 SqFt",
    rating: 4.9,
    price: "$1800",
    tags: ["Featured", "Rent Special"],
    verified: true,
  },
];

const mapMarkers = [
  { id: 1, price: "$1200", x: "left-10", y: "top-10" },
  { id: 2, price: "$1000", x: "left-24", y: "top-32" },
  { id: 3, price: "$370", x: "left-40", y: "top-48" },
  { id: 4, price: "$2000", x: "left-60", y: "top-20" },
  { id: 5, price: "$1800", x: "left-80", y: "top-40" },
];

export default function ApartmentListings() {
  const [selectedFilter, setSelectedFilter] = useState("Pets");

  return (
    <div className="p-4 md:p-6">
      {/* Filters */}
      {/* <div className="flex gap-4 items-center">
        <button className="bg-gray-100 px-4 py-2 rounded-full">
          Bed/Baths
        </button>
        <button className="bg-gray-100 px-4 py-2 rounded-full">Price</button>
        <button className="bg-gray-100 px-4 py-2 rounded-full">Type</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
          Pets
        </button>
      </div> */}

      <div className="border border-[#28303F1A] p-4 xl:p-6 rounded-[20px]">
        <h2 className="text-xl 2xl:text-2xl text-primary-50 font-semibold mt-6">
          Apartments For Rent In New York, USA
        </h2>
        <p className="text-primary-50 mt-2 text-xs 2xl:text-sm">
          Over 1,000 Homes
        </p>

        {/* Listings and Map */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 mt-6">
          {/* Apartment Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-[16px]  overflow-hidden"
              >
                <div className=" relative">
                  <Image
                    src="/images/prop.png"
                    alt={property.title}
                    width={400}
                    height={250}
                    className="w-full h-48 2xl:h-56 object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-2">
                    {property.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 2xl:px-3 py-2 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/50 p-2 rounded-full">
                    <IoMdHeartEmpty size={20} />
                  </button>
                </div>
                <div className="p-4 border border-[#28303F1A] rounded-[16px]  -mt-4  bg-white  relative  ">
                  <div className="flex items-center justify-between">
                    <p className="bg-green-100 text-green-600 px-3 inline-flex items-center gap-1.5  py-1.5 text-xs rounded-full">
                      <HiOutlineShieldCheck className="text-base -mt-0.5" />
                      Verified
                    </p>
                    <p className="bg-[#28303F1A]  px-3 inline-flex items-center gap-1.5  py-1.5 text-xs rounded-full">
                      <FaStar className="text-base -mt-0.5" />
                      4.3
                    </p>
                  </div>
                  <div className="flex items-end py-4 justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {property.title}
                      </h3>

                      <p className="text-xs 3xl:text-sm text-gray-500">
                        {property.location}
                      </p>
                    </div>
                    <p className="bg-[#3A99D31A] text-[#0479B7] px-2 2xl:px-2.5 py-2 border border-[#0077B61A] text-[11px] 3xl:text-xs rounded-full">
                      Quick Look
                    </p>
                  </div>
                  <div className="flex items-center p-1 bg-[#F7F7F7] rounded-full gap-1 text-gray-700 text-[12px] 2xl:text-[10px] 3xl:text-sm mt-2">
                    <p className=" bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5   pl-0.5 py-0.5 pr-3">
                      <Image
                        src="/images/bed.svg"
                        alt="Bed"
                        width={20}
                        height={20}
                        className="
                          w-7 
                            h-7
                            2xl:w-6
                            2xl:h-6
                            3xl:w-8
                            3xl:h-8
                        "
                      />{" "}
                      {property.beds} Beds
                    </p>
                    <p className=" bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5   pl-0.5 py-0.5 pr-3">
                      <Image
                        src="/images/bath.svg"
                        alt="Bed"
                        width={20}
                        height={20}
                        className="
                          w-7 
                            h-7
                            2xl:w-6
                            2xl:h-6
                            3xl:w-8
                            3xl:h-8
                        "
                      />{" "}
                      {property.baths} Baths
                    </p>
                    <p className=" bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5   pl-0.5 py-0.5 pr-3">
                      <Image
                        src="/images/area.svg"
                        alt="Bed"
                        width={20}
                        height={20}
                        className="
                          w-7 
                            h-7
                            2xl:w-6
                            2xl:h-6
                            3xl:w-8
                            3xl:h-8
                        "
                      />{" "}
                      {property.size}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-3 border-t border-[#28303F1A] pt-3">
                    <button className=" px-1 py-2 flex items-center res_text gap-1.5  rounded-lg">
                      <Image
                        src="/images/calendar.svg"
                        alt="Phone"
                        width={20}
                        height={20}
                        className="-mt-0.5"
                      />
                      Tour
                    </button>
                    <button className="bg-[#3A99D3] flex-grow res_text text-white px-4 xl:px-6 py-[14px] rounded-full font-semibold">
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div
            className="relative w-full bg-gray-200 h-[700px] rounded-lg overflow-hidden"
            style={{
              backgroundImage: "url('/images/map.png')",
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          >
            <h3 className="absolute top-2 left-2 bg-white px-4 py-2 rounded-md text-sm font-semibold shadow">
              Points of Interest
            </h3>
            {mapMarkers.map((marker) => (
              <div
                key={marker.id}
                className={`absolute ${marker.x} ${marker.y} bg-black text-white px-3 py-1 rounded-full shadow-md`}
              >
                {marker.price}
              </div>
            ))}
            <button className="absolute bottom-2 left-2 bg-white px-4 py-2 rounded-lg shadow">
              Refresh Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
