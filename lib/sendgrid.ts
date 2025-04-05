import sendgrid from '@sendgrid/mail';
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
const FROM_EMAIL = process.env.SENDGRID_EMAIL!;


export async function sendResetEmail ( to:string,link:string) {
 const message = {
    to,
    from: FROM_EMAIL,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`}

  try {
    const response = await sendgrid.send(message);
    console.log("email sent successfully:", response);
  } catch (error) {
    console.error("Error sending  email:", error);
  }
}