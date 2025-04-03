import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Checkbox } from "../../ui/checkbox";

interface FiltersModalProps {
  onApplyFilters: (filters: {
    price: "Affordable" | "Luxury" | "Any";
    popular: string[];
    squareFeet?: string;
  }) => void;
  onClearFilters: () => void;
  appliedFilters: {
    audience?: "Affordable" | "Luxury" | "Any";
    amenities?: string[];
    squareFeet?: string;
  };
}

const Filters: React.FC<FiltersModalProps> = ({
  onApplyFilters,
  onClearFilters,
  appliedFilters,
}) => {
  // Initialize temp filters with applied filters
  const [tempFilters, setTempFilters] = useState({
    price: "Any" as "Affordable" | "Luxury" | "Any",
    popular: [] as string[],
    squareFeet: "",
  });

  // Sync with applied filters when they change
  useEffect(() => {
    setTempFilters({
      price: appliedFilters.audience || "Any",
      popular: appliedFilters.amenities || [],
      squareFeet: appliedFilters.squareFeet || "",
    });
  }, [appliedFilters]);

  // Handle popular filter toggle
  const togglePopularFilter = (filter: string) => {
    setTempFilters((prev) => ({
      ...prev,
      popular: prev.popular.includes(filter)
        ? prev.popular.filter((f) => f !== filter)
        : [...prev.popular, filter],
    }));
  };

  // Handle price selection
  const selectPrice = (price: "Affordable" | "Luxury" | "Any") => {
    setTempFilters((prev) => ({ ...prev, price }));
  };

  // Handle square feet change
  const handleSquareFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters((prev) => ({ ...prev, squareFeet: e.target.value }));
  };

  // Apply filters
  const applyFilters = () => {
    onApplyFilters({
      price: tempFilters.price,
      popular: tempFilters.popular,
      squareFeet: tempFilters.squareFeet || undefined,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setTempFilters({
      price: "Any",
      popular: [],
      squareFeet: "",
    });
    onClearFilters();
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
        {/* Show indicator if any modal filters are applied */}
        {(appliedFilters.audience ||
          appliedFilters.amenities?.length ||
          appliedFilters.squareFeet) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
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
          <h3 className="font-medium text-gray-700">Amenities</h3>
          <div className="flex flex-col gap-2 mt-2">
            {[
              "Air Conditioning",
              "Carpet",
              "Business Center",
              "Balcony",
              "Assigned Parking",
            ].map((filter) => (
              <div
                key={filter}
                className={`w-full border px-4 res_text py-3 rounded-full text-left flex items-center gap-2 cursor-pointer ${
                  tempFilters.popular.includes(filter)
                    ? "bg-gray-200"
                    : "bg-white"
                }`}
                onClick={() => togglePopularFilter(filter)}
              >
                <Checkbox
                  checked={tempFilters.popular.includes(filter)}
                  className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                />
                <span>{filter}</span>
              </div>
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
                className={`px-8 py-3 flex-grow text-black res_text rounded-full ${
                  tempFilters.price === price ? "bg-gray-100 font-semibold" : ""
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

        {/* Square Feet */}
        <div className="mt-2 space-y-3">
          <h3 className="font-medium text-gray-700">Square Feet</h3>
          <input
            type="text"
            placeholder="Enter square feet"
            value={tempFilters.squareFeet}
            onChange={handleSquareFeetChange}
            className="w-full border flex items-center gap-2 px-4 py-4 res_text rounded-full text-left"
          />
        </div>

        {/* Buttons */}
        <div className="mt-3.5 flex flex-col gap-3">
          <button
            className="bg-[#28303F] font-semibold text-white py-3 rounded-full"
            onClick={applyFilters}
          >
            View Rentals
          </button>
          <button className="text-gray-600 res_text" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filters;
