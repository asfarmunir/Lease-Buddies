import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase(); 
    
    const { userId, imageUrl } = await req.json();

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with new image URL
    user.profileImage = imageUrl;
    await user.save();

    return NextResponse.json({ success: true, profileImage: imageUrl });
  } catch (error: any) {
    console.error("Error updating profile image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile image" },
      { status: 500 }
    );
  }
}