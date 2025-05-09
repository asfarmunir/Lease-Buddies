"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaStar, FaHeart } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { BiSolidWalletAlt } from "react-icons/bi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { IoIosArrowBack, IoMdHeartEmpty } from "react-icons/io";
import BoostListing from "@/components/shared/modals/BoostListing";
import { useSession } from "next-auth/react";
import { ProfileImageUpload } from "@/components/shared/ProfileImageUpload";
import toast from "react-hot-toast";
import { Property } from "@/lib/types/property";
import { User } from "@/lib/database/models/user.model";
import { useSearchParams } from "next/navigation";
import BoostStatus from "@/components/shared/modals/BoostStatus";

const Profile = () => {
  const session = useSession();
  const [activeTab, setActiveTab] = useState<"listings" | "favorites">(
    "listings"
  );
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("boost") as "success" | "canceled" | null;
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState({
    user: true,
    properties: true,
    favorites: true,
  });
  const [error, setError] = useState({
    user: null,
    properties: null,
    favorites: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //@ts-ignore
        const response = await fetch(`/api/user/${session.data?.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
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
          //@ts-ignore
          `/api/user/${session.data?.user.id}/properties`
        );
        if (!response.ok) throw new Error("Failed to fetch properties data");
        const data = await response.json();
        setProperties(data);
      } catch (err: any) {
        setError((prev) => ({ ...prev, properties: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, properties: false }));
      }
    };

    const fetchFavoritesData = async () => {
      try {
        const response = await fetch("/api/user/favorites");
        if (!response.ok) throw new Error("Failed to fetch favorites data");
        const data = await response.json();
        setFavorites(data.favorites);
      } catch (err: any) {
        setError((prev) => ({ ...prev, favorites: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, favorites: false }));
      }
    };

    if (session.status === "authenticated") {
      fetchUserData();
      fetchPropertiesData();
      fetchFavoritesData();
    }
  }, [session.status]);

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/user/update-profile-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //@ts-ignore
        body: JSON.stringify({ userId: session.data?.user.id, imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to update profile image");
      const data = await response.json();
      setUser((prev) =>
        prev ? { ...prev, profileImage: data.profileImage } : null
      );
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw error;
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      if (response.ok) {
        const data = await response.json();
        const updatedFavorites = data.isFavorited
          ? [...favorites, properties.find((p) => p._id === propertyId)!]
          : favorites.filter((p) => p._id !== propertyId);
        setFavorites(updatedFavorites);
        toast.success(
          data.isFavorited ? "Added to favorites!" : "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Error updating favorites:", error);
    }
  };

  if (loading.user || loading.properties || loading.favorites) {
    return (
      <div className="w-full bg-[#EFEFEF] p-5">
        <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
          <div className="flex justify-center items-center h-80 flex-col animate-pulse">
            <Image
              src="/logo.png"
              alt="profile"
              priority
              width={70}
              height={70}
            />
            <p className="res_text mt-3 font-semibold">Getting Things Ready</p>
          </div>
        </div>
      </div>
    );
  }

  if (error.user || error.properties || error.favorites) {
    return (
      <div className="w-full bg-[#EFEFEF] p-5">
        <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error.user || error.properties || error.favorites}</p>
          </div>
        </div>
      </div>
    );
  }

  //@ts-ignore
  const memberSince = user ? new Date(user.createdAt).getFullYear() : 2024;
  const fullName = user
    ? `${user.firstname} ${user.lastname}`
    : "George Chichua";
  const bio =
    user?.leaseBio ||
    "I'm a wanderer at heart, always seeking new horizons and embracing the world's wonders";

  const currentProperties = activeTab === "listings" ? properties : favorites;
  const noItemsMessage =
    activeTab === "listings" ? "No properties listed yet" : "No favorites yet";

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
            <ProfileImageUpload user={user} onImageUpload={handleImageUpload} />
            <div className="flex flex-col gap-3">
              <h1 className="text-[20px] flex flex-col md:flex-row gap-2 items-center font-semibold">
                <p className="capitalize">{fullName}</p>
                <p className="bg-[#F7F7F7] border text-[9px] 2xl:text-[11px] mb-1 ml-3 text-primary-200 font-thin border-[#28303F1A] px-3 py-1.5 rounded-full">
                  LeaseBuddi member since {memberSince}
                </p>
              </h1>
              <p className="text-[14px] text-center md:text-start text-primary-200 max-w-sm 2xl:max-w-md">
                {bio}
              </p>
              <div className="flex mt-2 justify-center md:justify-start items-center gap-2.5">
                {user?.instagramHandle && (
                  <Link href={user.instagramHandle}>
                    <Image
                      src="/images/insta.svg"
                      alt="location"
                      width={35}
                      height={35}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-3 2xl:gap-4">
            {/* <Link href={"#"} className="w-full md:w-fit">
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
            </Link> */}
            <button
              onClick={() => setActiveTab("favorites")}
              className={`bg-[#F7F7F7] border res_text font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full ${
                activeTab === "favorites" ? "bg-blue-100 border-blue-300" : ""
              }`}
            >
              <FaRegHeart className="text-lg" />
              Favorites
            </button>
            <Link href="/inbox">
              <p
                className={`bg-[#F7F7F7] border res_text font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full`}
              >
                <AiOutlineMessage className="text-xl" />
                Inbox
              </p>
            </Link>
            <Link href="/settings">
              <p className="bg-[#F7F7F7] border res_text text-primary-200 font-medium border-[#28303F1A] px-3 2xl:px-4 py-2 xl:py-3.5 2xl:py-4 flex items-center gap-2 rounded-full">
                <BsThreeDots className="text-xl" />
                Edit Profile
              </p>
            </Link>
          </div>
        </div>
        {initialTab === "success" && (
          <BoostStatus
            open={initialTab === "success"}
            onOpenChange={() => {
              if (initialTab) setActiveTab("listings");
            }}
          />
        )}
        <div className="w-full p-4 xl:p-6 2xl:px-8 mt-12 border border-[#28303F1A] rounded-2xl">
          <div className="w-full flex items-center justify-between gap-3 flex-col md:flex-row">
            <div className="flex items-start gap-3">
              {activeTab === "favorites" && (
                <button
                  onClick={() => setActiveTab("listings")}
                  className="text-primary-200 hover:text-primary-100 transition-all duration-300 bg-slate-50 text-2xl rounded-full border p-1"
                >
                  <IoIosArrowBack />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg 2xl:text-2xl font-semibold">
                    {activeTab === "listings"
                      ? "Your listings"
                      : "Your favorites"}
                  </h2>
                </div>
                <p className="text-primary-200 font-normal text-sm 2xl:text-base mt-2">
                  {activeTab === "listings"
                    ? "You can see your boost listing from here."
                    : "All properties you have favorited"}
                </p>
              </div>
            </div>
            {activeTab === "listings" && (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#28303F] text-white px-4 xl:px-8 py-2.5 2xl:py-3 text-sm 2xl:text-base rounded-full font-medium"
                >
                  Boost New Listing
                </button>
                <BoostListing
                  properties={properties}
                  open={showModal}
                  onOpenChange={() => setShowModal(false)}
                />
              </>
            )}
          </div>
          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 2xl:grid-cols-3 gap-2 xl:gap-4 2xl:gap-6">
            {activeTab === "listings"
              ? properties.map((property, index) => (
                  <div
                    key={index}
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
                      {property.isFeatured && (
                        <div className="absolute top-2.5 left-2.5 flex gap-2">
                          <span className="bg-[#FFFFFFF2] text-primary-50 font-semibold text-xs px-2 2xl:px-3 py-2 rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                      <div className="flex items-start pt-2 justify-between">
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
                      <div className="mt-4 flex gap-3">
                        {activeTab === "listings" && !property.isFeatured && (
                          <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#3A99D3] flex-1 flex-grow res_text text-white px-4 xl:px-6 py-[14px] rounded-full font-semibold"
                          >
                            Boost
                          </button>
                        )}
                        <Link
                          //@ts-ignore
                          href={`/property/${property.id}`}
                          className="text-[#3A99D3] flex-1 text-center flex-grow res_text bg-primary/15 px-4 xl:px-6 py-[14px] rounded-full"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : activeTab === "favorites"
              ? favorites.map((property, index) => (
                  <div
                    key={index}
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
                      <div className="absolute top-2.5 left-2.5 flex gap-2"></div>
                      {activeTab === "favorites" && (
                        <button
                          onClick={() => toggleFavorite(property._id)}
                          className={`absolute top-2 right-2 p-2 rounded-full ${
                            favorites.some((fav) => fav._id === property._id)
                              ? "text-red-500 bg-white/90 hover:bg-white"
                              : "text-white bg-black/20 hover:bg-black/50"
                          }`}
                        >
                          {favorites.some((fav) => fav._id === property._id) ? (
                            <FaHeart size={20} />
                          ) : (
                            <IoMdHeartEmpty size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="p-4 border border-[#28303F1A] rounded-[16px] -mt-4 bg-white relative">
                      <div className="flex items-start pt-2 justify-between">
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
                      {activeTab === "favorites" && (
                        <div className="flex items-center p-1 bg-[#F7F7F7] rounded-full gap-1 text-gray-700 text-[12px] 3xl:text-sm mt-2">
                          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full justify-center flex items-center gap-1.5 pl-0.5 py-1.5 pr-3">
                            <Image
                              src="/images/bed.svg"
                              alt="Bed"
                              width={20}
                              height={20}
                              className="w-7 h-7 2xl:w-6 2xl:h-6 3xl:w-8 3xl:h-8"
                            />
                            {property.beds} Beds
                          </p>
                          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full justify-center flex items-center gap-1.5 pl-0.5 py-1.5 pr-3">
                            <Image
                              src="/images/bath.svg"
                              alt="Bath"
                              width={20}
                              height={20}
                              className="w-7 h-7 2xl:w-6 2xl:h-6 3xl:w-8 3xl:h-8"
                            />
                            {property.bathrooms} Baths
                          </p>
                          <p className="bg-white flex-1 border border-[#28303F1A] rounded-full justify-center flex items-center gap-1.5 pl-0.5 py-1.5 pr-3">
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
                      )}
                      <div className="mt-3 flex gap-3">
                        <Link
                          href={`/property/${property._id}`}
                          className="text-[#3A99D3] flex-1 text-center flex-grow res_text bg-primary/15 px-4 xl:px-6 py-[14px] rounded-full"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : null}
            {currentProperties.length === 0 && (
              <div className="col-span-1 md:col-span-2 2xl:col-span-3 flex items-center justify-center h-64 text-primary-200 font-semibold">
                {noItemsMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
