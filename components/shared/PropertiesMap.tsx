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
        initializeMap();
        return;
      }

      if (document.querySelector(`#${scriptId}`)) {
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
        initializeMap();
      };

      script.onerror = () => {
        setError("Failed to load Google Maps");
        setLoading(false);
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps) {
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
            },
            () => {
              console.warn("Geolocation permission denied");
            }
          );
        }

        setLoading(false);
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

  function createCustomMarkerIcon(isFeatured: boolean, price: string): string {
    const color = isFeatured ? "#FF5252" : "#000";
    const textColor = "#FFFFFF";
    const tagColor = isFeatured ? "#D32F2F" : "#333";
    const pointerColor = tagColor; // Same as tag color

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80">
      <!-- Price tag background with padding -->
      <rect x="10" y="5" width="40" height="30" rx="4" fill="${tagColor}"/>
      
      <!-- Pointer triangle connecting to marker -->
      <path d="M25,35 L35,35 L30,45 Z" fill="${pointerColor}"/>
      
      <!-- Price text with increased font size and padding -->
      <text x="30" y="25" font-family="Arial" font-size="14" font-weight="bold" 
            text-anchor="middle" fill="${textColor}">${price}</text>
      
      <!-- Marker circle -->
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

          // Format price for display
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
              anchor: new window.google.maps.Point(30, 80), // Anchor at bottom center
            },
          });

          marker.addListener("click", () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close();

              // Create container for React content
              const container = document.createElement("div");
              container.className = "property-info-window";

              // Render property info
              const content = (
                <div className="bg-white rounded-[16px] overflow-hidden w-full">
                  <div className="relative">
                    <img
                      src={
                        property.featuredImage ||
                        property.photos[0] ||
                        "/images/prop.png"
                      }
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-2">
                      {property.isFeatured && (
                        <span className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 py-2 rounded-full">
                          Featured
                        </span>
                      )}
                      {property.audience === "Affordable" && (
                        <span className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 py-2 rounded-full">
                          Affordable
                        </span>
                      )}
                    </div>
                    <button className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/50 p-2 rounded-full">
                      <FaHeart size={16} />
                    </button>
                  </div>
                  <div className="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                    <div className="flex items-center justify-between">
                      <p className="bg-green-100 text-green-600 px-3 inline-flex items-center gap-1.5 py-1.5 text-xs rounded-full">
                        <HiOutlineShieldCheck className="text-base -mt-0.5" />
                        Verified
                      </p>
                      <p className="bg-[#28303F1A] px-3 inline-flex items-center gap-1.5 py-1.5 text-xs rounded-full">
                        <FaStar className="text-base -mt-0.5" />
                        4.3
                      </p>
                    </div>
                    <div className="flex items-start py-4 justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {property.title}
                        </h3>
                        <p className="text-xs text-ellipsis text-gray-500">
                          {property.address.city}, {property.address.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-1 bg-[#F7F7F7] rounded-full gap-1 text-gray-700 text-xs mt-2">
                      <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img
                          src="/images/bed.svg"
                          alt="Bed"
                          className="w-5 h-5"
                        />
                        {property.beds} Beds
                      </p>
                      <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img
                          src="/images/bath.svg"
                          alt="Bath"
                          className="w-5 h-5"
                        />
                        {property.bathrooms} Baths
                      </p>
                      <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
                        <img
                          src="/images/area.svg"
                          alt="Area"
                          className="w-5 h-5"
                        />
                        {property.squareFeet || "N/A"} SqFt
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-3 border-t border-[#28303F1A] pt-3">
                      <Link
                        href={`/property/${property._id}`}
                        className="flex-1"
                      >
                        <button className="px-1 py-2 flex items-center gap-1.5 rounded-lg">
                          <img
                            src="/images/calendar.svg"
                            alt="Tour"
                            className="w-5 h-5"
                          />
                          Tour
                        </button>
                      </Link>
                      <button className="bg-[#3A99D3] flex-grow text-white px-4 py-3 rounded-full font-semibold">
                        Check Availability
                      </button>
                    </div>
                  </div>
                </div>
              );

              // For demo, we'll use innerHTML since we can't directly render React here
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
                    <div class="mt-3 w-full justify-center flex items-center gap-3 border-t border-[#28303F1A] pt-3">
                      <a  href="/property/${property._id}" className=" w-full"> 
                      <button class="bg-[#3A99D3] flex-grow text-white px-4 py-3 rounded-full font-semibold">
                      Visit Property 
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
        <>
          <button
            onClick={handleRefresh}
            className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-10 flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FaMapMarkerAlt className="text-blue-500" />
            My Location
          </button>
          {/* <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow-md z-10 text-sm flex items-center gap-2">
            <span className="font-semibold">{properties.length}</span>
            <span>
              {properties.length === 1 ? "Property" : "Properties"} Found
            </span>
          </div> */}
        </>
      )}
    </div>
  );
}
