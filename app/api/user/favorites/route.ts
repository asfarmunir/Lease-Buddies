import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/database";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/lib/database/models/user.model";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await req.json();
    
    // Check if property is already favorited
    const user = await User.findById(session.user.id);
    const isFavorited = user.favorites.includes(propertyId);

    let updatedUser;
    if (isFavorited) {
      // Remove from favorites
      updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { $pull: { favorites: propertyId } },
        { new: true }
      );
    } else {
      // Add to favorites
      updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { $addToSet: { favorites: propertyId } },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      isFavorited: !isFavorited,
      favorites: updatedUser.favorites
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update favorites" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.user.id).populate('favorites');
    return NextResponse.json({ favorites: user.favorites });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get favorites" },
      { status: 500 }
    );
  }
}