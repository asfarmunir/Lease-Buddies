"use client";

import { useEffect, useRef, useState } from "react";
import { Property } from "@/lib/types/property";
import { FaMapMarkerAlt, FaStar, FaHeart, FaCarAlt } from "react-icons/fa";
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
  searchTerm?: string; // Add searchTerm prop
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
  searchTerm, // Add searchTerm to props
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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
  }, [userLocation]);

  // Handle search term changes using Geocoding API
  useEffect(() => {
    if (!searchTerm || !window.google?.maps || loading || error) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchTerm }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        console.log("Geocoded search term:", searchTerm, location);
        mapInstance.current.setCenter(location);
        setCurrentLocation(location);
        onLocationChange?.(location);
        setError(null);
      } else {
        console.warn("Geocode was not successful:", status);
        setError("Unable to find location");
      }
    });
  }, [searchTerm, loading, error, onLocationChange]);

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
                   
                  </div>
                  <div class="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                   
                    <div class="flex items-start pb-4 justify-between">
                      <div>
                        <h3 class="text-lg font-bold capitalize">${
                          property.title
                        }</h3>
                        <p class="text-xs text-ellipsis font-semibold text-gray-500">${
                          property.address.city
                        }, ${property.address.state}</p>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 p-1 bg-[#F7F7F7] rounded-[8px] gap-1 text-gray-700 text-xs mt-2">
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-[8px] flex items-center gap-1.5 pl-0.5 py-1 pr-3 justify-center font-semibold">
                        ${property.bedrooms} Beds
                      </p>
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-[8px] flex items-center gap-1.5 pl-0.5 py-1 pr-3 justify-center font-semibold">
                        ${property.bathrooms} Baths
                      </p>
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-[8px] flex items-center gap-1.5 pl-0.5 py-1 pr-3 justify-center font-semibold">
                       
                        ${property.parkingAvailable} Parking
                      </p>
                      <p class="bg-white flex-1 border border-[#28303F1A] rounded-[8px] flex items-center gap-1.5 pl-0.5 py-1 pr-3 justify-center font-semibold">
                        ${property.squareFeet || "N/A"} sqFt
                      </p>
                    </div>
                    <div class="mt-3 flex items-center gap-3 border-t border-[#28303F1A] pt-3 w-full">
                      <a href="/property/${property._id}" class="flex-1 w-full">
                       
                      <button class="bg-[#3A99D3] flex-grow text-white px-4 py-3 w-full rounded-full font-semibold">
                        Quick Look
                      </button>
                      </a>

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
