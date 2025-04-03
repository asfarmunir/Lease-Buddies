import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main
      className=" w-full h-screen overflow-y-auto relative"
      style={{
        backgroundImage: "url(/home/authBg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link href={"/"}>
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          className=" absolute top-5 left-5 
        2xl:w-[150px] 3xl:w-[180px]
        "
          alt="Lease Buddies"
        />
      </Link>

      {children}
    </main>
  );
};

export default Layout;
