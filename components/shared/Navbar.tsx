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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const filters = [
  {
    title: "Apartments for rent",
    options: ["$0 - $500", "$500 - $1000", "$1000 - $1500", "$1500 - $2000"],
  },
  {
    title: "Houses for rent",
    options: ["1", "2", "3", "4"],
  },
  {
    title: "Rooms for rent",
    options: ["1", "2", "3", "4"],
  },
  {
    title: "Amenities",
    options: ["Pool", "Gym", "Parking", "Pet Friendly"],
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

  return (
    <nav className=" w-[95%] mx-auto my-3 flex items-center justify-between bg-[#FAFAFA]  rounded-full px-4 py-4 ">
      <Link href={"/"}>
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          alt="Lease Budd
        ies Logo"
          className="
        w-[100px]  2xl:w-[120px] 
        "
        />
      </Link>
      {session.status === "authenticated" ? (
        <div className=" hidden md:flex items-center gap-3 xl:gap-4 2xl:gap-5">
          {filters.map((filter, index) => (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger className=" flex items-center gap-2 2xl:gap-3 focus:outline-none res_text">
                {filter.title}
                <GoChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Filters </DropdownMenuItem>
                <DropdownMenuItem>Filters </DropdownMenuItem>
                <DropdownMenuItem>Filters </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <button className=" res_text text-primary font-semibold">
            Advertise
          </button>
          <Link href={"/property/list"}>
            <button className=" res_text bg-primary rounded-full p-4 py-2.5 text-white  ">
              Post a Listing
            </button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className=" hidden  bg-white p-2.5 rounded-full md:flex items-center gap-2  focus:outline-none res_text">
              <Image src="/user.svg" width={20} height={20} alt="User" />
              <GrMenu className="text-lg" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-1 mr-6">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="res_text font-[500] pb-2 border-slate-200 pt-2 rounded-none  border-b"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="res_text font-[500] pb-2 border-slate-200 pt-2 rounded-none  border-b"
              >
                settings{" "}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={signOutUser}
                className="res_text font-[500] pb-2 pt-2 rounded-none  "
              >
                logout{" "}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className=" hidden md:flex items-center gap-3 xl:gap-4 2xl:gap-5">
          <Link href={"/login"}>
            <button className=" res_text text-primary font-semibold">
              Login
            </button>
          </Link>
          <Link href={"/login"}>
            <button className=" res_text bg-primary font-semibold rounded-full p-4 py-2.5 text-white  ">
              Sign Up
            </button>
          </Link>
        </div>
      )}

      <Sheet>
        <SheetTrigger className=" md:hidden">
          <GrMenu className="text-lg" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className=" mb-6">
              <Image
                src="/logo.svg"
                width={120}
                height={120}
                alt="Lease Buddies Logo"
              />
            </SheetTitle>
            <div className=" flex flex-col items-start  gap-3 xl:gap-4 2xl:gap-5">
              {filters.map((filter, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger className=" flex items-center gap-2 2xl:gap-3 focus:outline-none text-sm">
                    {filter.title}
                    <GoChevronDown />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Filters </DropdownMenuItem>
                    <DropdownMenuItem>Filters </DropdownMenuItem>
                    <DropdownMenuItem>Filters </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
              {/* <button className=" res_text text-primary font-semibold">
                Advertise
              </button>
              <button className=" res_text bg-primary rounded-full p-4 py-2.5 text-white  ">
                Post a Listing
              </button> */}
              <DropdownMenu>
                <DropdownMenuTrigger className=" hidden  bg-white p-2.5 rounded-full md:flex items-center gap-2  focus:outline-none res_text">
                  <Image src="/user.svg" width={20} height={20} alt="User" />
                  <GrMenu className="text-lg" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>settings </DropdownMenuItem>
                  <DropdownMenuItem>settings </DropdownMenuItem>
                  <DropdownMenuItem>settings </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
