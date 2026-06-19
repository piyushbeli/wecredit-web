"use client";
import React from "react";
import { motion } from "framer-motion";
import { IMAGES } from "@/lib/constants/images";
import CertificationBadge from "./certification-badge";

/**
 * Certifications Section Component
 * Displays WeCredit's certifications including ISO badges and CII logo
 * Features a card with gradient bottom border
 *
 * @returns React component showing certification badges in a styled card
 */
const CertificationsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8 xl:px-0">
        <motion.h2
          className="mb-8  text-center text-xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Certified By
        </motion.h2>

        <div className="mx-auto hidden max-w-5xl md:block">
          <div className="relative overflow-hidden rounded-2xl border-b-8 border-transparent">
            <div className="px-6 py-8">
              <div className="flex flex-row items-center justify-between gap-6">
                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.ISO_BADGE_1}
                  alt="ISO Certification Badge"
                  width={140}
                  height={140}
                  className="w-28 lg:w-[140px]"
                />

                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.CII_LOGO}
                  alt="Confederation of Indian Industry"
                  width={300}
                  height={300}
                  className="w-56 lg:w-[300px]"
                />

                <CertificationBadge
                  src={IMAGES.CERTIFICATIONS.ISO_CERTIFIED}
                  alt="ISO Certified Company"
                  width={120}
                  height={120}
                  className="w-28 lg:w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto md:hidden">
          <div className="max-w-xl mx-auto">
            <div className="relative bg-[#00000005] rounded-2xl overflow-hidden border-b-8  border-b-blue-500 ">
              <div className="px-6 py-8">
                <div className="flex flex-row items-center justify-between gap-6">
                  <CertificationBadge
                    src={IMAGES.CERTIFICATIONS.ISO_BADGE_1}
                    alt="ISO Certification Badge"
                    width={140}
                    height={140}
                    className="w-28 lg:w-[140px]"
                  />

                  <CertificationBadge
                    src={IMAGES.CERTIFICATIONS.CII_LOGO}
                    alt="Confederation of Indian Industry"
                    width={300}
                    height={300}
                    className="w-56 lg:w-[300px]"
                  />

                  <CertificationBadge
                    src={IMAGES.CERTIFICATIONS.ISO_CERTIFIED}
                    alt="ISO Certified Company"
                    width={120}
                    height={120}
                    className="w-28 lg:w-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
