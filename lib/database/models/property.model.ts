import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ["Apartment", "Condo", "House", "Townhouse", "Other"] 
    },
    audience: { 
      type: String, 
      enum: ["Affordable", "Luxury", "Any"], 
      default: "Any" 
    },
    
    location: { type: String, required: true },
    address: {
      address1: { type: String, required: true },
      address2: { type: String },
      address3: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true, default: "US" },
    },
    
    bedrooms: { type: Number, required: true, min: 1 },
    beds: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 1 },
    balcony: { type: Number, required: true, min: 0 },
    squareFeet: { type: String },
    
    amenities: [{ 
      type: String,
      enum: [
        "Air Conditioning",
        "Carpet",
        "Business Center",
        "Balcony",
        "Assigned Parking",
      ] 
    }],
    
    petsAllowed: [{ 
      type: String,
      enum: ["Dogs Allowed", "Cats Allowed", "No Pets"] 
    }],
    
    photos: [{ 
      type: String, // URLs to images
      required: true 
    }],
    featuredImage: { type: String }, // Main/featured image URL
    price: { type: Number, required: true, min: 0 },
    currency: { 
      type: String, 
      enum: ["USD", "CAD"], 
      default: "USD" 
    },
    contactDetails: {
      name: { type: String, required: true },
      email: { 
        type: String, 
        required: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"] 
      },
      phoneNumber: { type: String, required: true },
    },
    owner: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
    availabilityDate: { type: Date },
    leaseTerms: { type: String },
    neighborhoodInfo: { type: String },
    nearbyAttractions: [{ type: String }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Add text index for search functionality
PropertySchema.index({
  title: "text",
  description: "text",
  "address.city": "text",
  "address.state": "text",
  type: "text"
});

// Virtual for formatted address
PropertySchema.virtual("formattedAddress").get(function() {
    //@ts-ignore
  return `${this.address.address1}, ${this.address.city}, ${this.address.state} ${this.address.zip}`;
});

// Virtual for price display
PropertySchema.virtual("displayPrice").get(function() {
  return `${this.currency === "USD" ? "$" : "C"}${this.price.toLocaleString()}`;
});

const Property = models.Property || model("Property", PropertySchema);

export default Property;