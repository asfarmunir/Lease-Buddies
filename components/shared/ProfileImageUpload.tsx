"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { FiEdit2 } from "react-icons/fi";
import { User } from "@/lib/database/models/user.model";

interface ProfileImageUploadProps {
  user: User | null;
  onImageUpload: (url: string) => Promise<void>;
}

export const ProfileImageUpload = ({
  user,
  onImageUpload,
}: ProfileImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/image.(jpeg|jpg|png)/)) {
      alert("Please select a valid image file (JPEG, JPG, PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(file);

      await onImageUpload(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="-mt-12 md:-mt-20 relative group">
      <div className="relative w-[140px] h-[140px] rounded-full p-0.5  border-2 border-white ">
        <Image
          src={user?.profileImage || "/user.svg"}
          alt="profile"
          width={140}
          height={140}
          className="object-cover w-full h-full rounded-full border-2 border-white"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute  bottom-2 right-2 bg-primary-50 text-white p-2 rounded-full hover:bg-primary-100 transition-all duration-300 flex items-center justify-center"
          aria-label="Change profile picture"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiEdit2 size={16} />
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/jpeg, image/png"
          className="hidden"
        />
      </div>
    </div>
  );
};

// utils/cloudinary.ts
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "leasebuddi");
  data.append("cloud_name", "unionwealthmanagement");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/unionwealthmanagement/upload",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
