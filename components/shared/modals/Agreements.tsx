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
    title: "1. Eligibility",
    description: (
      <>
        <span className="font-medium">●</span> You must be at least 18 years old
        to use this Service.
        <br />
        <span className="font-medium">●</span> You represent that you have the
        authority to enter into these Terms and to use our Service.
      </>
    ),
  },
  {
    title: "2. User Accounts",
    description: (
      <>
        <span className="font-medium">●</span> You must create an account to
        post or lease properties.
        <br />
        <span className="font-medium">●</span> You are responsible for
        maintaining the confidentiality of your account credentials.
        <br />
        <span className="font-medium">●</span> You agree to provide accurate and
        complete information.
      </>
    ),
  },
  {
    title: "3. Property Listings",
    description: (
      <>
        <span className="font-medium">●</span> Users may post listings, which
        must be accurate, lawful, and not misleading.
        <br />
        <span className="font-medium">●</span> We reserve the right to remove or
        edit listings that violate our policies or applicable laws.
        <br />
        <span className="font-medium">●</span> Listings must not include:
        <br />
        <span className="ml-4">○ False or misleading descriptions</span>
        <br />
        <span className="ml-4">○ Discriminatory or offensive content</span>
        <br />
        <span className="ml-4">
          ○ Copyrighted material without authorization
        </span>
      </>
    ),
  },
  {
    title: "4. Leasing and Transactions",
    description: (
      <>
        <span className="font-medium">●</span> We are a platform that connects
        lessors and lessees; we are not a party to any lease agreements.
        <br />
        <span className="font-medium">●</span> We do not guarantee the quality,
        safety, legality, or accuracy of any listing or transaction.
        <br />
        <span className="font-medium">●</span> All leasing decisions are made
        solely between the parties involved.
      </>
    ),
  },
  {
    title: "5. Fees and Payments",
    description: (
      <>
        <span className="font-medium">●</span> Some features may be subject to
        fees, which will be clearly disclosed.
        <br />
        <span className="font-medium">●</span> All payments made through the
        platform are subject to our Payment Terms.
        <br />
        <span className="font-medium">●</span> Users are responsible for taxes,
        rent payments, and other financial obligations outside our platform.
      </>
    ),
  },
  {
    title: "6. Prohibited Activities",
    description: (
      <>
        Users must not:
        <br />
        <span className="font-medium">●</span> Use the Service for illegal or
        fraudulent purposes
        <br />
        <span className="font-medium">●</span> Post spam or unauthorized
        advertisements
        <br />
        <span className="font-medium">●</span> Interfere with or disrupt the
        platform
        <br />
        <span className="font-medium">●</span> Impersonate another person or
        entity
      </>
    ),
  },
  {
    title: "7. Intellectual Property",
    description: (
      <>
        <span className="font-medium">●</span> All content on the website,
        except user-generated content, is owned by us or our licensors.
        <br />
        <span className="font-medium">●</span> Users retain rights to their
        content but grant us a license to display and distribute it through the
        Service.
      </>
    ),
  },
  {
    title: "8. Termination",
    description: (
      <>
        <span className="font-medium">●</span> We may suspend or terminate your
        account if you violate these Terms or use the Service inappropriately.
        <br />
        <span className="font-medium">●</span> You may terminate your account at
        any time by contacting us.
      </>
    ),
  },
  {
    title: "9. Disclaimers",
    description: (
      <>
        <span className="font-medium">●</span> The Service is provided "as is"
        and "as available" without warranties of any kind.
        <br />
        <span className="font-medium">●</span> We do not guarantee uninterrupted
        or error-free service.
      </>
    ),
  },
  {
    title: "10. Limitation of Liability",
    description: (
      <>
        <span className="font-medium">●</span> We shall not be liable for any
        indirect, incidental, or consequential damages arising from your use of
        the Service.
        <br />
        <span className="font-medium">●</span> Our total liability to you shall
        not exceed the amount paid by you to us in the past 12 months.
      </>
    ),
  },
  {
    title: "11. Indemnification",
    description: (
      <>
        <span className="font-medium">●</span> You agree to indemnify and hold
        us harmless from any claims or liabilities arising from your use of the
        Service, your content, or violation of these Terms.
      </>
    ),
  },
  {
    title: "12. Modifications",
    description: (
      <>
        <span className="font-medium">●</span> We reserve the right to modify
        these Terms at any time. Continued use after changes indicates
        acceptance.
      </>
    ),
  },
  {
    title: "13. Governing Law",
    description: (
      <>
        <span className="font-medium">●</span> These Terms shall be governed by
        and construed in accordance with the laws of Canada.
      </>
    ),
  },
  {
    title: "14. Contact Information",
    description: (
      <>
        If you have questions about these Terms, contact us at
        admin@leasebuddi.com
      </>
    ),
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

      <DialogContent className="rounded-3xl max-w-2xl  max-h-[95svh] sm:min-w-[600px] overflow-y-auto no-scrollbar">
        <DialogHeader className=" w-full flex flex-col items-center">
          <DialogTitle className="text-2xl font-[500]">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription className="text-center res_text">
            Welcome to leasebuddi.com. These Terms and Conditions ("Terms")
            govern your access to and use of our website and services.
          </DialogDescription>
        </DialogHeader>

        <div className=" bg-[#FDFDFD] border border-[#28303F1A] rounded-3xl p-4 2xl:p-6 2xl:px-8 mt-4">
          <h3 className="font-medium text-lg mb-2 2xl:text-xl text-gray-700">
            General terms and conditions
          </h3>
          <h3 className=" text-gray-500 res_text">
            Effective Date: Jan 4, 2025
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
