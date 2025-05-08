"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Property } from "@/lib/types/property";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const planTypes = [
  {
    title: "Monthly Plan",
    description: "Perfect for quick boosts",
    price: 36,
    plan: "monthly",
  },
  {
    title: "Quarterly Plan",
    description: "Save with a 3-month package",
    price: 90,
    plan: "quarterly",
  },
];

const steps = ["Select Property", "Choose Plan", "Review & Checkout"];

interface BoostListingProps {
  properties: Property[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function BoostListing({
  properties,
  open,
  onOpenChange,
}: BoostListingProps) {
  const [step, setStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step === 0 && !selectedProperty) {
      setError("Please select a property to boost.");
      return;
    }
    if (step === 1 && !selectedPlan) {
      setError("Please select a boost plan.");
      return;
    }
    if (step === 2 && selectedProperty && selectedPlan) {
      await handleCheckout();
      return;
    }
    setError(null);
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    if (step > 0) setStep(step - 1);
  };

  const handleCheckout = async () => {
    if (!selectedProperty || !selectedPlan) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //@ts-ignore
          propertyId: selectedProperty.id,
          plan: selectedPlan,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError("Error initiating checkout. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <button className="bg-[#28303F] text-white px-4 xl:px-8 py-2.5 2xl:py-3 text-sm 2xl:text-base rounded-full font-medium">
          Boost New Listing
        </button>
      </DialogTrigger> */}
      <DialogContent className="max-h-[95svh] rounded-3xl overflow-y-auto max-w-5xl p-6">
        <DialogHeader className="hidden  items-center justify-between">
          <DialogTitle className="text-xl 2xl:text-2xl font-semibold text-primary-50">
            Boost Listing
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          {/* Progress Bar */}
          {step !== 0 && (
            <div className="w-full bg-[#28303F1A] rounded-full h-2 mt-3 mb-6">
              <motion.div
                className="bg-[#28303F] h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Step 1: Select Property */}
          {step === 0 && (
            <div>
              <h2 className="text-lg 2xl:text-2xl text-center md:text-start font-semibold text-primary-50">
                Select a Property to Boost
              </h2>
              <p className="text-primary-200 font-normal text-sm 2xl:text-base mt-2 text-center md:text-start">
                Choose one of your properties to boost.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 xl:gap-4 2xl:gap-6 mt-6">
                {properties.map((property, index) => {
                  if (property.isFeatured) return null; // Skip already boosted properties

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedProperty(property);
                        setError(null);
                      }}
                      className="bg-white rounded-[16px] overflow-hidden"
                    >
                      <div className="relative">
                        <Image
                          src={property.featuredImage || "/images/prop.png"}
                          alt={property.title}
                          width={400}
                          height={250}
                          className="w-full h-40 2xl:h-[200px] object-cover"
                        />
                      </div>
                      <div className="p-4 border border-[#28303F1A] rounded-[16px] -mt-6 bg-white relative">
                        <div className="flex items-start  justify-between">
                          <div>
                            <h3 className="text-lg mb-1 font-semibold">
                              {property.title}
                            </h3>
                            <p className="text-xs 3xl:text-sm text-gray-500">
                              {property.location}
                            </p>
                          </div>
                        </div>
                        {!property.isFeatured && (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setError(null);
                            }}
                            className={` font-normal text-xs w-full 2xl:text-sm py-2 px-4 rounded-full mt-4
                          
                          ${
                            // @ts-ignore
                            selectedProperty?.id === property.id
                              ? "bg-primary text-white font-semibold"
                              : "border border-[#dbdbdb] text-primary-50"
                          }
                          `}
                          >
                            {
                              // @ts-ignore
                              selectedProperty?.id === property.id ? (
                                <span>Selected</span>
                              ) : (
                                <span className="">Select Property</span>
                              )
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {error && (
                <p className="text-red-500 mt-4 text-center">{error}</p>
              )}
            </div>
          )}

          {/* Step 2: Choose Plan */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 text-center">
                Choose Your Boost Plan
              </h2>
              <p className="text-sm 2xl:text-base text-[#28303FCC] text-center">
                Select the plan that works best for you
              </p>
              <div className="w-full my-4 space-y-2">
                {planTypes.map((plan, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPlan(plan.plan);
                      setError(null);
                    }}
                    className={`w-full flex items-center justify-between border cursor-pointer border-primary-100 rounded-[20px] p-4 2xl:py-5 2xl:px-6 ${
                      selectedPlan === plan.plan
                        ? "bg-primary/15"
                        : plan.plan === "monthly"
                    }`}
                  >
                    <div>
                      <h2 className="2xl:text-lg capitalize mb-1 font-semibold 3xl:text-xl">
                        {plan.title}
                      </h2>
                      <p className="text-sm 2xl:text-base">
                        {plan.description}
                      </p>
                    </div>
                    <p className="text-sm 2xl:text-base font-semibold">
                      ${plan.price}/
                      {plan.plan === "monthly" ? "month" : "3 months"}
                    </p>
                  </div>
                ))}
              </div>
              {error && (
                <p className="text-red-500 mt-4 text-center">{error}</p>
              )}
            </div>
          )}

          {/* Step 3: Review & Checkout */}
          {step === 2 && selectedProperty && selectedPlan && (
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl 2xl:text-2xl font-semibold text-primary-50 text-center">
                Review Your Boost
              </h2>
              <p className="text-sm 2xl:text-base text-[#28303FCC] text-center">
                Confirm the details before proceeding to payment
              </p>
              <div className="w-full my-4 space-y-4">
                {/* Property Details */}
                <div className="border border-primary-100 flex items-center justify-between rounded-[20px] p-4 2xl:p-6 bg-[#F7F7F7]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={
                          selectedProperty.featuredImage ||
                          selectedProperty.photos[0] ||
                          "/images/placeholder.png"
                        }
                        alt={selectedProperty.title}
                        fill
                        className="object-cover rounded-[14px]"
                        sizes="96px"
                      />
                    </div>
                    <div>
                      <h4 className="text-base 2xl:text-lg font-semibold text-primary-50">
                        {selectedProperty.title}
                      </h4>
                      <p className="text-sm text-primary-200">
                        {selectedProperty.location}
                      </p>
                    </div>
                  </div>
                  <p className=" text-xs 2xl:text-sm border bg-white text-nowrap border-primary-100 rounded-full px-3 py-1 flex items-center gap-2 text-primary-50 ">
                    Active listing
                  </p>
                </div>
                {/* Plan Details */}
                <div className="border border-primary-100 rounded-[20px] p-4 2xl:p-6 bg-[#F7F7F7]">
                  <h3 className="text-lg 2xl:text-xl font-semibold text-primary-50 mb-2"></h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base 2xl:text-lg font-semibold text-primary-50">
                        {planTypes.find((p) => p.plan === selectedPlan)?.title}
                      </h4>
                      <p className="text-sm text-primary-200">
                        {
                          planTypes.find((p) => p.plan === selectedPlan)
                            ?.description
                        }
                      </p>
                    </div>
                    <p className="text-base font-semibold text-primary-50">
                      ${planTypes.find((p) => p.plan === selectedPlan)?.price}/
                      {selectedPlan === "monthly" ? "month" : "3 months"}
                    </p>
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-red-500 mt-4 text-center">{error}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleBack}
              className="bg-[#D4D4D41A] px-8 hover:text-white py-3.5 text-primary-200 rounded-full border border-primary-100 font-semibold"
              disabled={step === 0 || loading}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-white px-8 py-3.5 rounded-full font-semibold"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : step === 2
                ? "Proceed to Payment"
                : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
