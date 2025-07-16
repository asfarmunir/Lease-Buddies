"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PrivacyPolicy = () => {
  return (
    <main
      className=" w-full h-screen overflow-y-auto relative"
      style={{
        backgroundImage: "url(/home/authBg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link href={"/"}>
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          className=" absolute top-5 left-5 
        2xl:w-[150px] 3xl:w-[180px]
        "
          alt="Lease Buddies"
        />
      </Link>
      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="bg-white py-8 px-6 md:px-10 rounded-[32px] shadow-lg max-w-3xl w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Privacy Policy
          </h2>

          <div className="space-y-6 text-sm text-[#28303FCC]">
            <p className="text-center font-medium">Effective Date: July 2025</p>

            <p>
              LeaseBuddi.com ("we", "us", or "our") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              share, and safeguard your information when you use our website
              (the "Site") to list or search for rental properties.
            </p>

            <p>
              By using LeaseBuddi.com, you agree to the collection and use of
              information in accordance with this policy.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                1. Information We Collect
              </h3>
              <p>
                When you use LeaseBuddi.com, we collect the following personal
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>
                  Phone Number (Note: This will be publicly displayed on your
                  listing)
                </li>
                <li>Property Address (Only for listing purposes)</li>
              </ul>
              <p>
                This information is necessary to create and manage listings,
                communicate with users, and provide customer support.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                2. How We Use Your Information
              </h3>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To display your rental listings on the website</li>
                <li>To allow renters to contact you regarding your property</li>
                <li>
                  To send you important updates, confirmations, or support
                  messages
                </li>
                <li>
                  To improve and personalize your experience on our platform
                </li>
                <li>To prevent fraud and ensure site security</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                3. Information Sharing
              </h3>
              <p>
                We do not sell, rent, or trade your personal information to
                third parties. However, we may share your information in the
                following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Public Listings:</strong> Your phone number and
                  property address are displayed publicly with your listing so
                  potential renters can contact you.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may use trusted
                  third-party services to support our platform, such as hosting
                  providers or customer service tools. These parties are
                  required to keep your information secure and confidential.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information if required by law, legal process, or to protect
                  our rights or the rights of others.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                4. Data Security
              </h3>
              <p>
                We implement reasonable safeguards to protect your personal
                information from unauthorized access, disclosure, or misuse.
                However, no system is completely secure, and we cannot guarantee
                absolute protection.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                5. Your Choices and Rights
              </h3>
              <p>You may:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Update or delete your listing by logging into your account
                </li>
                <li>
                  Contact us to request deletion of your personal information
                </li>
                <li>Opt out of marketing communications at any time</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                6. Children's Privacy
              </h3>
              <p>
                LeaseBuddi.com is not intended for use by children under the age
                of 18. We do not knowingly collect personal information from
                individuals under 18.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                7. Changes to This Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new policy
                on this page with a revised effective date.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#28303F]">
                8. Contact Us
              </h3>
              <p>
                If you have any questions about this Privacy Policy or your
                personal data, please contact us at:
              </p>
              <p className="font-medium">Email: admin@leasebuddi.com</p>
            </div>

            <div className="pt-6">
              <Link href="/">
                <Button className="w-full rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
    </main>
  );
};

export default PrivacyPolicy;
