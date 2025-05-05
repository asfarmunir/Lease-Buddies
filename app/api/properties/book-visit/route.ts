import { NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { connectToDatabase } from "@/lib/database";
import Property from "@/lib/database/models/property.model";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: "https://api.eu.mailgun.net"
});

export async function POST(request: Request) {
  try {
     await connectToDatabase();

    const { propertyId, formData } = await request.json();

    // Get property details
    const property = await Property.findById(propertyId).populate("owner");
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Format visit date based on type
    const visitDate = formData.visitType === "virtual" 
      ? new Date(formData.visitDate).toLocaleString()
      : new Date(formData.visitDate).toLocaleDateString();

    // Send email to landowner
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Leasebuddies <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: property.contactDetails.email,
      subject: `New ${formData.visitType === "virtual" ? "Virtual Tour" : "In-Person Visit"} Request`,
      text: `You have a new visit request for your property at ${property.address.formattedAddress}.`,
      html: generateBookingEmail(property, formData, visitDate),
    });

    // Send confirmation email to the user
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Leasebuddies <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: formData.email,
      subject: `Your ${formData.visitType === "virtual" ? "Virtual Tour" : "Visit"} Request`,
      text: `Thank you for requesting a ${formData.visitType === "virtual" ? "virtual tour" : "visit"} for ${property.title}. The property owner will contact you soon.`,
      html: generateConfirmationEmail(property, formData, visitDate),
    });

    return NextResponse.json(
      { message: "Visit request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error booking visit:", error);
    return NextResponse.json(
      { error: "Failed to submit visit request" },
      { status: 500 }
    );
  }
}

function generateBookingEmail(property: any, formData: any, visitDate: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #28303F; padding: 20px;">
      
      <div style="background: #F7F7F7; border-radius: 20px; padding: 30px;">
        <h2 style="color: #28303F; font-size: 24px; margin-bottom: 20px;">
          New ${formData.visitType === "virtual" ? "Virtual Tour" : "In-Person Visit"} Request
        </h2>
        
        <p style="margin-bottom: 20px; line-height: 1.6;">
          You have received a new visit request for your property at:<br>
          <strong>${property.address.formattedAddress}</strong>
        </p>
        
        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #28303F; font-size: 18px; margin-bottom: 15px;">Request Details</h3>
          
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>Visitor:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Visit Type:</strong> ${formData.visitType === "virtual" ? "Virtual Tour" : "In-Person Visit"}</p>
          <p><strong>Preferred ${formData.visitType === "virtual" ? "Date/Time" : "Date"}:</strong> ${visitDate}</p>
          <p><strong>Move-in Date:</strong> ${formData.moveInDate ? new Date(formData.moveInDate).toLocaleDateString() : 'Not specified'}</p>
          <p><strong>Floor Plan:</strong> ${formData.floorPlan || 'Not specified'}</p>
          <p><strong>Additional Notes:</strong> ${formData.message || "None"}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${formData.email}" 
            style="background: #28303F; color: #FFFFFF; font-weight: 600; 
            padding: 15px 30px; text-decoration: none; border-radius: 30px; 
            display: inline-block; font-size: 16px; border: none; cursor: pointer;">
            Respond to Request
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #28303F1A;">
          <p style="font-size: 12px; color: #28303FCC; margin: 5px 0;">
            <strong>Leasebuddies Team</strong>
          </p>
          <p style="font-size: 12px; color: #28303FCC; margin: 5px 0;">
            <a href="mailto:support@leasebuddies.com" style="color: #28303F; text-decoration: none;">
              support@leasebuddies.com
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
}

function generateConfirmationEmail(property: any, formData: any, visitDate: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #28303F; padding: 20px;">
      
      <div style="background: #F7F7F7; border-radius: 20px; padding: 30px;">
        <h2 style="color: #28303F; font-size: 24px; margin-bottom: 20px;">
          ${formData.visitType === "virtual" ? "Virtual Tour" : "Visit"} Request Received
        </h2>
        
        <p style="margin-bottom: 20px; line-height: 1.6;">
          We've received your ${formData.visitType === "virtual" ? "virtual tour" : "visit"} request for:<br>
          <strong>${property.title}</strong><br>
          ${property.address.formattedAddress}
        </p>
        
        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #28303F; font-size: 18px; margin-bottom: 15px;">Your Request Details</h3>
          
          <p><strong>Visit Type:</strong> ${formData.visitType === "virtual" ? "Virtual Tour" : "In-Person Visit"}</p>
          <p><strong>Preferred ${formData.visitType === "virtual" ? "Date/Time" : "Date"}:</strong> ${visitDate}</p>
          <p><strong>Move-in Date:</strong> ${formData.moveInDate ? new Date(formData.moveInDate).toLocaleDateString() : 'Not specified'}</p>
          <p><strong>Floor Plan:</strong> ${formData.floorPlan || 'Not specified'}</p>
          <p><strong>Additional Notes:</strong> ${formData.message || "None"}</p>
        </div>
        
        <p style="margin-bottom: 15px; line-height: 1.6;">
          The property owner has been notified and will contact you soon at:<br>
          <strong>${formData.email}</strong> or <strong>${formData.phone}</strong> to confirm your request.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #28303F1A;">
          <p style="font-size: 12px; color: #28303FCC; margin: 5px 0;">
            <strong>Leasebuddies Team</strong>
          </p>
          <p style="font-size: 12px; color: #28303FCC; margin: 5px 0;">
            <a href="mailto:support@leasebuddies.com" style="color: #28303F; text-decoration: none;">
              support@leasebuddies.com
            </a>
          </p>
        </div>
      </div>
    </div>
  `;
}