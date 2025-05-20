import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer
      className="bg-[#0A0915] relative text-white py-12 2xl:py-16  rounded-tr-[40px] rounded-tl-[40px]"
      style={{
        backgroundImage: "url(/home/footerBg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* <Image
        src="/home/footerBg.webp"
        width={1200}
        height={1200}
        className=" absolute bottom-0 w-[90%]  "
        alt="Lease Buddies"
      /> */}

      <div className=" px-6 flex flex-col md:flex-row gap-12  justify-between lg:px-12">
        {/* Left Section */}
        <div>
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="LeaseBuddi Logo" className="h-12" />
          </div>
          <p className="mt-3 text-[#FFFFFFCC] text-[16px] leading-[36px] max-w-lg 2xl:max-w-2xl">
            Simplify your renting experience with LeaseBuddi! Post apartments,
            condos, and homes for rent and connect with the perfect tenant.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="text-[#FFFFFFCC] bg-[#FFFFFF1A] p-4 rounded-full hover:text-white"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="#"
              className="text-[#FFFFFFCC] bg-[#FFFFFF1A] p-4 rounded-full hover:text-white"
            >
              <RiInstagramFill size={22} />
            </a>
            {/* <a
              href="#"
              className="text-[#FFFFFFCC] bg-[#FFFFFF1A] p-4 rounded-full hover:text-white"
            >
              <FaYoutube size={22} />
            </a> */}
          </div>
        </div>

        <div className="flex flex-wrap  gap-4 gap-y-8    2xl:gap-12">
          <div>
            <h3 className="text-sm 2xl:text-base 3xl:text-lg font-semibold mb-3">
              Company
            </h3>
            <ul className="space-y-2 2xl:space-y-4 3xl:space-y-6 text-[#FFFFFFCC]">
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Rental Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm 2xl:text-base 3xl:text-lg font-semibold mb-3">
              Help Center
            </h3>
            <ul className="space-y-2 2xl:space-y-4 3xl:space-y-6 text-[#FFFFFFCC]">
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Fair Housing Rights
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm 2xl:text-base 3xl:text-lg font-semibold mb-3">
              Privacy Policy
            </h3>
            <ul className="space-y-2 2xl:space-y-4 3xl:space-y-6 text-[#FFFFFFCC]">
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Notice of Collection
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Do Not Sell or Share <br /> My Information
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm 2xl:text-base 3xl:text-lg font-semibold mb-3">
              Advertise With Us
            </h3>
            <ul className="space-y-2 2xl:space-y-4 3xl:space-y-6 text-[#FFFFFFCC]">
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Tenant Screening
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  List Property
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white text-xs 2xl:text-sm">
                  Landlord Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LeaseBuddi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
