import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Subscription from "@/lib/database/models/subscription.model";
import Property from "@/lib/database/models/property.model";
import { connectToDatabase } from "@/lib/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //@ts-ignore
  apiVersion: "2024-10-28.acacia"
});

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature")!;
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await connectToDatabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { propertyId, userId, plan } = session.metadata!;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Calculate boost expiration
        const boostExpiration = new Date();
        boostExpiration.setMonth(
          boostExpiration.getMonth() + (plan === "monthly" ? 1 : 3)
        );

        // Create subscription record
        const newSubscription = new Subscription({
          user: userId,
          property: propertyId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          plan,
          status: "active",
          boostExpiration
        });
        await newSubscription.save();

        // Update property
        const property = await Property.findById(propertyId);
        if (property) {
          property.isFeatured = true;
          property.boostSubscription = newSubscription._id;
          property.boostExpiration = boostExpiration;
          await property.save();
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionRecord = await Subscription.findOne({
          stripeSubscriptionId: subscription.id
        });

        if (subscriptionRecord) {
          subscriptionRecord.status = subscription.status;
          await subscriptionRecord.save();

          const property = await Property.findById(subscriptionRecord.property);
          if (property && subscription.status !== "active") {
            property.isFeatured = false;
            property.boostSubscription = null;
            property.boostExpiration = null;
            await property.save();
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}