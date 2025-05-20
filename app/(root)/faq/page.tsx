// app/faq/page.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-lg text-gray-600">
          Welcome! Below you'll find answers to common questions from renters
          and property owners using our long-term rental platform.
        </p>
      </div>

      <div className="space-y-16">
        {/* For Renters Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
            For Renters
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="renter-how-it-works"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">How does this platform work?</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                Our platform connects renters with verified property owners
                offering long-term leases. You can browse listings and get into
                communication with property owners of areas that you would like
                to move to.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="renter-long-term-definition"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  What qualifies as a long-term rental?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                Long-term rentals on our platform typically require a minimum
                lease of 30 days or more. Most listings offer leases between 3
                to 12+ months.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="renter-booking-process"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">How do I book a property?</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                Once you find a place you like, click "Check Availability" or
                "Tour". An email will be sent to the property owner sharing your
                contact information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="renter-payment-security"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">Is my payment secure?</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                Yes. All transactions go through our secure payment system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="renter-fees"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">Are there any fees?</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                No, searching for rental properties is completely free!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="renter-early-termination"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  What if I need to end my lease early?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                All lease agreements are between the lessor and the lessee.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* For Property Owners Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
            For Property Owners
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="owner-listing-process"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">How do I list my property?</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                Click "Post a Listing" at the top of the page. Create an
                account, add property details, upload photos, and set your
                rental terms. Listings are free!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="owner-lease-types"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  What types of leases can I offer?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                You can offer fixed-term leases (e.g., 6 or 12 months),
                month-to-month, or custom arrangements. Specify lease details
                clearly in your listing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="owner-fees"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  Are there any listing fees or commissions?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                You can use our platform for free to post and search for
                properties. You may choose to boost your listings for a fee
                should you wish for your properties to get more exposure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="owner-security-deposit"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  Can I require a security deposit?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                All lease agreements are between the lessor and the lessee.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Trust & Safety Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">
            Trust & Safety
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="trust-lease-binding"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  Are lease agreements legally binding?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                All lease agreements are between the lessor and the lessee.
                Please refer to your local State or Provincial laws and
                regulations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="trust-dispute-resolution"
              className="border border-gray-200 rounded-lg p-4"
            >
              <AccordionTrigger className="flex justify-between items-center w-full text-left font-medium">
                <span className="res_text">
                  What if something goes wrong during the lease?
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-gray-600 res_text">
                All lease agreements are between the lessor and the lessee.
                Please refer to your local State or Provincial mediation
                departments regarding tenant-landlord disputes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Contact Section */}
        <section className="text-center py-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-4">
            Contact us at{" "}
            <a
              href="mailto:admin@leasebuddi.com"
              className="text-primary hover:underline"
            >
              admin@leasebuddi.com
            </a>
            . We're here to help 7 days a week!
          </p>
        </section>
      </div>
    </div>
  );
}
