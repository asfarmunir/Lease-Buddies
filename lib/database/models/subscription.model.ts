import { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    stripeCustomerId: {
      type: String,
      required: true
    },
    stripeSubscriptionId: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      enum: ["monthly", "quarterly"],
      required: true
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "unpaid"],
      default: "active"
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    boostExpiration: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Subscription = models.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;