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
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>
            You can filter with additional information from here.
          </DialogDescription>
        </DialogHeader>

        {/* Popular Filters */}
        <div className="mt-4 border-y border-[#28303F1A] py-5">
          <h3 className="font-medium text-gray-700">Popular Filters</h3>
          <div className="flex flex-col gap-2 mt-2">
            {["A/C", "Dishwasher", "Garage Parking"].map((filter) => (
              <button
                key={filter}
                className={`w-full border px-4 res_text py-3 rounded-full text-left ${
                  filters.popular.includes(filter) ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => togglePopularFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Price Category */}
        <div className="border-b pb-5 pt-1 border-[#28303F1A]">
          <h3 className="font-medium text-gray-700 pb-2">Price Category</h3>
          <div className="flex justify-between mt-2">
            {["Affordable", "Luxury", "Any"].map((price) => (
              <button
                key={price}
                className={`px-8 py-3 text-black res_text rounded-full ${
                  filters.price === price ? "bg-gray-100 " : ""
                }`}
                onClick={() =>
                  selectPrice(price as "Affordable" | "Luxury" | "Any")
                }
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        {/* Laundry */}
        <div className="border-b pb-5 pt-1 border-[#28303F1A]">
          <h3 className="font-medium text-gray-700 pb-2">Laundry</h3>
          <div className="flex gap-4 mt-2">
            {[
              {
                title: "In Building",
                image: "/images/building.svg",
              },
              {
                title: "In Unit",
                image: "/images/unit.svg",
              },
            ].map((option, index) => (
              <button
                key={index}
                className={`flex-1 flex flex-col gap-1 items-center border rounded-2xl px-4 py-6 ${
                  filters.laundry === option.title ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() =>
                  selectLaundry(option.title as "In Building" | "In Unit")
                }
              >
                <Image src={option.image} width={50} height={50} alt="heehee" />
                <span className="text-gray-600 res_text">{option.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Special Housing */}
        <div className="mt-2">
          <h3 className="font-medium text-gray-700 pb-3">Special Housing</h3>

          {/* <button
            onClick={toggleSpecial}
            className={`w-full flex items-center gap-2 border px-4 py-2 rounded-md ${
              filters.special ? "bg-gray-200" : "bg-white"
            }`}
          >
            {filters.special ? <FaCheck className="text-blue-600" /> : null}
            Air Conditioning
          </button> */}
          <div
            className={`w-full border flex items-center gap-2 px-4 py-4 res_text rounded-full text-left 
              `}
          >
            <Checkbox className="data-[state=checked]:bg-[#28303F] border border-[#28303F]" />
            Air Conditioning
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-3.5 flex flex-col gap-3">
          <button className="bg-[#28303F] font-semibold text-white py-3 rounded-full">
            View Rentals
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
