"use client";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/Navbar";
import React, { useState, useEffect } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has previously accepted cookies
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  return (
    <main className="w-full relative min-h-screen">
      <Navbar />
      {children}
      <Footer />
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 sm:p-6 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center font-semibold sm:text-left">
              We use cookies to enhance your experience on our website. By
              continuing to use our site, you agree to our use of cookies.{" "}
              <a
                href="/privacy-policy"
                className="underline hover:text-blue-300 transition-colors"
              >
                Learn more
              </a>
            </p>
            <button
              onClick={handleAcceptCookies}
              className="bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-full transition-colors duration-200"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Layout;
