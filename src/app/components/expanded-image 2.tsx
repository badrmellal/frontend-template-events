"use client"

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ExpandableImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const ExpandableImage: React.FC<ExpandableImageProps> = ({ src, alt, width, height }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // portal to render the expanded image overlay
const ExpandedImageOverlay = () => {
    if (!isMounted) return null;
    return createPortal(
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
            style={{ zIndex: 9999 }} 
            onClick={toggleExpand}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex max-w-4xl h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                layout="responsive"
                width={width}
                height={height}
                className="rounded-lg"
              />
              <button
                onClick={toggleExpand}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <motion.div
        className="cursor-zoom-in"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleExpand}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="rounded-lg"
        />
      </motion.div>
      <ExpandedImageOverlay />
      {isMounted && <ExpandedImageOverlay />}
    </>
  );
};