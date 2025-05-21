import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: Promise<{ id: string }> }) => {

  try {
    const { id } = await context.params;

    await connectToDatabase();

    const user = await User.findById(id).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch user details" },
      { status: 500 }
    );
  }
};