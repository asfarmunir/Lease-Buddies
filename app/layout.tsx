import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import AuthSessionProvider from "@/lib/AuthProvider";
import "stream-chat-react/dist/css/v2/index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lease-buddies",
  description: "lease properties with ease",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <AuthSessionProvider>
          <NextTopLoader
            color="blue"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            showSpinner={false}
            crawl={true}
            easing="ease"
            speed={200}
            shadow="0 0 5px #2299DD,0 0 5px #2299DD"
          />
          {children}
          <Toaster position="bottom-center" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
