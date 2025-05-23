"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

const whyChooseUs = [
  {
    title: "Comprehensive listings",
    description:
      "Browse and apply to over 1 million listings with long or short term leases throughout the U.S. and Canada.",
  },
  {
    title: "Free to use",
    description:
      " List your properties for free, search for properties for free!",
  },
  {
    title: "User-friendly",
    description:
      "With our simple-to-use platform you can quickly make an account and start listing or searching within minutes! ",
  },
  {
    title: "Boost your listings",
    description:
      "With optional pay-to-boost you can expose your listings to more viewers! ",
  },
  {
    title: "Exceptional customer service",
    description:
      "Our customers are our priority! Any issues using our platform, reach out to us and we’ll get it fixed! ",
  },
];

const Page = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchInput.trim());
      router.push(`/home?${params.toString()}`);
    } else {
      router.push("/home");
    }
  };

  return (
    <section className="w-full py-6 space-y-5">
      <div className="w-full flex flex-col wrapper pb-[20px] md:flex-row gap-4">
        <div className="bg-[#F7F8FA] rounded-[40px] flex-1 flex flex-col justify-center items-start p-6 xl:p-6 2xl:p-8 3xl:p-10">
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 2xl:leading-[72px] 3xl:leading-[75px] font-bold tracking-wide">
            Leasing made <br /> <span className="text-primary">Simple</span>.
          </h1>
          <p className="res_text leading-[28px] max-w-xl 3xl:max-w-2xl mt-4 xl:mt-6 2xl:mt-8">
            Discover millions of houses, apartments, and unique living spaces
            for rent, tailored to your needs. Whether you're looking for a cozy
            studio, a spacious family home, or a luxurious penthouse, find your
            perfect match with ease.
          </p>
          <Link href={"/home"}>
            <button className="res_text bg-primary rounded-full px-4 xl:px-6 py-4 text-white mt-4 xl:mt-6 2xl:mt-8">
              Let me see the listings
            </button>
          </Link>
        </div>

        {/* Image Container */}
        <div className="w-full rounded-[40px] relative flex-1">
          <Image
            src="/hero.svg"
            width={600}
            height={600}
            className="w-full h-full object-cover"
            alt="Lease Buddies"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl 3xl:max-w-3xl bg-white rounded-full flex items-center justify-between shadow-lg px-2 py-2 relative"
            >
              <Input
                type="text"
                placeholder="Search by city, state, or zip code"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full  px-4 border-none focus:outline-none focus:ring-0 shadow-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-40 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-xs text-nowrap bg-[#28303F1A] border border-[#28303f36] rounded-full font-semibold px-4 py-3 text-[#28303F] hover:bg-[#28303F] hover:text-white transition-colors"
              >
                <LuSearch className="w-4 h-4" />
                Search Home
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="w-full flex flex-col wrapper items-center py-[40px] bg-[#FAFAFA] rounded-[40px]">
          <h2 className="text-2xl xl:text-2xl font-bold 2xl:text-4xl 3xl:text-5xl text-[#0A0915]">
            Why <span className="px-1 text-primary">choose</span> us?
          </h2>
          <p className="res_text text-center text-[#0A0915CC] mt-2">
            Helping millions of renters navigate the rental market with
            confidence.
          </p>
          <div className="w-full flex flex-col pt-[40px] md:flex-row gap-4">
            {/* Image Container */}
            <div className="w-full rounded-[40px] flex-1 overflow-hidden">
              <Image
                src="/home/hero2.webp"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                alt="Lease Buddies"
              />
            </div>
            <div className="bg-white rounded-[40px] flex-1 flex flex-col justify-start items-start p-4 xl:p-6 2xl:p-8 3xl:p-10">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {whyChooseUs.map((w, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-[#0000001A] rounded-[28px] overflow-hidden"
                  >
                    <AccordionTrigger className="flex items-start rounded-[10px] px-4 2xl:px-6">
                      <div className="space-y-3 -mt-3">
                        <p className="2xl:text-lg text-primary bg-[#3A99D31A] rounded-full p-1 2xl:w-9 w-8 h-8 2xl:h-9 flex items-center justify-center">
                          {index + 1}
                        </p>
                        <h2 className="2xl:text-lg font-semibold">{w.title}</h2>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 2xl:px-6 pb-6">
                      {w.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div className="w-full flex flex-col wrapper items-center py-[40px] bg-[#FAFAFA] rounded-[40px] px-5 xl:px-8 2xl:px-10 3xl:px-12">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl xl:text-2xl font-bold 2xl:text-4xl text-center sm:text-start 3xl:text-5xl text-[#0A0915]">
                <span className="pr-1 text-primary">Popular </span> Cities
              </h2>
              <p className="res_text text-center text-[#0A0915CC] mt-2">
                Discover houses and apartments for rent in our most popular
                locations.
              </p>
            </div>
            <Link
              href={"/home"}
              className="hidden sm:block res_text bg-primary rounded-full px-4 xl:px-6 py-4 text-white"
            >
              Explore more
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 pt-[40px] gap-4">
            {[
              { name: "Florida, CA", link: "florida" },
              { name: "New York, NY", link: "new-york" },
              { name: "Los Angeles, CA", link: "los-angeles" },
            ].map((p, index) => (
              <div
                key={index}
                className="relative flex justify-center roun-[20px] overflow-hidden"
              >
                <Image
                  src={`/home/city${index + 1}.webp`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  alt="Lease Buddies"
                />
                <div className="absolute w-[95%] p-4 mx-auto bottom-3 bg-white rounded-[20px] flex items-center justify-between">
                  <div className="">
                    <p className="res_text mb-1.5">checkout the listings in</p>
                    <p className="3xl:text-lg font-semibold">{p.name}</p>
                  </div>
                  <Link href={`/home?search=${p.link}`}>
                    <Image
                      src="/route.svg"
                      width={45}
                      height={45}
                      alt="Arrow"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="w-full relative flex flex-col items-center justify-center py-[40px] sm:h-[450px] xl:h-[550px] 2xl:h-[600px] 3xl:h-[650px] bg-[#557594] px-4 sm:rounded-[40px]">
        <Image
          src="/home/bg.webp"
          width={1200}
          height={1200}
          className="absolute bottom-0 w-[90%]"
          alt="Lease Buddies"
        />
        <h2 className="text-2xl text-center xl:text-4xl font-bold 2xl:text-5xl text-white">
          LeaseBuddi National Rent Report
        </h2>
        <p className="res_text text-center text-[#FFFFFFCC] mt-2 max-w-3xl">
          We analyze over one million active listings across the country to
          inform our monthly rent report. Get a comprehensive view of the
          current state of the market.
        </p>
        <div className="flex flex-row sm:gap-4 z-10">
          <button className="res_text bg-white rounded-full px-4 xl:px-6 py-4 text-[#28303F] font-semibold mt-4 xl:mt-6 2xl:mt-8">
            View Latest report
          </button>
          <button className="res_text bg-[#66829E] rounded-full px-4 xl:px-6 py-4 text-white mt-4 xl:mt-6 2xl:mt-8">
            Learn more
          </button>
        </div>
      </div> */}
      <div className="w-full flex flex-col wrapper pb-[20px] md:flex-row gap-4">
        <div className="bg-[#F7F8FA] rounded-[40px] flex-1 flex flex-col justify-center items-start p-6 xl:p-6 2xl:p-9 3xl:p-10">
          <h1 className="text-4xl xl:text-4xl 2xl:text-5xl max-w-2xl 3xl:max-w-2xl 3xl:text-6xl 2xl:leading-[60px] 3xl:leading-[70px] font-bold tracking-wide">
            <span className="text-primary">Marketing solutions</span> for our
            partners, big and small!
          </h1>
          <p className="res_text leading-[28px] max-w-xl 3xl:max-w-2xl mt-4 xl:mt-6 2xl:mt-8">
            Whether you're a property owner, manager or broker, we offer
            customized solutions to help you reach millions of quality renters
            during every step of the renter journey.
          </p>
          <Link
            href={"/home"}
            className="res_text bg-primary rounded-full px-4 xl:px-8 py-4 text-white mt-4 xl:mt-6 2xl:mt-8"
          >
            List your property
          </Link>
        </div>
        <div className="w-full rounded-[40px] flex-1">
          <Image
            src="/home/home.webp"
            width={600}
            height={600}
            className="w-full h-full object-cover"
            alt="Lease Buddies"
          />
        </div>
      </div>
      <div className="wrapper">
        <div className="w-full flex flex-col items-center py-[40px] bg-[#FAFAFA] rounded-[40px]">
          <h2 className="text-2xl xl:text-2xl font-bold 2xl:text-4xl 3xl:text-5xl text-[#0A0915]">
            Find your
            <span className="px-1 text-primary">perfect home </span>
          </h2>
          <p className="res_text text-center text-[#0A0915CC] mt-2">
            Find the perfect place for your family to create cherished memories,
            grow together, and truly feel at home.
          </p>
          <div className="w-full flex sm:px-8 flex-col pt-[40px] md:flex-row items-end gap-4">
            <div className="w-full rounded-[40px] flex-1 overflow-hidden">
              <Image
                src="/home/home1.webp"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                alt="Lease Buddies"
              />
            </div>
            <div className="w-full rounded-[40px] flex-1 overflow-hidden">
              <Image
                src="/home/home2.webp"
                width={600}
                height={600}
                className="w-full h-full object-contain"
                alt="Lease Buddies"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="wrapper">
        <div className="w-full flex flex-col wrapper items-center py-[40px] bg-[#FAFAFA] rounded-[40px] px-5 xl:px-8 2xl:px-10 3xl:px-12">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl xl:text-2xl font-bold 2xl:text-4xl text-center sm:text-start 3xl:text-5xl text-[#0A0915]">
                Your <span className="px-1 text-primary">Popular </span> Leasing{" "}
                <span className="px-1 text-primary">Buddi</span>
              </h2>
              <p className="res_text text-center sm:text-start text-[#0A0915CC] mt-2">
                Find the perfect place for your family to cherish.
              </p>
            </div>
            <button className="hidden sm:block res_text bg-primary rounded-full px-4 xl:px-6 py-4 text-white">
              Read all Stories
            </button>
          </div>
          <div className="w-full flex flex-col gap-4 py-6">
            <div className="w-full flex flex-col-reverse md:flex-row gap-4 items-center bg-white rounded-[20px] justify-between">
              <div className="p-4 xl:p-8 res_text font-semibold">
                <p>
                  The team at LeaseBuddi went above and beyond to help me find
                  the perfect property. Their knowledge of the market is
                  impressive, and their dedication is unmatched."
                </p>
                <p className="flex items-center gap-2 mt-6 mb-2 sm:mb-0">
                  <Image src="/user.svg" width={25} height={25} alt="Quote" />
                  Michael Chen
                </p>
              </div>
              <div className="2xl:h-[330px] 3xl:h-[400px] xl:w-[500px] rounded-[20px] overflow-hidden 2xl:w-[600px]">
                <Image
                  src="/home/testimonial1.webp"
                  alt="hehe"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full flex flex-col-reverse md:flex-row-reverse gap-4 items-center bg-white rounded-[20px] justify-between">
              <div className="p-4 xl:p-8 res_text font-semibold">
                {" "}
                <p>
                  {" "}
                  LeaseBuddi made my property search effortless! Their attention
                  to detail and personalized service ensured I found a home that
                  exceeded my expectations. Highly recommend their expertise!{" "}
                </p>{" "}
                <p className="flex items-center gap-2 mt-6 mb-2 sm:mb-0">
                  {" "}
                  <Image
                    src="/user.svg"
                    width={25}
                    height={25}
                    alt="Quote"
                  />{" "}
                  Sarah Johnson{" "}
                </p>{" "}
              </div>
              <div className="2xl:h-[330px] 3xl:h-[400px] xl:w-[500px] rounded-[20px] overflow-hidden 2xl:w-[600px]">
                <Image
                  src="/home/testimonial1.webp"
                  alt="hehe"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full flex flex-col-reverse md:flex-row gap-4 items-center bg-white rounded-[20px] justify-between">
              <div className="p-4 xl:p-8 res_text font-semibold">
                {" "}
                <p>
                  {" "}
                  LeaseBuddi’s team is exceptional! They guided me through every
                  step of the buying process with patience and expertise. I
                  couldn’t have asked for a better experience—thank you!{" "}
                </p>{" "}
                <p className="flex items-center gap-2 mt-6 mb-2 sm:mb-0">
                  {" "}
                  <Image
                    src="/user.svg"
                    width={25}
                    height={25}
                    alt="Quote"
                  />{" "}
                  Emily Rodriguez{" "}
                </p>{" "}
              </div>
              <div className="2xl:h-[330px] 3xl:h-[400px] xl:w-[500px] rounded-[20px] overflow-hidden 2xl:w-[600px]">
                <Image
                  src="/home/testimonial1.webp"
                  alt="hehe"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="wrapper">
        <div
          className="relative py-12 2xl:h-[515px] px-6 2xl:px-10 flex flex-col md:flex-row items-center gap-6 2xl:gap-12 justify-center rounded-[40px]"
          style={{
            backgroundImage: "url(/home/bg2.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white flex flex-col justify-center items-center  gap-1">
            <h1 className="text-3xl xl:text-4xl text-center  2xl:text-5xl max-w-2xl 3xl:max-w-2xl 3xl:text-5xl 2xl:leading-[60px] 3xl:leading-[70px] font-bold tracking-wide">
              Questions? <br />
              We've got answers.
            </h1>
            <p className="res_text leading-[28px] max-w-xl text-center sm:text-start 3xl:max-w-2xl text-[#FFFFFFCC]">
              Discover houses and apartments for rent in our most popular
              locations.
            </p>
            <Link href={"/faq"} className="">
              <button className="res_text bg-primary rounded-full px-4 mt-3 xl:px-8 py-4 text-white">
                Explore FAQs
              </button>
            </Link>
          </div>
          {/* <div className="bg-white rounded-[40px] max-w-3xl 3xl:max-w-4xl w-full flex-1 flex flex-col justify-start items-start p-4 xl:p-6">
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-1 2xl:space-y-2"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-[#0000001A] rounded-[28px] overflow-hidden"
                >
                  <AccordionTrigger className="flex items-start rounded-[10px] px-4 2xl:px-6">
                    <h2 className="2xl:text-sm text-xs font-semibold">
                      Comprehensive listings
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 2xl:px-6 pb-3 text-xs 2xl:text-sm">
                    Browse and apply to over 1 million listings with long or
                    short term leases throughout the U.S. and Canada.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Page;
