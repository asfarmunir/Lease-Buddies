import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await User.findOneAndUpdate(
      { email: session.user.email },
      { password: hashedPassword }
    );
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}