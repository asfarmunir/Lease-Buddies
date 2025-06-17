"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
} from "react-icons/fa";

interface PropertyImageCarouselProps {
  images: string[];
  selectedImage: string;
  onSelect: (img: string) => void;
}

const PropertyImageCarousel = ({
  images,
  selectedImage,
  onSelect,
}: PropertyImageCarouselProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "auto";
  };

  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <>
      {/* Main Gallery View - Stays fixed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Left Main Image */}
        <div className="bg-slate-50 relative group">
          <Image
            src={selectedImage}
            alt="Property"
            width={800}
            height={500}
            className="rounded-lg w-full h-[407px] 2xl:h-[570px] object-cover"
          />
          <button
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openFullscreen(images.indexOf(selectedImage))}
          >
            <FaExpand className="h-5 w-5" />
          </button>
        </div>

        {/* Right Thumbnails */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((img, index) => (
            <div key={index} className="relative group">
              <Image
                src={img}
                alt={`Image-${index}`}
                width={150}
                height={100}
                className="rounded-lg h-[200px] 2xl:h-[280px] w-full object-cover"
              />
              <button
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={() => openFullscreen(index)}
              >
                <FaExpand className="text-white text-xl" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Carousel */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeFullscreen}
          >
            <div
              className="relative w-full max-w-6xl h-full max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 text-white hover:text-primary-50 transition-colors"
                onClick={closeFullscreen}
              >
                <FaTimes size={28} />
              </button>

              {/* Main Image */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Property image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  quality={100}
                  priority
                />
              </motion.div>

              {/* Navigation Buttons */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("prev");
                }}
              >
                <FaChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-3 rounded-full hover:bg-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("next");
                }}
              >
                <FaChevronRight size={24} />
              </button>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyImageCarousel;
