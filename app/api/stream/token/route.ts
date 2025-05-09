import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const streamClient = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      process.env.STREAM_API_SECRET!
    );

    const token = streamClient.createToken(session.user.id);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}