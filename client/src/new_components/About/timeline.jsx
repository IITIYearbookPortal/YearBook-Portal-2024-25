import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({
  data
}) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#222831] px-2 sm:px-4 md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-20 px-4 text-center">
        <h2 className="text-[18px] sm:text-2xl md:text-4xl text-green-400 mb-4 font-bold">
          About
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white font-bold px-2 sm:px-8 md:px-16 lg:px-44">
          This is a website where you can create your profile that will be shown on the Yearbook'25, comment on your friends, choose which comments you wish to show on your handle in the yearbook, and much more! Feeling lost? Here's what you can do:
        </p>
      </div>
      
      <div ref={ref} className="relative max-w-7xl mx-auto pb-12 sm:pb-16 md:pb-20 md:left-10 lg:left-20">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row justify-start pt-8 sm:pt-16 md:pt-32 lg:pt-40 md:gap-8 lg:gap-16 xl:gap-52">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 sm:top-24 md:top-32 lg:top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-3 md:left-3 rounded-full bg-black flex items-center justify-center">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-neutral-800 border border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl lg:text-3xl xl:text-5xl md:pl-16 lg:pl-20 font-bold text-green-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-12 sm:pl-16 md:pl-4 pr-2 sm:pr-4 w-full">
              <h3 className="md:hidden block text-lg sm:text-2xl mb-2 sm:mb-4 text-left font-bold text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-4 sm:left-6 md:left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};