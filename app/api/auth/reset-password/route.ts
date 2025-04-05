import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/lib/database/models/user.model";
import { sendResetEmail } from "@/lib/sendgrid";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1-hour expiration

     user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();




    const resetLink = `${process.env.APP_URL}/forget-password/${user.id}?token=${resetToken}`;
    await sendResetEmail(email, resetLink);

    return NextResponse.json(
      { message: "Reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } 
}
