import { connectToDatabase } from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/lib/database/models/user.model";
import Property from "@/lib/database/models/property.model";

export async function POST(req: Request) {
    await connectToDatabase();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    
    const newProperty = new Property({
      ...body,
      owner: user._id,
      photos: body.photos || [], // Ensure photos is an array
    });

    await newProperty.save();
    
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    
    const filters: any = {
      isActive: true
    };

    // Text search
    const searchText = searchParams.get('search');
    if (searchText) {
      filters.$text = { $search: searchText };
    }

    // Property type filter
    const types = searchParams.getAll('type');
    if (types.length > 0) {
      filters.type = { $in: types };
    }

    // Audience filter
    const audience = searchParams.get('audience');
    if (audience && audience !== 'Any') {
      filters.audience = audience;
    }

    // Bedrooms filter
    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) {
      if (bedrooms === 'Studio') {
        filters.bedrooms = 0;
      } else if (bedrooms === '4+') {
        filters.bedrooms = { $gte: 4 };
      } else {
        filters.bedrooms = parseInt(bedrooms);
      }
    }

    // Beds filter
    const beds = searchParams.get('beds');
    if (beds) {
      if (beds === '4+') {
        filters.beds = { $gte: 4 };
      } else {
        filters.beds = parseInt(beds);
      }
    }

    // Bathrooms filter
    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) {
      if (bathrooms === '4+') {
        filters.bathrooms = { $gte: 4 };
      } else {
        filters.bathrooms = parseInt(bathrooms);
      }
    }

    // Balcony filter
    const balcony = searchParams.get('balcony');
    if (balcony) {
      if (balcony === '4+') {
        filters.balcony = { $gte: 4 };
      } else {
        filters.balcony = parseInt(balcony);
      }
    }

    // Price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }

    // Pets filter
    const petsAllowed = searchParams.getAll('petsAllowed');
    if (petsAllowed.length > 0) {
      filters.petsAllowed = { $in: petsAllowed };
    }

    // Amenities filter - updated for new schema
    const amenities = searchParams.getAll('amenities');
    if (amenities.length > 0) {
      filters.$or = [
        { 'amenities.interior.name': { $in: amenities } },
        { 'amenities.outdoor.name': { $in: amenities } },
        { 'amenities.utilities.name': { $in: amenities } },
        { 'amenities.otherFeatures.name': { $in: amenities } }
      ];
    }

    // Square feet filter
    const squareFeet = searchParams.get('squareFeet');
    if (squareFeet) {
      filters.squareFeet = { $gte: squareFeet };
    }

    // Fetch properties with filters
    const properties = await Property.find(filters)
      .populate('owner', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch properties", details: error.message },
      { status: 500 }
    );
  }
}