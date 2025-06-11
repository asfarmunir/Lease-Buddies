import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {

  const { id } = await context.params;
  try {
    await connectToDatabase();

    const property = await Property.findById(id)
      .populate('owner', 'firstname lastname email phone')
      .lean();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch property", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // // Get the session to verify the user
    // const session = await getSession();
    
    // if (!session) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const { id } = await context.params;

    // Find the property and verify ownership
    const property = await Property.findOne({
      _id: id,
      // owner: session.user.id
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the property
    await Property.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete property", details: error.message },
      { status: 500 }
    );
  }
}