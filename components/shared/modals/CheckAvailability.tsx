import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "@/components/ui/input";

// Define types for state
interface FiltersState {
  popular: string[];
  price: "Affordable" | "Luxury" | "Any";
  laundry: "In Building" | "In Unit" | null;
  special: boolean;
}

const Filters: React.FC = () => {
  const [filters, setFilters] = useState<FiltersState>({
    popular: [],
    price: "Affordable",
    laundry: null,
    special: false,
  });

  // Handle popular filter toggle
  const togglePopularFilter = (filter: string) => {
    setFilters((prev) => ({
      ...prev,
      popular: prev.popular.includes(filter)
        ? prev.popular.filter((f) => f !== filter)
        : [...prev.popular, filter],
    }));
  };

  // Handle price selection
  const selectPrice = (price: "Affordable" | "Luxury" | "Any") => {
    setFilters((prev) => ({ ...prev, price }));
  };

  // Handle laundry selection
  const selectLaundry = (option: "In Building" | "In Unit") => {
    setFilters((prev) => ({ ...prev, laundry: option }));
  };

  // Handle special housing checkbox
  const toggleSpecial = () => {
    setFilters((prev) => ({ ...prev, special: !prev.special }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      popular: [],
      price: "Affordable",
      laundry: null,
      special: false,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Image
          src="/images/filter.svg"
          width={50}
          height={50}
          alt="Filter"
          className="w-[45px] 2xl:w-[50px] 3xl:w-[60px]"
        />
      </DialogTrigger>

      <DialogContent className="rounded-3xl max-w-xl max-h-[95svh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="mb-2">Check Availability</DialogTitle>
          <DialogDescription>
            you can check property aviability from here.{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:min-w-[506px] items-center gap-4 ">
          <div className=" w-full space-y-2">
            <label
              htmlFor=""
              className=" pl-4   res_text font-[500] text-start"
            >
              Cardholder Name
            </label>
            <Input
              placeholder="Enter carholder name"
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
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
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
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
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
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
                className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
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
                className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
              />
            </div>
          </div>
          <div className=" w-full space-y-2">
            <label
              htmlFor=""
              className=" pl-4   res_text font-[500] text-start"
            >
              Email
            </label>
            <textarea
              placeholder="Enter email"
              className="bg-[#F7F7F7] text-xs h-24 md:text-sm 3xl:text-base rounded-3xl border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-3.5 flex flex-col gap-3">
          <button className="bg-primary font-semibold text-white py-4 res_text  rounded-full">
            Request Tour
          </button>
          <button className="text-gray-600 res_text" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filters;
