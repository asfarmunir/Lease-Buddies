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
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      formattedAddress: { type: String, required: true },
      placeId: { type: String }
    },
    
    locationGeo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      }
    },
    
    bedrooms: { type: Number, required: true, min: 1 },
    beds: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 1 },
    balcony: { type: Number, required: true, min: 0 },
    squareFeet: { type: String },
    
    amenities: {
      interior: [{
        name: { type: String, required: true },
        included: { type: Boolean, default: true }
      }],
      outdoor: [{
        name: { type: String, required: true },
        included: { type: Boolean, default: true }
      }],
      utilities: [{
        name: { type: String, required: true },
        included: { type: Boolean, default: true }
      }],
      otherFeatures: [{
        name: { type: String, required: true },
        included: { type: Boolean, default: true }
      }]
    },
    
    petsAllowed: [{ 
      type: String,
      enum: ["Dogs Allowed", "Cats Allowed", "No Pets"] 
    }],
    
    photos: [{ 
      type: String,
      required: true
    }],
    featuredImage: { type: String },
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
    boostSubscription: { 
      type: Schema.Types.ObjectId, 
      ref: "Subscription" 
    },
    boostExpiration: { type: Date },
    
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

PropertySchema.index({ locationGeo: '2dsphere' });

PropertySchema.index({
  title: "text",
  description: "text",
  "address.city": "text",
  "address.state": "text",
  type: "text"
});

PropertySchema.virtual("formattedAddress").get(function() {
    //@ts-ignore
  return `${this.address.address1}, ${this.address.city}, ${this.address.state} ${this.address.zip}`;
});

PropertySchema.virtual("displayPrice").get(function() {
  return `${this.currency === "USD" ? "$" : "C"}${this.price.toLocaleString()}`;
});

PropertySchema.pre('save', function(next) {
  if (this.isModified('address.lat') || this.isModified('address.lng')) {
    this.locationGeo = {
      type: 'Point',
        //@ts-ignore
      coordinates: [this.address.lng, this.address.lat]
    };
  }
  next();
});

const Property = models.Property || model("Property", PropertySchema);

export default Property;