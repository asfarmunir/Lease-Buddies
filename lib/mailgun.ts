import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url:"https://api.mailgun.net"
});


export async function sendPasswordResetEmail(
  userEmail: string,
  resetLink: string
) {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Leasebuddies <no-reply@${process.env.MAILGUN_DOMAIN}>`,
      to: userEmail,
      subject: "Password Reset Request",
      text: `Hi,\n\nWe received a request to reset your password for your Leasebuddies account.\n\nClick this link to reset your password: ${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nLeasebuddies Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #28303F; padding: 20px;">
      
          <div style="background: #F7F7F7; border-radius: 20px; padding: 30px;">
            <h2 style="color: #28303F; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="margin-bottom: 20px; line-height: 1.6;">
              We received a request to reset your password for your Leasebuddies account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                style="background: #28303F; color: white; font-weight: 600; 
                padding: 15px 30px; text-decoration: none; border-radius: 30px; 
                display: inline-block; font-size: 16px; border: none; cursor: pointer;">
                Reset Password
              </a>
            </div>
            
            <p style="margin-bottom: 15px; line-height: 1.6; font-size: 14px; color: #28303FCC;">
              This link will expire in 24 hours. If you didn't request this password reset, 
              please ignore this email or contact our support team.
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
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #28303FCC;">
            © ${new Date().getFullYear()} Leasebuddies. All rights reserved.
          </div>
        </div>
      `,
    });

    return response;
  } catch (error) {
    console.error("Mailgun Error:", error);
    throw error;
  }
}