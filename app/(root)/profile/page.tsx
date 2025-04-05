"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidWalletAlt } from "react-icons/bi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import BoostListing from "@/components/shared/modals/BoostListing";
import { useSession } from "next-auth/react";

interface Property {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  size: string;
  rating: number;
  price: string;
  tags: string[];
  verified: boolean;
  featuredImage: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  profileImage: string;
  leaseBio: string;
  instagramHandle?: string;
  twitterHandle?: string;
  personalWebsite?: string;
  createdAt: string;
  email: string;
}

const Profile = () => {
  const session = useSession();
  console.log("🚀 ~ Profile ~ session:", session);

  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState({
    user: true,
    properties: true,
  });
  const [error, setError] = useState({
    user: null,
    properties: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${session.data?.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError((prev) => ({ ...prev, user: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, user: false }));
      }
    };

    const fetchPropertiesData = async () => {
      try {
        const response = await fetch(
          `/api/user/${session.data?.user.id}/properties`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch properties data");
        }
        const data = await response.json();
        setProperties(data);
      } catch (err: any) {
        setError((prev) => ({ ...prev, properties: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, properties: false }));
      }
    };

    if (session.status === "authenticated") {
      fetchUserData();
      fetchPropertiesData();
    }
  }, [session.status]);

  if (loading.user || loading.properties) {
    return (
      <div className="w-full bg-[#EFEFEF] p-5">
        <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
          <div className="flex justify-center items-center h-80 flex-col animate-pulse">
            <Image src="/logo.png" alt="profile" width={70} height={70} />
            <p className="res_text mt-3 font-semibold">Getting Things Ready</p>
          </div>
        </div>
      </div>
    );
  }

  if (error.user || error.properties) {
    return (
      <div className="w-full bg-[#EFEFEF] p-5">
        <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error.user || error.properties}</p>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = user ? new Date(user.createdAt).getFullYear() : 2024;
  const fullName = user
    ? `${user.firstname} ${user.lastname}`
    : "George Chichua";
  const bio =
    user?.leaseBio ||
    "Im a wanderer at heart, always seeking new horizons and embracing the world's wonders";

  return (
    <div className="w-full bg-[#EFEFEF] p-5">
      <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
        <div className="w-full">
          <Image
            src="/images/profile-cover.png"
            alt="profile"
            width={1200}
            height={1200}
            className="object-cover w-full min-h-20"
          />
        </div>
        <div className="w-full flex flex-col gap-5 md:flex-row items-center md:items-start mt-5 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="-mt-12 md:-mt-20">
              <Image
                src={user?.profileImage || "/user.svg"}
                alt="profile"
                width={140}
                height={140}
                className="object-cover rounded-full border-2 border-white"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-[20px] flex flex-col md:flex-row gap-2 items-center font-semibold">
                <p>{fullName}</p>
                <p className="bg-[#F7F7F7] border text-[9px] 2xl:text-[11px] mb-1 ml-3 text-primary-200 font-thin border-[#28303F1A] px-3 py-1.5 rounded-full">
                  LeaseBuddi member since {memberSince}
                </p>
              </h1>
              <p className="text-[14px] text-center md:text-start text-primary-200 max-w-sm 2xl:max-w-md">
                {bio}
              </p>
              <div className="flex mt-2 justify-center md:justify-start items-center gap-2.5">
                <button>
                  <Image
                    src="/images/fb.svg"
                    alt="location"
                    width={35}
                    height={35}
                  />
                </button>
                <button>
                  <Image
                    src="/images/insta.svg"
                    alt="location"
                    width={35}
                    height={35}
                  />
                </button>
                <button>
                  <Image
                    src="/images/yt.svg"
                    alt="location"
                    width={35}
                    height={35}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-3 2xl:gap-4">
            <Link href={"#"} className="w-full md:w-fit">
              <div className="bg-[#F7F7F7] border res_text text-primary-200 font-medium border-[#28303F1A] px-3 2xl:px-4 py-1.5 2xl:py-1.5 flex items-center gap-2 rounded-full">
                <BiSolidWalletAlt className="text-xl" />
                <div>
                  <p className="res_text font-medium">My Wallet</p>
                  <p className="res_text text-primary-200 font-normal">
                    0.00 USD
                  </p>
                </div>
                <p className="bg-[#28303F] px-4 ml-auto xl:ml-6 py-1.5 rounded-full text-white font-thin">
                  Earn Cash
                </p>
              </div>
            </Link>
            <Link href={"#"}>
              <p className="bg-[#F7F7F7] border res_text text-primary-200 font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full">
                <FaRegHeart className="text-lg" />
                Favorites
              </p>
            </Link>
            <Link href={"#"}>
              <p className="bg-[#F7F7F7] border res_text text-primary-200 font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full">
                <AiOutlineMessage className="text-xl" />
                Inbox
              </p>
            </Link>
            <Link href={"#"}>
              <p className="bg-[#F7F7F7] border res_text text-primary-200 font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full">
                <BsThreeDots className="text-xl" />
                Edit Profile
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full p-4 xl:p-6 2xl:px-8 mt-12 border border-[#28303F1A] rounded-2xl">
          <div className="w-full flex items-center justify-between gap-3 flex-col md:flex-row">
            <div>
              <h2 className="text-lg 2xl:text-2xl font-semibold">
                Your listings
              </h2>
              <p className="text-primary-200 font-normal text-sm 2xl:text-base mt-2">
                You can see your boost listing from here.
              </p>
            </div>
            <BoostListing />
          </div>
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 2xl:grid-cols-3 gap-2 xl:gap-4 2xl:gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-[16px] overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={property.featuredImage || "/images/prop.png"}
                      alt={property.title}
                      width={400}
                      height={250}
                      className="w-full h-48 2xl:h-[330px] object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-2">
                      {property.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#FFFFFFF2] text-primary-50 text-xs px-2 2xl:px-3 py-2 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/50 p-2 rounded-full">
                      <IoMdHeartEmpty size={20} />
                    </button>
                  </div>
                  <div className="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                    <div className="flex items-center pt-2 justify-between">
                      <div>
                        <h3 className="text-lg mb-1 font-semibold">
                          {property.title}
                        </h3>
                        <p className="text-xs 3xl:text-sm text-gray-500">
                          {property.location}
                        </p>
                      </div>
                      <p className="flex items-center text-[#28303FCC] px-2 2xl:px-2.5 font-medium gap-2 res_text rounded-full">
                        <FiShare2 className="text-lg" />
                        Share
                      </p>
                    </div>
                    <p className="res_text font-medium inline-flex text-[#28303FCC] items-center gap-2 mt-4">
                      <MdOutlineRemoveRedEye className="text-lg" />
                      2,345 Views
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button className="bg-[#3A99D3] flex-1 flex-grow res_text text-white px-4 xl:px-6 py-[14px] rounded-full font-semibold">
                        Boost
                      </button>
                      <button className="text-[#3A99D3] flex-1 flex-grow res_text bg-primary/15 px-4 xl:px-6 py-[14px] rounded-full">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-primary-200">No properties listed yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
