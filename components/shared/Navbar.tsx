"use client";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDownWideFill } from "react-icons/ri";
import { GoChevronDown } from "react-icons/go";
import { GrMenu } from "react-icons/gr";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const filters = [
  {
    title: "Apartments for rent",
    type: "Apartment",
    priceRanges: [
      { label: "$0 - $500", min: 0, max: 500 },
      { label: "$500 - $1000", min: 500, max: 1000 },
      { label: "$1000 - $1500", min: 1000, max: 1500 },
      { label: "$1500 - $2000", min: 1500, max: 2000 },
    ],
  },
  {
    title: "Houses for rent",
    type: "House",
    bedrooms: ["1", "2", "3", "4+"],
  },
  {
    title: "Rooms for rent",
    type: "Room",
    bedrooms: ["1", "2", "3", "4+"],
  },
  {
    title: "Amenities",
    amenities: ["Pool", "Gym", "Parking", "Pet Friendly"],
  },
];

const Navbar = () => {
  const session = useSession();
  const router = useRouter();

  const signOutUser = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/login",
    });
    toast.success("Signed out successfully!");
    router.refresh();
    router.replace("/login");
  };

  const applyFilter = (filterParams: Record<string, string | string[]>) => {
    const params = new URLSearchParams();

    // Clear previous filters
    params.delete("type");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("bedrooms");
    params.delete("amenities");

    // Apply new filters
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    }

    router.push(`/home?${params.toString()}`);
  };

  return (
    <nav className="w-[95%] mx-auto my-3 flex items-center justify-between bg-[#FAFAFA] rounded-full px-4 py-4">
      <Link href={session.status === "authenticated" ? "/home" : "/"}>
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          alt="Lease Buddies Logo"
          className="w-[100px] 2xl:w-[125px] 3xl:w-[150px] cursor-pointer"
        />
      </Link>

      {session.status === "authenticated" ? (
        <div className="hidden md:flex items-center gap-3 xl:gap-4 2xl:gap-5">
          {filters.map((filter, index) => (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger className="flex items-center gap-2 2xl:gap-3 focus:outline-none res_text">
                {filter.title}
                <GoChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[200px]">
                <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Price Range Filters (for Apartments) */}
                {filter.priceRanges?.map((range, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() =>
                      applyFilter({
                        type: filter.type,
                        minPrice: range.min.toString(),
                        maxPrice: range.max.toString(),
                      })
                    }
                    className="cursor-pointer"
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}

                {/* Bedroom Filters (for Houses/Rooms) */}
                {filter.bedrooms?.map((bedroom, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() =>
                      applyFilter({
                        bedrooms: bedroom,
                      })
                    }
                    className="cursor-pointer"
                  >
                    {bedroom} {bedroom === "1" ? "Bedroom" : "Bedrooms"}
                  </DropdownMenuItem>
                ))}

                {/* Amenities Filters */}
                {filter.amenities?.map((amenity, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() =>
                      applyFilter({
                        amenities:
                          amenity === "Pet Friendly"
                            ? ["Dogs Allowed", "Cats Allowed"]
                            : [amenity],
                      })
                    }
                    className="cursor-pointer"
                  >
                    {amenity}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Link href={"/profile"}>
            <button className="res_text text-primary font-semibold">
              Advertise
            </button>
          </Link>

          <Link href={"/property/list"}>
            <button className="res_text bg-primary rounded-full p-4 py-2.5 text-white">
              Post a Listing
            </button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden bg-white p-2.5 rounded-full md:flex items-center gap-2 focus:outline-none res_text">
              <Image src="/user.svg" width={20} height={20} alt="User" />
              <GrMenu className="text-lg" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-1 mr-6">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="res_text font-[500] pb-2 border-slate-200 pt-2 rounded-none border-b"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="res_text font-[500] pb-2 border-slate-200 pt-2 rounded-none border-b"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/faq")}
                className="res_text font-[500] pb-2 border-slate-200 pt-2 rounded-none border-b"
              >
                FAQs
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={signOutUser}
                className="res_text font-[500] pb-2 pt-2 rounded-none"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-3 xl:gap-4 2xl:gap-5">
          <Link href={"/login"}>
            <button className="res_text text-primary font-semibold">
              Login
            </button>
          </Link>
          <Link href={"/login"}>
            <button className="res_text bg-primary font-semibold rounded-full p-4 py-2.5 text-white">
              Sign Up
            </button>
          </Link>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="md:hidden">
          <GrMenu className="text-lg" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="mb-6">
              <Image
                src="/logo.svg"
                width={120}
                height={120}
                alt="Lease Buddies Logo"
              />
            </SheetTitle>
            <div className="flex flex-col items-start gap-3 xl:gap-4 2xl:gap-5">
              {filters.map((filter, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger className="flex items-center gap-2 2xl:gap-3 focus:outline-none text-sm">
                    {filter.title}
                    <GoChevronDown />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-4">
                    <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {filter.priceRanges?.map((range, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() =>
                          applyFilter({
                            type: filter.type,
                            minPrice: range.min.toString(),
                            maxPrice: range.max.toString(),
                          })
                        }
                        className="cursor-pointer"
                      >
                        {range.label}
                      </DropdownMenuItem>
                    ))}

                    {filter.bedrooms?.map((bedroom, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() =>
                          applyFilter({
                            type: filter.type,
                            bedrooms: bedroom,
                          })
                        }
                        className="cursor-pointer"
                      >
                        {bedroom} {bedroom === "1" ? "Bedroom" : "Bedrooms"}
                      </DropdownMenuItem>
                    ))}

                    {filter.amenities?.map((amenity, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={() =>
                          applyFilter({
                            amenities:
                              amenity === "Pet Friendly"
                                ? ["Dogs Allowed", "Cats Allowed"]
                                : [amenity],
                          })
                        }
                        className="cursor-pointer"
                      >
                        {amenity}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}

              {session.status === "authenticated" ? (
                <>
                  <button
                    onClick={() => router.push("/profile")}
                    className="text-sm font-[500]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="text-sm font-[500]"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => router.push("/faq")}
                    className="text-sm font-[500]"
                  >
                    FAQs
                  </button>
                  <button onClick={signOutUser} className="text-sm font-[500]">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-[500]">
                    Login
                  </Link>
                  <Link href="/login" className="text-sm font-[500]">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
