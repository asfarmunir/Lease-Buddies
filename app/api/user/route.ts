import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        firstname: body.firstName,
        lastname: body.lastName,
        address: body.streetAddress,
        suitNumber: body.apartment,
        city: body.city,
        state: body.state,
        country: "US", // or get from form if needed
        zip: body.zipCode,
        phone: body.phoneNumber,
        instagramHandle: body.instagram,
        twitterHandle: body.twitter,
        personalWebsite: body.website,
        leaseBio: body.bio,
      },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}