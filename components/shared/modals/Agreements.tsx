"use client";
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
import { FaCheck } from "react-icons/fa";
import { Checkbox } from "../../ui/checkbox";

const agreements = [
  {
    title: "User Responsibilities: ",
    description:
      "Users must not engage in any unlawful activities, including but not limited to hacking, phishing, or distributing malware.",
  },
  {
    title: "Prohibited Conduct:",
    description:
      "All content provided by the service, including text, images, and logos, are the property of the company and may not be used without permission.",
  },
  {
    title: "Intellectual Property:",
    description:
      "Users must not engage in any unlawful activities, including but not limited to hacking, phishing, or distributing malware.",
  },
  {
    title: "Termination:",
    description:
      "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.",
  },
  {
    title: "Limitation of Liability:",
    description:
      "All content provided by the service, including text, images, and logos, are the property of the company and may not be used without permission.",
  },
];

const Filters = ({ acceptTerm }: { acceptTerm: (term: boolean) => void }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" px-6 py-3 rounded-full bg-primary text-white font-semibold res_text">
          Get Started
        </button>
      </DialogTrigger>

      <DialogContent className="rounded-3xl max-h-[95svh] sm:min-w-[600px] overflow-y-auto no-scrollbar">
        <DialogHeader className=" w-full flex flex-col items-center">
          <DialogTitle className="text-2xl font-[500]">
            Read our Terms & Conditions
          </DialogTitle>
          <DialogDescription className="text-center res_text">
            Before we start please make sure you read & understand our policy.
          </DialogDescription>
        </DialogHeader>

        <div className=" bg-[#FDFDFD] border border-[#28303F1A] rounded-3xl p-4 2xl:p-6 2xl:px-8 mt-4">
          <h3 className="font-medium text-lg mb-2 2xl:text-xl text-gray-700">
            General terms and conditions
          </h3>
          <h3 className=" text-gray-500 res_text">
            Effective Date: October 5th, 2023
          </h3>

          <div className="flex flex-col gap-4 mt-5">
            {agreements.map((item, index) => (
              <div key={index} className="flex items-start gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-gray-700">{item.title}</h3>
                  <p className="text-gray-500 res_text">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 mt-4">
          <Checkbox
            id={`agreement`}
            checked={isChecked}
            //@ts-ignore
            onCheckedChange={setIsChecked}
            className="h-5 w-5 rounded-full"
          />
          <label
            htmlFor={`agreement`}
            className="text-gray-500 res_text text-sm"
          >
            I agree to the terms & conditions.
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-3.5 flex flex-col gap-3">
          <button
            onClick={() => acceptTerm(true)}
            disabled={!isChecked}
            className="bg-primary disabled:opacity-40 font-semibold text-white py-3 rounded-full"
          >
            Get started
          </button>
          <button className="bg-[#D4D4D41A] font-semibold border-[#28303F1A] border py-3 rounded-full">
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Filters;
