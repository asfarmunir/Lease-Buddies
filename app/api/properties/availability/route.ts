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

    // Send email to landowner
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Leasebuddies <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: property.contactDetails.email,
      subject: `New Availability Inquiry for ${property.title}`,
      text: `You have a new availability inquiry for your property at ${property.address.formattedAddress}.`,
      html: generateInquiryEmail(property, formData),
    });

    // Optional: Send confirmation email to the user
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Leasebuddies <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: formData.email,
      subject: `Your inquiry for ${property.title}`,
      text: `Thank you for your inquiry about ${property.title}. The property owner will contact you soon.`,
      html: generateConfirmationEmail(property, formData),
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

function generateInquiryEmail(property: any, formData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #28303F; padding: 20px;">
      
      <div style="background: #F7F7F7; border-radius: 20px; padding: 30px;">
        <h2 style="color: #28303F; font-size: 24px; margin-bottom: 20px;">New Availability Inquiry</h2>
        
        <p style="margin-bottom: 20px; line-height: 1.6;">
          You have received a new inquiry for your property at:<br>
          <strong>${property.address.formattedAddress}</strong>
        </p>
        
        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #28303F; font-size: 18px; margin-bottom: 15px;">Inquiry Details</h3>
          
          <p><strong>Property:</strong> ${property.title}</p>
          <p><strong>From:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Move-in Date:</strong> ${formData.moveInDate}</p>
          <p><strong>Floor Plan:</strong> ${formData.floorPlan}</p>
          <p><strong>Message:</strong> ${formData.message || "No additional message"}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${formData.email}" 
            style="background: #28303F; color: #FFFFFF; font-weight: 600; 
            padding: 15px 30px; text-decoration: none; border-radius: 30px; 
            display: inline-block; font-size: 16px; border: none; cursor: pointer;">
            Reply to Inquiry
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

function generateConfirmationEmail(property: any, formData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #28303F; padding: 20px;">
      
      <div style="background: #F7F7F7; border-radius: 20px; padding: 30px;">
        <h2 style="color: #28303F; font-size: 24px; margin-bottom: 20px;">Thank You for Your Inquiry</h2>
        
        <p style="margin-bottom: 20px; line-height: 1.6;">
          We've received your inquiry for:<br>
          <strong>${property.title}</strong><br>
          ${property.address.formattedAddress}
        </p>
        
        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #28303F; font-size: 18px; margin-bottom: 15px;">Your Inquiry Details</h3>
          
          <p><strong>Move-in Date:</strong> ${formData.moveInDate}</p>
          <p><strong>Floor Plan:</strong> ${formData.floorPlan}</p>
          <p><strong>Your Message:</strong> ${formData.message || "No additional message"}</p>
        </div>
        
        <p style="margin-bottom: 15px; line-height: 1.6;">
          The property owner has been notified and will contact you soon at:<br>
          <strong>${formData.email}</strong> or <strong>${formData.phone}</strong>
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