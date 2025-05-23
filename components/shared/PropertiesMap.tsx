"use client";

import { useEffect, useRef, useState } from "react";
import { Property } from "@/lib/types/property";
import { FaMapMarkerAlt, FaStar, FaHeart } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";

interface PropertyMapProps {
  properties: Property[];
  userLocation?: { lat: number; lng: number };
  onLocationChange?: (location: { lat: number; lng: number }) => void;
  onBoundsChange?: (bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  }) => void;
}

declare global {
  interface Window {
    google: any;
    __googleMapsScriptId?: string;
  }
}

export default function PropertiesMap({
  properties,
  userLocation,
  onLocationChange,
  onBoundsChange,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const infoWindowRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const scriptId = "google-maps-script";
    window.__googleMapsScriptId = scriptId;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        console.log("Google Maps script already loaded");
        initializeMap();
        return;
      }

      if (document.querySelector(`#${scriptId}`)) {
        console.log("Script tag exists, waiting for load");
        return;
      }

      setLoading(true);
      setError(null);

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        initializeMap();
      };

      script.onerror = () => {
        setError("Failed to load Google Maps script");
        setLoading(false);
        console.error("Failed to load Google Maps script");
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) {
        setError("Google Maps API not available");
        setLoading(false);
        console.error("Google Maps API not available");
        return;
      }

      try {
        const initialLocation = userLocation || { lat: 40.7128, lng: -74.006 };
        setCurrentLocation(initialLocation);

        if (mapInstance.current) {
          window.google.maps.event.clearInstanceListeners(mapInstance.current);
        }

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        infoWindowRef.current = new window.google.maps.InfoWindow({
          maxWidth: 350,
        });

        mapInstance.current.addListener("bounds_changed", () => {
          const bounds = mapInstance.current.getBounds();
          if (bounds && onBoundsChange) {
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            onBoundsChange({
              ne: { lat: ne.lat(), lng: ne.lng() },
              sw: { lat: sw.lat(), lng: sw.lng() },
            });
          }
        });

        if (navigator.geolocation && !userLocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setCurrentLocation(pos);
              mapInstance.current?.setCenter(pos);
              onLocationChange?.(pos);
              console.log("Geolocation set:", pos);
            },
            () => {
              console.warn("Geolocation permission denied");
            }
          );
        }

        setLoading(false);
        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Map initialization error:", err);
        setError("Failed to initialize map");
        setLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      if (mapInstance.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(
          mapInstance.current
        );
      }

      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [userLocation, onLocationChange, onBoundsChange]);

  // Initialize Autocomplete
  useEffect(() => {
    if (
      !window.google?.maps?.places ||
      !searchInputRef.current ||
      loading ||
      error
    ) {
      return;
    }

    try {
      console.log("Initializing Autocomplete");
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["geocode"],
          fields: ["geometry", "formatted_address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log("Place selected:", place);

        if (!place.geometry || !place.geometry.location) {
          console.warn("No valid location selected");
          setError("Please select a valid location");
          return;
        }

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        console.log("Centering map to:", location);
        mapInstance.current.setCenter(location);
        setCurrentLocation(location);
        onLocationChange?.(location);
        setError(null); // Clear any previous errors
      });

      return () => {
        window.google?.maps?.event?.clearListeners?.(
          autocomplete,
          "place_changed"
        );
      };
    } catch (err) {
      console.error("Autocomplete initialization error:", err);
      setError("Failed to initialize search");
    }
  }, [loading, error, onLocationChange]);

  function createCustomMarkerIcon(isFeatured: boolean, price: string): string {
    const color = isFeatured ? "#FF5252" : "#000";
    const textColor = "#FFFFFF";
    const tagColor = isFeatured ? "#D32F2F" : "#333";
    const pointerColor = tagColor;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80">
      <rect x="10" y="5" width="40" height="30" rx="4" fill="${tagColor}"/>
      <path d="M25,35 L35,35 L30,45 Z" fill="${pointerColor}"/>
      <text x="30" y="25" font-family="Arial" font-size="14" font-weight="bold" 
            text-anchor="middle" fill="${textColor}">${price}</text>
      <circle cx="30" cy="65" r="12" fill="${color}" stroke="#FFFFFF" stroke-width="5"/>
    </svg>
  `)}`;
  }

  // Create markers for properties
  useEffect(() => {
    if (!mapInstance.current || !window.google?.maps || loading || error) {
      return;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = properties
      .map((property) => {
        try {
          let lat, lng;
          if (property.locationGeo?.coordinates?.length === 2) {
            [lng, lat] = property.locationGeo.coordinates;
          } else if (property.address?.lat && property.address?.lng) {
            lat = property.address.lat;
            lng = property.address.lng;
          } else {
            return null;
          }

          const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(property.price || 0);

          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstance.current,
            icon: {
              url: createCustomMarkerIcon(property.isFeatured, formattedPrice),
              scaledSize: new window.google.maps.Size(60, 80),
              anchor: new window.google.maps.Point(30, 80),
            },
          });

          marker.addListener("click", () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close();

              const container = document.createElement("div");
              container.className = "property-info-window";

              container.innerHTML = `
                <div class="bg-white rounded-[16px] overflow-hidden w-full">
                  <div class="relative">
                    <img src="${
                      property.featuredImage ||
                      property.photos[0] ||
                      "/images/prop.png"
                    }" alt="${
                property.title
              }" class="w-full h-48 object-cover" />
                    <div class="absolute top-2.5 left-2.5 flex gap-2">
                      ${
                        property.isFeatured
                          ? '<span class="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 py-2 rounded-full">Featured</span>'
                          : ""
                      }
                      ${
                        property.audience === "Affordable"
                          ? '<span class="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 py-2 rounded-full">Affordable</span>'
                          : ""
                      }
                    </div>
                    <button class="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/50 p-2 rounded-full">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>
                    </button>
                  </div>
                  <div class="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                    <div class="flex items-center justify-between">
                      <p class="bg-green-100 text-green-600 px-3 inline-flex items-center gap-1.5 py-1.5 text-xs rounded-full">
                        <svg class="w-3 h-3 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        Verified
                      </p>
                      <p class="bg-[#28303F1A] px-3 inline-flex items-center gap-1.5 py-1.5 text-xs rounded-full">
                        <svg class="w-3 h-3 -mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        4.3
                      </p>
                    </div>
                    <div class="flex items-start py-4 justify-between">
                      <div>
                        <h3 class="text-lg font-semibold">${property.title}</h3>
                        <p class="text-xs text-ellipsis text-gray-500">${
                          property.address.city
                        }, ${property.address.state}</p>
                      </div>
                    </div>
                    <div class="flex items-center p-1 bg-[#F7F7F7] rounded-full gap-1 text-gray-700 text-xs mt-2">
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img src="/images/bed.svg" alt="Bed" class="w-5 h-5" />
                        ${property.beds} Beds
                      </p>
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img src="/images/bath.svg" alt="Bath" class="w-5 h-5" />
                        ${property.bathrooms} Baths
                      </p>
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img src="/images/area.svg" alt="Area" class="w-5 h-5" />
                        ${property.squareFeet || "N/A"} SqFt
                      </p>
                    </div>
                    <div class="mt-3 flex items-center gap-3 border-t border-[#28303F1A] pt-3">
                      <a href="/property/${property._id}" class="flex-1">
                        <button class="px-1 py-2 flex items-center gap-1.5 rounded-lg">
                          <img src="/images/calendar.svg" alt="Tour" class="w-5 h-5" />
                          Tour
                        </button>
                      </a>
                      <button class="bg-[#3A99D3] flex-grow text-white px-4 py-3 rounded-full font-semibold">
                        Check Availability
                      </button>
                    </div>
                  </div>
                </div>
              `;

              infoWindowRef.current.setContent(container);
              infoWindowRef.current.open(mapInstance.current, marker);
            }
          });

          return marker;
        } catch (err) {
          console.error("Error creating marker:", err);
          return null;
        }
      })
      .filter(Boolean);

    markersRef.current = newMarkers;
  }, [properties, loading, error]);

  const handleRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
          mapInstance.current?.setCenter(pos);
          onLocationChange?.(pos);
          console.log("Refreshed to geolocation:", pos);
        },
        () => {
          console.warn("Geolocation permission denied");
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[700px] rounded-lg overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />

      {/* Search Bar */}
      {!loading && !error && (
        <div className="absolute top-2 left-2 w-64 sm:w-80 bg-white rounded-md shadow-md z-20">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="w-full px-4 py-3 text-xs rounded-lg border border-[#28303F1A] focus:outline-none focus:ring-2 focus:ring-[#3A99D3] placeholder-gray-400"
            aria-label="Search for a location"
          />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <button
          onClick={handleRefresh}
          className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-20 flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <FaMapMarkerAlt className="text-blue-500" />
          My Location
        </button>
      )}
    </div>
  );
}
