import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";
import Subscription from "@/lib/database/models/subscription.model";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //@ts-ignore
  apiVersion: "2024-10-28.acacia"
});
import { authOptions } from "../auth/[...nextauth]/route";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, plan } = await req.json();
     console.log("🚀 ~ POST ~ plan:", plan)
    console.log("🚀 ~ POST ~ propertyId:", propertyId)

    if (!propertyId || !plan || !["monthly", "quarterly"].includes(plan)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
   
    await connectToDatabase();

    const property = await Property.findOne({ _id: propertyId, owner: session.user.id });
    if (!property) {
      return NextResponse.json({ error: "Property not found or not owned" }, { status: 404 });
    }

    // Check if property already has an active subscription
    const existingSubscription = await Subscription.findOne({
      property: propertyId,
      status: "active"
    });
    if (existingSubscription) {
      return NextResponse.json({ error: "Property already has an active boost" }, { status: 400 });
    }

    // Create or retrieve Stripe customer
    let customer = await stripe.customers.list({
      email: session.user.email,
      limit: 1
    });
    let customerId: string;
    if (customer.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name
      });
      customerId = newCustomer.id;
    } else {
      customerId = customer.data[0].id;
    }

    // Create Stripe checkout session
    const priceId = plan === "monthly" 
      ? process.env.STRIPE_MONTHLY_PRICE_ID!
      : process.env.STRIPE_QUARTERLY_PRICE_ID!;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?boost=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?boost=canceled`,
      metadata: {
        propertyId,
        userId: session.user.id,
        plan
      }
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await connectToDatabase();

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      //@ts-ignore
      user: session.user.id
    });
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found or not owned" }, { status: 404 });
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    subscription.status = "canceled";
    await subscription.save();

    const property = await Property.findById(subscription.property);
    if (property) {
      property.isFeatured = false;
      property.boostSubscription = null;
      property.boostExpiration = null;
      await property.save();
    }

    return NextResponse.json({ message: "Subscription canceled" });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}