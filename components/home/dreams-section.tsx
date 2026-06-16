'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Dreams section with branded tagline
 * Displays inspirational message before the footer
 */
const DreamsSection = (): React.ReactNode => {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-4 lg:py-24">
      <motion.div
        className="mx-auto max-w-7xl text-left lg:text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-[34px] font-semibold leading-[1.12] tracking-normal text-[#D9D9D9] min-[375px]:text-[40px] sm:text-[64px] md:text-[82px] lg:text-[108px] xl:text-[140px]">
          <span className="block">For dreams that</span>
          <span className="block">don&apos;t wait !</span>
        </h2>

        <p className="mt-6 text-2xl leading-none tracking-normal text-[#7F7F7F] sm:mt-8 sm:text-[32px] md:text-[36px] lg:mt-14 lg:text-4xl">
          Made with <span className="text-brand-primary">💙</span> in India.
        </p>
      </motion.div>
    </section>
  );
};

export default DreamsSection;
