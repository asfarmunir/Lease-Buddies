import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";
import { NextResponse } from "next/server";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    await connectToDatabase();

    const properties = await Property.find({ owner: params.id, isActive: true })
      .sort({ createdAt: -1 })
      .populate('owner', 'firstname lastname profileImage');

    if (!properties || properties.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Format the properties data to match your frontend expectations
    const formattedProperties = properties.map(property => ({
      id: property._id.toString(),
      title: property.title,
      location: property.formattedAddress,
      beds: property.beds,
      baths: property.bathrooms,
      size: `${property.squareFeet} SqFt`,
      rating: 4.9, // You might want to calculate this from reviews
      price: `$${property.price}`,
      tags: property.isFeatured ? ["Featured"] : [],
      verified: true,
      featuredImage: property.featuredImage || property.photos[0]
    }));

    return NextResponse.json(formattedProperties);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch user properties" },
      { status: 500 }
    );
  }
};