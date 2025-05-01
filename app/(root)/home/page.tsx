"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoChevronDown } from "react-icons/go";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import FIlters from "@/components/shared/modals/FIlters";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FilterOptions, Property } from "@/lib/types/property";
import Link from "next/link";
import PropertiesMap from "@/components/shared/PropertiesMap";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
export default function ApartmentListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempFilters, setTempFilters] = useState<{
    bedrooms: string | null;
    bathrooms: string | null;
    types: string[];
    pets: string[];
    priceRange: [number, number];
  }>({
    bedrooms: null,
    bathrooms: null,
    types: [],
    pets: [],
    priceRange: [1000, 3000],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/properties?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const types = searchParams.getAll("type");
    const pets = searchParams.getAll("petsAllowed");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    setTempFilters({
      bedrooms,
      bathrooms,
      types,
      pets,
      priceRange: [
        minPrice ? parseInt(minPrice) : 1000,
        maxPrice ? parseInt(maxPrice) : 3000,
      ],
    });

    setAppliedFilters({
      type: types.length ? types : undefined,
      petsAllowed: pets.length ? pets : undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });

    fetchProperties();
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const params = new URLSearchParams();

    // Set all filters from searchParams first
    searchParams.forEach((value, key) => {
      if (
        key !== "bedrooms" &&
        key !== "bathrooms" &&
        key !== "type" &&
        key !== "petsAllowed" &&
        key !== "minPrice" &&
        key !== "maxPrice"
      ) {
        params.set(key, value);
      }
    });

    // Apply new filters
    if (newFilters.type !== undefined) {
      params.delete("type");
      if (newFilters.type && newFilters.type.length > 0) {
        newFilters.type.forEach((type) => params.append("type", type));
      }
    }

    if (newFilters.petsAllowed !== undefined) {
      params.delete("petsAllowed");
      if (newFilters.petsAllowed && newFilters.petsAllowed.length > 0) {
        newFilters.petsAllowed.forEach((pet) =>
          params.append("petsAllowed", pet)
        );
      }
    }

    if (newFilters.bedrooms !== undefined) {
      if (newFilters.bedrooms) params.set("bedrooms", newFilters.bedrooms);
      else params.delete("bedrooms");
    }

    if (newFilters.bathrooms !== undefined) {
      if (newFilters.bathrooms) params.set("bathrooms", newFilters.bathrooms);
      else params.delete("bathrooms");
    }

    if (newFilters.minPrice !== undefined) {
      if (newFilters.minPrice)
        params.set("minPrice", newFilters.minPrice.toString());
      else params.delete("minPrice");
    }

    if (newFilters.maxPrice !== undefined) {
      if (newFilters.maxPrice)
        params.set("maxPrice", newFilters.maxPrice.toString());
      else params.delete("maxPrice");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setTempFilters({
      bedrooms: null,
      bathrooms: null,
      types: [],
      pets: [],
      priceRange: [1000, 3000],
    });
    router.push(pathname);
    setAppliedFilters({});
  };

  if (loading)
    return (
      <div className="p-4 text-center h-[80svh] animate-pulse  flex-col flex items-center justify-center">
        <Image
          src="/logo.svg"
          alt="No properties found"
          width={400}
          height={400}
          className="w-56 h-auto"
        />
        <p className="text-gray-500 text-lg font-semibold mt-4">
          Getting Perfect Properties for you...
        </p>
      </div>
    );
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:px-6 2xl:px-10">
      {/* Filters */}
      <div className="hidden sm:flex items-center gap-2 my-3">
        <div className="flex items-center w-fit p-1 bg-[#F7F7F7] rounded-full gap-2 text-gray-700 text-[12px] 2xl:text-[10px] 3xl:text-sm">
          {/* Beds/Baths Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex font-semibold items-center bg-white px-4 py-3 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text">
              Beds/Baths
              <GoChevronDown />
              {appliedFilters.bedrooms || appliedFilters.bathrooms ? (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] sm:w-[400px] rounded-3xl shadow-lg bg-white p-4 md:px-6 ml-6 mt-2">
              <h2 className="res_text">Bedrooms</h2>
              <div className="flex items-center w-full mb-4 p-1 my-2 bg-[#F7F7F7] rounded-full gap-1.5 text-gray-700 text-[12px] 2xl:text-[10px] 3xl:text-sm mt-2">
                {["Studio", "1", "2", "3", "4+"].map((option) => (
                  <button
                    key={option}
                    className={`flex-grow font-semibold text-center px-4 py-2.5 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text ${
                      tempFilters.bedrooms === option
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        bedrooms: prev.bedrooms === option ? null : option,
                      }))
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
              <h2 className="res_text">Bathrooms</h2>
              <div className="flex items-center w-full mb-4 p-1 my-2 bg-[#F7F7F7] rounded-full gap-1.5 text-gray-700 text-[12px] 2xl:text-[10px] 3xl:text-sm mt-2">
                {["1", "2", "3", "4+"].map((option) => (
                  <button
                    key={option}
                    className={`flex-grow font-semibold text-center px-4 py-2.5 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text ${
                      tempFilters.bathrooms === option
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        bathrooms: prev.bathrooms === option ? null : option,
                      }))
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t-2 border-[#28303F1A]">
                <button
                  className="rounded-full font-semibold res_text w-full py-3.5 bg-[#28303F] text-white"
                  onClick={() => {
                    updateFilters({
                      bedrooms: tempFilters.bedrooms || undefined,
                      bathrooms: tempFilters.bathrooms || undefined,
                    });
                  }}
                >
                  View Rentals
                </button>
                <button
                  className="rounded-full w-full res_text py-3.5 text-[#28303F]"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("bedrooms");
                    params.delete("bathrooms");
                    router.push(`${pathname}?${params.toString()}`);
                    setTempFilters((prev) => ({
                      ...prev,
                      bedrooms: null,
                      bathrooms: null,
                    }));
                  }}
                >
                  Clear
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex font-semibold items-center bg-white px-4 py-3 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text">
              Price
              <GoChevronDown />
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] sm:w-[400px] rounded-3xl shadow-lg bg-white p-4 md:px-6 ml-6 mt-2">
              <div className="w-full py-4 justify-center items-center flex flex-col">
                <Image
                  src="/images/range.svg"
                  width={270}
                  height={270}
                  alt="Price range"
                />
                <Slider
                  value={tempFilters.priceRange}
                  onValueChange={(value) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      priceRange: value as [number, number],
                    }))
                  }
                  max={5000}
                  min={0}
                  className="max-w-xs 2xl:max-w-sm mx-auto"
                  step={100}
                />
              </div>
              <div className="py-3 flex gap-3 items-center justify-between">
                <div className="flex-grow">
                  <h4 className="res_text mb-1">Minimum</h4>
                  <p className="border border-[#28303F1A] p-4 text-center rounded-full">
                    <span className="font-semibold">
                      ${tempFilters.priceRange[0].toLocaleString()}
                    </span>{" "}
                    /mo
                  </p>
                </div>
                <div className="flex-grow">
                  <h4 className="res_text mb-1">Maximum</h4>
                  <p className="border border-[#28303F1A] p-4 text-center rounded-full">
                    <span className="font-semibold">
                      ${tempFilters.priceRange[1].toLocaleString()}
                    </span>{" "}
                    /mo
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-2 border-t-2 border-[#28303F1A]">
                <button
                  className="rounded-full font-semibold res_text w-full py-3.5 bg-[#28303F] text-white"
                  onClick={() => {
                    updateFilters({
                      minPrice: tempFilters.priceRange[0],
                      maxPrice: tempFilters.priceRange[1],
                    });
                  }}
                >
                  View Rentals
                </button>
                <button
                  className="rounded-full w-full res_text py-3.5 text-[#28303F]"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    router.push(`${pathname}?${params.toString()}`);
                    setTempFilters((prev) => ({
                      ...prev,
                      priceRange: [1000, 3000],
                    }));
                  }}
                >
                  Clear
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex font-semibold items-center bg-white px-4 py-3 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text">
              Type
              <GoChevronDown />
              {appliedFilters.type?.length ? (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] sm:w-[400px] rounded-3xl shadow-lg bg-white p-4 md:px-6 ml-6 mt-2">
              {["Apartment", "Condo", "House", "Townhouse", "Other"].map(
                (type) => (
                  <div
                    key={type}
                    className={`flex items-center gap-2 p-4 rounded-full ${
                      tempFilters.types.includes(type) ? "bg-[#28303F]/15" : ""
                    }`}
                  >
                    <Checkbox
                      checked={tempFilters.types.includes(type)}
                      onCheckedChange={(checked) => {
                        setTempFilters((prev) => ({
                          ...prev,
                          types: checked
                            ? [...prev.types, type]
                            : prev.types.filter((t) => t !== type),
                        }));
                      }}
                      className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                    />
                    <p className="text-sm">{type}</p>
                  </div>
                )
              )}
              <div className="pt-4 mt-2 border-t-2 border-[#28303F1A]">
                <button
                  className="rounded-full font-semibold res_text w-full py-3.5 bg-[#28303F] text-white"
                  onClick={() => {
                    updateFilters({
                      type: tempFilters.types.length
                        ? tempFilters.types
                        : undefined,
                    });
                  }}
                >
                  View Rentals
                </button>
                <button
                  className="rounded-full w-full res_text py-3.5 text-[#28303F]"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("type");
                    router.push(`${pathname}?${params.toString()}`);
                    setTempFilters((prev) => ({
                      ...prev,
                      types: [],
                    }));
                  }}
                >
                  Clear
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pets Allowed Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex font-semibold items-center bg-white px-4 py-3 rounded-full gap-2 2xl:gap-8 focus:outline-none res_text">
              Pets Allowed
              <GoChevronDown />
              {appliedFilters.petsAllowed?.length ? (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] sm:w-[400px] rounded-3xl shadow-lg bg-white p-4 md:px-6 ml-6 mt-2">
              {["Dogs Allowed", "Cats Allowed", "No Pets"].map((pet) => (
                <div
                  key={pet}
                  className={`flex items-center gap-2 p-4 rounded-full ${
                    tempFilters.pets.includes(pet) ? "bg-[#28303F]/15" : ""
                  }`}
                >
                  <Checkbox
                    checked={tempFilters.pets.includes(pet)}
                    onCheckedChange={(checked) => {
                      setTempFilters((prev) => ({
                        ...prev,
                        pets: checked
                          ? [...prev.pets, pet]
                          : prev.pets.filter((p) => p !== pet),
                      }));
                    }}
                    className="data-[state=checked]:bg-[#28303F] border border-[#28303F]"
                  />
                  <p className="text-sm">{pet}</p>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t-2 border-[#28303F1A]">
                <button
                  className="rounded-full font-semibold res_text w-full py-3.5 bg-[#28303F] text-white"
                  onClick={() => {
                    updateFilters({
                      petsAllowed: tempFilters.pets.length
                        ? tempFilters.pets
                        : undefined,
                    });
                  }}
                >
                  View Rentals
                </button>
                <button
                  className="rounded-full w-full res_text py-3.5 text-[#28303F]"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("petsAllowed");
                    router.push(`${pathname}?${params.toString()}`);
                    setTempFilters((prev) => ({
                      ...prev,
                      pets: [],
                    }));
                  }}
                >
                  Clear
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <FIlters
          onApplyFilters={(filters) => {
            const params = new URLSearchParams(searchParams.toString());

            // Update audience filter
            if (filters.audience && filters.audience !== "Any") {
              params.set("audience", filters.audience);
            } else {
              params.delete("audience");
            }

            // Update amenities filters
            params.delete("amenities");
            if (filters.amenities && filters.amenities.length > 0) {
              filters.amenities.forEach((amenity) =>
                params.append("amenities", amenity)
              );
            }

            // Update square feet filter
            if (filters.squareFeet) {
              params.set("squareFeet", filters.squareFeet);
            } else {
              params.delete("squareFeet");
            }

            router.push(`${pathname}?${params.toString()}`);
          }}
          onClearFilters={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("audience");
            params.delete("amenities");
            params.delete("squareFeet");
            router.push(`${pathname}?${params.toString()}`);
          }}
          appliedFilters={{
            audience: searchParams.get("audience") as
              | "Affordable"
              | "Luxury"
              | undefined,
            amenities: searchParams.getAll("amenities"),
            squareFeet: searchParams.get("squareFeet") || undefined,
          }}
        />
      </div>
      <div className="border border-[#28303F1A] p-4 xl:p-6 rounded-[20px]">
        <h2 className="text-xl 2xl:text-2xl text-primary-50 font-semibold">
          Apartments For Rent In New York, USA
        </h2>
        <p className="text-primary-50 mt-2 text-xs 2xl:text-sm">
          {properties.length}{" "}
          {properties.length === 1 ? "Property" : "Properties"}
        </p>

        {/* Listings and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
          {/* Apartment Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Map Section */}
          {/* <div
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
          </div> */}
          <PropertiesMap
            properties={properties}
            // userLocation={userLocation} // Optional: pass user location if you have it
            onLocationChange={(location) => {
              // Handle location changes if needed
            }}
            onBoundsChange={async (bounds) => {
              // Optional: implement bounds-based filtering
              // This will be called when the map is moved/zoomed
              // You can use the bounds to fetch properties in the visible area
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Property Card Component
function PropertyCard({ property }: { property: Property }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    // Check if property is in user's favorites when component mounts
    const checkFavoriteStatus = async () => {
      //@ts-ignore
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user/favorites");
          if (response.ok) {
            const data = await response.json();
            setIsFavorited(
              data.favorites.some((fav: any) => fav._id === property._id)
            );
          }
        } catch (error) {
          console.error("Failed to check favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [session, property._id]);

  const toggleFavorite = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: property._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
        toast.success(
          data.isFavorited ? "Added to favorites!" : "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[16px]   overflow-hidden">
      <div className="relative">
        <Image
          src={
            property.featuredImage || property.photos[0] || "/images/prop.png"
          }
          alt={property.title}
          width={400}
          height={250}
          className="w-full h-48 2xl:h-56 object-cover"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-2">
          {property.isFeatured && (
            <span className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 2xl:px-3 py-2 rounded-full">
              Featured
            </span>
          )}
          {property.audience === "Affordable" && (
            <span className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 2xl:px-3 py-2 rounded-full">
              Affordable
            </span>
          )}
        </div>
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorited
              ? "text-red-500 bg-white/90 hover:bg-white"
              : "text-white bg-black/20 hover:bg-black/50"
          }`}
        >
          {isFavorited ? <FaHeart size={20} /> : <IoMdHeartEmpty size={20} />}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
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
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-xs 3xl:text-sm text-ellipsis  text-gray-500">
              {property.address.city}, {property.address.state}
            </p>
          </div>
          {/* <p className="bg-[#3A99D31A] text-nowrap text-[#0479B7] px-2 2xl:px-2.5 py-2 border border-[#0077B61A] text-[11px] 3xl:text-xs rounded-full">
            Quick Look
          </p> */}
        </div>
        <div className="flex items-center p-1 bg-[#F7F7F7] rounded-full gap-1 text-gray-700 text-[12px] 2xl:text-[10px] 3xl:text-sm mt-2">
          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
            <Image
              src="/images/bed.svg"
              alt="Bed"
              width={20}
              height={20}
              className="w-7 h-7 2xl:w-6 2xl:h-6 3xl:w-8 3xl:h-8"
            />
            {property.beds} Beds
          </p>
          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
            <Image
              src="/images/bath.svg"
              alt="Bath"
              width={20}
              height={20}
              className="w-7 h-7 2xl:w-6 2xl:h-6 3xl:w-8 3xl:h-8"
            />
            {property.bathrooms} Baths
          </p>
          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full flex items-center gap-1.5 pl-0.5 py-0.5 pr-3">
            <Image
              src="/images/area.svg"
              alt="Area"
              width={20}
              height={20}
              className="w-7 h-7 2xl:w-6 2xl:h-6 3xl:w-8 3xl:h-8"
            />
            {property.squareFeet || "N/A"} SqFt
          </p>
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-[#28303F1A] pt-3">
          <Link href={`/property/${property._id}`} className="">
            <button className="px-1 py-2 flex items-center res_text gap-1.5 rounded-lg">
              <Image
                src="/images/calendar.svg"
                alt="Phone"
                width={20}
                height={20}
                className="-mt-0.5"
              />
              Tour
            </button>
          </Link>
          <button className="bg-[#3A99D3] flex-grow res_text text-white px-4 xl:px-6 py-[14px] rounded-full font-semibold">
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
}
