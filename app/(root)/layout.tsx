import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/Navbar";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className=" w-full">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
