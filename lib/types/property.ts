interface AmenityItem {
  name: string;
  included: boolean;
}

interface Amenities {
  interior: AmenityItem[];
  outdoor: AmenityItem[];
  utilities: AmenityItem[];
  otherFeatures: AmenityItem[];
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "Apartment" | "Condo" | "House" | "Townhouse" | "Other";
  audience: "Affordable" | "Luxury" | "Any";
  location: string;
  address: {
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    lat: number;
    lng: number;
    formattedAddress: string;
    placeId?: string;
  };
  locationGeo: {
    type: "Point";
    coordinates: [number, number];
  };
  bedrooms: number;
  beds: number;
  bathrooms: number;
  balcony: number;
  squareFeet?: string;
  amenities: Amenities;
  petsAllowed: string[];
  photos: string[];
  featuredImage?: string;
  price: number;
  currency: "USD" | "CAD";
  contactDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  owner: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  boostSubscription?: string; // Reference to Subscription _id
  boostExpiration?: Date; // Expiration date of the boost
  createdAt: Date;
  updatedAt: Date;
  availabilityDate?: Date;
  leaseTerms?: string;
  neighborhoodInfo?: string;
  nearbyAttractions?: string[];
  formattedAddress?: string; // Virtual field
  displayPrice?: string; // Virtual field
}

export interface FilterOptions {
  search?: string;
  type?: string[];
  audience?: string;
  bedrooms?: string;
  bathrooms?: string;
  minPrice?: number;
  maxPrice?: number;
  petsAllowed?: string[];
  amenities?: string[];
  squareFeet?: string;
}

export interface FiltersState extends FilterOptions {
  popular: string[];
  laundry: "In Building" | "In Unit" | null;
  special: boolean;
}