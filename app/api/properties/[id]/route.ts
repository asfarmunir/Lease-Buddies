import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
)  {
  console.log("🚀 ~ id:", params.id)
  try {
    await connectToDatabase();

    const property = await Property.findById(params.id)
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