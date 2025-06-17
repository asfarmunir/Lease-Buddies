import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";
import User from "@/lib/database/models/user.model";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await connectToDatabase();
    const property = await Property.findById(id).populate("owner", "email firstname lastname _id");
    if (!property || !property.owner) {
      return NextResponse.json({ error: "Property or owner not found" }, { status: 404 });
    }

    return NextResponse.json({
      owner: {
        id: property.owner._id.toString(),
        email: property.owner.email,
        firstname: property.owner.firstname || "",
        lastname: property.owner.lastname || "",
      },
    });
  } catch (error) {
    console.error("Error fetching property owner:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}