import { properties } from "@/app/(root)/profile/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import React from "react";
import { FiShare2 } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const BoostListing = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#28303F] text-white px-4 xl:px-8 py-2.5 2xl:py-3 res_text rounded-full font-medium">
          Boost New Listing
        </button>
      </DialogTrigger>
      <DialogContent className=" max-h-[95svh] rounded-3xl overflow-y-auto max-w-5xl">
        <DialogHeader className="hidden items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Boost Listing
          </DialogTitle>
          <DialogTrigger asChild>
            <button className="text-gray-500 hover:text-gray-800">
              <FiShare2 size={20} />
            </button>
          </DialogTrigger>
        </DialogHeader>
        <div className=" w-full   rounded-2xl   ">
          <div className=" w-full flex items-center justify-between gap-3 flex-col md:flex-row">
            <div>
              <h2 className="text-lg 2xl:text-2xl text-center md:text-start  font-semibold ">
                Your boosted listings
              </h2>
              <p className="text-primary-200 font-normal text-sm 2xl:text-base mt-2">
                You can see your boost listing from here.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-6 md:grid-cols-3 gap-2 xl:gap-4 2xl:gap-6">
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
                    className="w-full h-48  object-cover"
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
                  <div className="flex items-center pt-2 justify-between">
                    <div>
                      <h3 className="text-lg mb-1 font-semibold">
                        {property.title}
                      </h3>

                      <p className="text-xs 3xl:text-sm text-gray-500">
                        {property.location}
                      </p>
                    </div>
                  </div>
                  <p className="res_text font-medium inline-flex text-[#28303FCC] items-center gap-2 mt-4">
                    <MdOutlineRemoveRedEye className=" text-lg" />
                    2,345 Views
                  </p>

                  <div className="mt-3 flex gap-3 ">
                    <button className="border text-primary-200 border-[#3A99D31A] flex-1 flex-grow res_text  px-4 xl:px-6 py-[12px] rounded-full font-semibold">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between  mt-4">
            <Button className="bg-[#D4D4D41A] px-8 hover:text-white py-3.5 text-primary-200 rounded-full border border-primary-100 font-semibold">
              Back
            </Button>
            <Button className=" bg-primary text-white px-8 py-3.5 rounded-full font-semibold">
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoostListing;
