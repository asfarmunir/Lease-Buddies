import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AvailabilityFormData {
  fullName: string;
  email: string;
  phone: string;
  moveInDate: string;
  floorPlan: string;
  message: string;
}

const CheckAvailability: React.FC<{
  propertyId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}> = ({ propertyId, open, onOpenChange }) => {
  const [formData, setFormData] = useState<AvailabilityFormData>({
    fullName: "",
    email: "",
    phone: "",
    moveInDate: "",
    floorPlan: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/properties/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      toast.success("Inquiry submitted successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        moveInDate: "",
        floorPlan: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      moveInDate: "",
      floorPlan: "",
      message: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <button className="bg-primary text-white font-semibold w-full py-3 rounded-full mt-4">
          Check Availability
        </button>
      </DialogTrigger> */}

      <DialogContent className="rounded-3xl max-w-xl max-h-[95svh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="mb-2">Check Availability</DialogTitle>
          <DialogDescription>
            Fill out the form to check availability for this property.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:min-w-[506px] items-center gap-4"
        >
          {/* Full Name */}
          <div className="w-full space-y-2">
            <label
              htmlFor="fullName"
              className="pl-4 res_text font-[500] text-start"
            >
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
              required
            />
          </div>

          {/* Email */}
          <div className="w-full space-y-2">
            <label
              htmlFor="email"
              className="pl-4 res_text font-[500] text-start"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="w-full space-y-2">
            <label
              htmlFor="phone"
              className="pl-4 res_text font-[500] text-start"
            >
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
              required
            />
          </div>

          {/* Move In Date and Floor Plan (same row) */}
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="w-full space-y-2">
              <label
                htmlFor="moveInDate"
                className="pl-4 res_text font-[500] text-start"
              >
                Move In Date
              </label>
              <Input
                id="moveInDate"
                name="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={handleChange}
                className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                required
              />
            </div>
            <div className="w-full space-y-2">
              <label
                htmlFor="floorPlan"
                className="pl-4 res_text font-[500] text-start"
              >
                Floor Plan
              </label>
              <Input
                id="floorPlan"
                name="floorPlan"
                value={formData.floorPlan}
                onChange={handleChange}
                placeholder="Preferred floor plan"
                className="bg-[#F7F7F7] text-xs md:text-sm 3xl:text-base rounded-full border border-[#28303F1A] py-7 2xl:py-8 sm:px-5 w-full text-[#28303FCC]"
                required
              />
            </div>
          </div>

          {/* Custom Message */}
          <div className="w-full space-y-2">
            <label
              htmlFor="message"
              className="pl-4 res_text font-[500] text-start"
            >
              Custom Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional information or questions"
              className="bg-[#F7F7F7] text-xs h-24 md:text-sm 3xl:text-base rounded-3xl border border-[#28303F1A] py-4 px-5 w-full text-[#28303FCC]"
            />
          </div>

          {/* Buttons */}
          <div className="mt-1.5 flex flex-col gap-3 w-full">
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-primary disabled:opacity-50 font-semibold text-white py-4 res_text rounded-full hover:bg-primary-dark transition-colors"
            >
              Check Availability
            </button>
            <p className="text-center text-xs mt-2 md:text-sm 3xl:text-base text-[#28303F]">
              By sending this inquiry, I accept LeaseBuddi’s Terms and
              Conditions, Privacy Policy, and Community Values.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckAvailability;
