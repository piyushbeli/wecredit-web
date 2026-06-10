'use client';

import { motion, Variants } from 'framer-motion';

/** Individual stat configuration */
interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
}

/** Stats data matching the design */
const stats: StatItem[] = [
  {
    id: 'users',
    value: '180K',
    suffix: '+',
    label: 'Satisfied Users',
  },
  {
    id: 'disbursal',
    value: '1000Cr',
    suffix: '+',
    label: 'Total Disbursal',
  },
  {
    id: 'ratings',
    value: '4.2',
    suffix: '',
    label: 'Total Ratings',
  },
];

/** Animation variants for staggered reveal */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Stats section displaying key metrics in a 3-column layout
 * Transparent background to show gradient from hero wrapper
 */
const StatsSection = (): React.ReactNode => {
  return (
    <section className="py-2">
      <motion.div
        className="flex justify-around items-start mx-auto max-w-xl lg:max-w-5xl px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >

        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            className="flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <div className="flex items-baseline">
              <span className="text-[20px] font-medium text-wc-blue-600 wc-stat-number">
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-[20px] font-medium text-wc-blue-600">{stat.suffix}</span>
              )}
            </div>
            <span className="text-[13px] text-gray-600 mt-1 leading-tight">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsSection;

