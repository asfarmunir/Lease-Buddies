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
    audience?: "Affordable" | "Luxury" | "Any";
    amenities?: string[];
    squareFeet?: string;
  }) => void;
  onClearFilters: () => void;
  appliedFilters: {
    audience?: "Affordable" | "Luxury" | "Any";
    amenities?: string[];
    squareFeet?: string;
  };
}

const amenityCategories = {
  interior: [
    "Air Conditioning",
    "Hardwood Floors",
    "Walk-in Closet",
    "Carpet",
    "Fireplace",
  ],
  outdoor: ["Balcony", "Patio", "Garden", "Swimming Pool", "Garage"],
  utilities: [
    "Water Included",
    "Electricity Included",
    "Gas Included",
    "Trash Removal",
    "Recycling",
  ],
  otherFeatures: [
    "Wheelchair Access",
    "Elevator",
    "Gym",
    "Laundry Facilities",
    "Security System",
  ],
};

const Filters: React.FC<FiltersModalProps> = ({
  onApplyFilters,
  onClearFilters,
  appliedFilters,
}) => {
  const [tempFilters, setTempFilters] = useState({
    audience: "Any" as "Affordable" | "Luxury" | "Any",
    amenities: [] as string[],
    squareFeet: "",
  });

  useEffect(() => {
    setTempFilters({
      audience: appliedFilters.audience || "Any",
      amenities: appliedFilters.amenities || [],
      squareFeet: appliedFilters.squareFeet || "",
    });
  }, [appliedFilters]);

  const toggleAmenity = (amenity: string) => {
    setTempFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const selectAudience = (audience: "Affordable" | "Luxury" | "Any") => {
    setTempFilters((prev) => ({ ...prev, audience }));
  };

  const handleSquareFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters((prev) => ({ ...prev, squareFeet: e.target.value }));
  };

  const applyFilters = () => {
    onApplyFilters({
      audience: tempFilters.audience,
      amenities: tempFilters.amenities.length
        ? tempFilters.amenities
        : undefined,
      squareFeet: tempFilters.squareFeet || undefined,
    });
  };

  const clearAllFilters = () => {
    setTempFilters({
      audience: "Any",
      amenities: [],
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

        {/* Amenities by Category */}
        {Object.entries(amenityCategories).map(([category, amenities]) => (
          <div key={category} className="mt-4 border-y border-[#28303F1A] py-5">
            <h3 className="font-medium text-gray-700 capitalize">
              {category.replace(/([A-Z])/g, " $1")}
            </h3>
            <div className="flex flex-col gap-2 mt-2">
              {amenities.map((amenity) => (
                <div
                  key={amenity}
                  className={`w-full border px-4 res_text py-3 rounded-full text-left flex items-center gap-2 cursor-pointer ${
                    tempFilters.amenities.includes(amenity)
                      ? "bg-gray-200"
                      : "bg-white"
                  }`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  <Checkbox
                    checked={tempFilters.amenities.includes(amenity)}
                    className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                  />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Price Category */}
        <div className="border-b pb-5 pt-1 border-[#28303F1A]">
          <h3 className="font-medium text-gray-700 pb-2">Price Category</h3>
          <div className="flex justify-between mt-2">
            {["Affordable", "Luxury", "Any"].map((audience) => (
              <button
                key={audience}
                className={`px-8 py-3 flex-grow text-black res_text rounded-full ${
                  tempFilters.audience === audience
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
                onClick={() =>
                  selectAudience(audience as "Affordable" | "Luxury" | "Any")
                }
              >
                {audience}
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
