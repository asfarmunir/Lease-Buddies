import { NextRequest, NextResponse } from 'next/server';
import * as bcryptjs from 'bcryptjs';
import User from '@/lib/database/models/user.model';


export async function PATCH(req: NextRequest) {
  const { password, confirmPassword,id } = await req.json();

  if (!password || !confirmPassword) {
    return NextResponse.json({ message: 'Please provide both passwords' }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
  }

  try {

    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (!user.resetToken || user.resetToken !== token) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return NextResponse.json({ message: 'Reset token has expired' }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user
      .save();

      // await passwordChanged(user.email, user.firstName);

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Password reset error: ', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
