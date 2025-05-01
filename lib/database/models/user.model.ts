import { Schema, model, models } from "mongoose";

export interface User {
  _id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  zip?: string;
  profileImage?: string;
  authProviders?: string[];
  resetToken?: string;
  resetTokenExpiry?: Date;
  instagramHandle?: string;
  twitterHandle?: string;
  personalWebsite?: string;
  leaseBio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  suitNumber?: string;
  isVerified?: boolean;
    favorites?: Schema.Types.ObjectId[]; // Array of property IDs


}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    password: { type: String, required: false },
    zip: { type: String, required: false },
    profileImage: { type: String, required: false },
    authProviders: { type: [String], required: false },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false },
    instagramHandle: { type: String, required: false },
    twitterHandle: { type: String, required: false },
    personalWebsite: { type: String, required: false },
    leaseBio: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, required: false },
    suitNumber: { type: String, required: false },
    isVerified: { type: Boolean, required: false },
     favorites: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Property" 
    }],

  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
