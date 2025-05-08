"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FaFacebook,
  FaUser,
  FaLock,
  FaCreditCard,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";

const tabs = [
  {
    title: "Edit Profile",
    icon: <FaUser />,
    image: "/images/profile.svg",
  },
  {
    title: "Change Password",
    icon: <FaLock />,
    image: "/images/password.svg",
  },
  // {
  //   title: "Payment Details",
  //   icon: <FaCreditCard />,
  //   image: "/images/payment.svg",
  // },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  facebookConnected: boolean;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  username: string;
  website: string;
  bio: string;
  instagram: string;
  twitter: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const UserSettings: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("Edit Profile");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    facebookConnected: false,
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    username: "",
    website: "",
    bio: "",
    instagram: "",
    twitter: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/user");
          if (response.ok) {
            const userData = await response.json();
            setFormData({
              firstName: userData.firstname || "",
              lastName: userData.lastname || "",
              email: userData.email || "",
              facebookConnected:
                userData.authProviders?.includes("facebook") || false,
              streetAddress: userData.address || "",
              apartment: userData.suitNumber || "",
              city: userData.city || "",
              state: userData.state || "",
              zipCode: userData.zip || "",
              phoneNumber: userData.phone || "",
              username: "", // Add username field to your schema if needed
              website: userData.personalWebsite || "",
              bio: userData.leaseBio || "",
              instagram: userData.instagramHandle || "",
              twitter: userData.twitterHandle || "",
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }
        } catch (error) {
          toast.error("Failed to fetch user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacebookConnect = () => {
    setFormData((prev) => ({
      ...prev,
      facebookConnected: !prev.facebookConnected,
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    window.scrollTo(0, 0); // Scroll to top on form submission
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0); // Scroll to top on form submission
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password updated successfully");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100 p-4 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      {/* Sidebar Navigation */}
      <div className="bg-white p-4 w-full gap-4 xl:gap-6 flex rounded-3xl">
        <aside className="w-1/4 bg-[#F7F7F7] rounded-3xl h-fit p-4 2xl:p-6 hidden md:block">
          <Link href={`/home`}>
            <h2 className="text-lg 3xl:text-xl inline-flex items-center gap-2 font-semibold mb-6">
              <Image
                src="/images/back.svg"
                width={30}
                height={30}
                alt="Profile"
              />
              Settings
            </h2>
          </Link>
          <ul className="space-y-3 text-gray-700">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`flex items-center text-xs 2xl:text-base gap-4 p-3 2xl:px-4 rounded-full text-[#28303F] font-semibold cursor-pointer ${
                  activeTab === tab.title
                    ? "bg-white border border-[#28303F1A]"
                    : ""
                }`}
                onClick={() => setActiveTab(tab.title)}
              >
                <img src={tab.image} alt={tab.title} className="w-8 h-8" />
                <span>{tab.title}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 space-y-4 xl:space-y-6">
          {activeTab === "Edit Profile" && (
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-4 xl:space-y-6"
            >
              <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Personal Information
                </h2>

                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#D9D9D9] rounded-full">
                    <Image
                      src={session?.user?.image || "/user.svg"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-primary-50 inline-flex items-center gap-2 font-semibold"
                    >
                      <Image
                        src="/images/camera.svg"
                        width={30}
                        height={30}
                        alt="Camera"
                      />
                      Change Picture
                    </button>
                    <p className="res_text text-gray-500">
                      Upload a clear photo to help hosts recognize you. Max
                      size: 10 MB
                    </p>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="firstName"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="lastName"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="email"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      onChange={handleChange}
                      placeholder="Email"
                      className="bg-[#F7F7F7] disabled:opacity-50 rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  {/* <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor=""
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Connect with Facebook
                    </label>
                    <button
                      type="button"
                      onClick={handleFacebookConnect}
                      className={`${
                        formData.facebookConnected
                          ? "bg-gray-600"
                          : "bg-blue-600"
                      } text-white font-thin py-3.5 rounded-full flex items-center justify-center gap-2`}
                    >
                      <FaFacebook className="text-lg" />
                      {formData.facebookConnected
                        ? "Disconnect Facebook"
                        : "Connect Facebook"}
                    </button>
                  </div> */}
                </div>
              </div>

              <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
                <h2 className="text-2xl font-semibold mt-2">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-2 w-full md:col-span-2">
                    <label
                      htmlFor="streetAddress"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="apartment"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Apartment/Suite
                    </label>
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Apartment/Suite"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="city"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="state"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State/Province"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="zipCode"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:col-span-2">
                    <label
                      htmlFor="phoneNumber"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
                <h2 className="text-2xl font-semibold mt-2">Public Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="username"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="website"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Personal Website
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Personal Website"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:col-span-2">
                  <label
                    htmlFor="bio"
                    className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base mt-4"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Write a short description about yourself!"
                    className="bg-[#F7F7F7] rounded-3xl h-32 w-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                  ></textarea>
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="instagram"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Instagram
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="Instagram"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="twitter"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Twitter
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="Twitter"
                      className="bg-[#F7F7F7] rounded-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white py-3.5 res_text font-semibold px-6 rounded-full mt-6   "
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === "Change Password" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="currentPassword"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current Password"
                        className="bg-[#F7F7F7] rounded-full w-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="newPassword"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        className="bg-[#F7F7F7] rounded-full w-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="confirmPassword"
                      className="pl-2 font-[500] text-primary-50 text-xs 2xl:text-sm 3xl:text-base"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        className="bg-[#F7F7F7] rounded-full w-full px-5 py-3 2xl:py-4 res_text border border-[#28303F1A] focus:outline-none"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={
                        !formData.currentPassword ||
                        !formData.newPassword ||
                        !formData.confirmPassword
                      }
                      className="bg-primary disabled:opacity-40 text-white py-3.5 res_text font-semibold px-6 rounded-full mt-6   "
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === "Notifications" && (
            <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
              <p className="text-gray-500">
                Notification settings will be implemented here
              </p>
            </div>
          )}

          {activeTab === "Payment Details" && (
            <div className="flex-1 bg-white border border-primary-100 rounded-3xl p-4 2xl:p-6">
              <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
              <p className="text-gray-500">
                Payment details settings will be implemented here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
