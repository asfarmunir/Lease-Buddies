"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const Inbox = () => {
  const { data: session, status } = useSession();
  const [client, setClient] = useState<StreamChat | null>(null);
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const initChat = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        if (!apiKey) {
          throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not defined");
        }
        console.log("Initializing StreamChat for Inbox with API key:", apiKey);

        const streamClient = StreamChat.getInstance(apiKey);
        const response = await fetch("/api/stream/token");
        if (!response.ok) throw new Error("Failed to fetch Stream token");
        const { token } = await response.json();

        await streamClient.connectUser(
          {
            id: session!.user.id,
            name: session!.user.firstname || session!.user.email,
            image: session!.user.profileImage || undefined,
          },
          token
        );

        if (isMounted.current) {
          setClient(streamClient);
        }

        streamClient.on("connection.changed", (event) => {
          console.log("Stream connection status:", event);
        });
      } catch (error: any) {
        console.error("Error initializing chat:", error);
        if (isMounted.current) {
          toast.error(`Failed to load inbox: ${error.message}`);
        }
      }
    };

    if (session?.user?.id) {
      initChat();
    }

    return () => {
      isMounted.current = false;
      if (client) {
        client
          .disconnectUser()
          .catch((err) => console.error("Error disconnecting client:", err));
      }
    };
  }, [session?.user?.id, client]);

  if (status === "loading" || !client || !session?.user?.id) {
    return (
      <div className="w-full bg-[#EFEFEF] p-5">
        <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
          <div className="flex justify-center items-center h-80 flex-col animate-pulse">
            <Image src="/logo.png" alt="empty inbox" width={100} height={100} />
            <p className="res_text mt-4 font-semibold">Loading Inbox...</p>
          </div>
        </div>
      </div>
    );
  }

  const filters = { type: "messaging", members: { $in: [session.user.id] } };
  const sort = { last_message_at: -1 };

  return (
    <div className="w-full bg-[#EFEFEF] p-5">
      <div className="bg-white rounded-[20px] p-4 md:p-5 wrapper 2xl:p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Inbox</h1>
        <Chat client={client} theme="messaging light">
          <div className="flex">
            <ChannelList filters={filters} sort={sort} />
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default Inbox;
