import Image from "next/image";
import Link from "next/link";
import React from "react";

const types = [
  {
    subTitle: "1 - 10 UNITS",
    title: "Individual",
    description:
      "Condos, apartments, townhomes, scattered site portfolio, etc.",
    image: "/images/individual.svg",
    url: "/property/list",
  },
  {
    subTitle: "10 - 50+ UNITS",
    title: "Broker or Agent",
    description:
      "Condos, apartments, townhomes, scattered site portfolio, etc.",
    image: "/images/broker.svg",
    url: "/property/list",
  },
  {
    subTitle: "Looking for a home?",
    title: "Renter",
    description:
      "Let landlords reach out to you with the best deals following your criteria.",
    image: "/images/renter.svg",
    url: "/property/find-home",
  },
];

const Page = () => {
  return (
    <section className=" w-full wrapper flex items-center flex-col space-y-4 py-10 justify-center ">
      <p className="bg-[#28303F1A] px-4 md:px-10 py-3 rounded-full border border-primary-100 text-primary-50 res_text font-[600]">
        List your Property or Find Your Spot
      </p>
      <h1 className="text-3xl sm:text-4xl xl:text-5xl font-semibold 2xl:text-6xl">
        Get Results <span className="text-primary">FAST</span>.
      </h1>
      <p className="text-sm 2xl:text-lg text-center 3xl:text-xl text-[#535965]">
        Get results faster with LeaseBoost, simply signup and well show you how!
      </p>
      <div className=" w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl pt-8 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {types.map((type, index) => (
          <div
            key={index}
            className=" border p-4 2xl:p-6 3xl:p-8 border-primary-100 rounded-2xl bg-[#FEFEFE]"
          >
            <div className=" flex items-center justify-center w-full h-[200px] 2xl:h-[250px] 3xl:h-[300px] bg-[#F5F5F5]/10 rounded-2xl">
              <Image src={type.image} width={500} height={500} alt="hehe" />
            </div>
            <div className=" flex flex-col items-center mt-8 2xl:mt-5 w-full">
              <p className="res_text font-semibold mb-2">{type.subTitle}</p>
              <h3 className=" font-bold text-lg 2xl:text-xl mb-1">
                {type.title}
              </h3>
              <p className="res_text text-center text-[#28303FCC]">
                {type.description}
              </p>
              <Link href={type.url} className=" w-full">
                <button className=" bg-primary py-3 rounded-full w-full text-white mt-5 res_text font-semibold">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Page;
