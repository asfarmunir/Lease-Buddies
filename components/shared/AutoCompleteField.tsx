// components/LocationInput.tsx
"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useState } from "react";

interface LocationInputProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

const LocationInput = ({ onPlaceSelected }: LocationInputProps) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      fields={["address_components", "geometry", "formatted_address"]}
    >
      <input
        type="text"
        placeholder="Enter property address"
        className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-4 sm:px-5 w-full text-[#28303FCC]"
      />
    </Autocomplete>
  );
};

export default LocationInput;
