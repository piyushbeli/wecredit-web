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
    value: '200K',
    suffix: '+',
    label: 'Satisfied Users',
  },
  {
    id: 'disbursal',
    value: '100',
    suffix: ' Cr',
    label: 'Total Disbursal',
  },
  {
    id: 'ratings',
    value: '200K',
    suffix: '+',
    label: 'Ratings',
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
    <section className="py-8 px-4">
      <motion.div
        className="flex justify-around items-start mx-auto"
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
              <span className="text-2xl font-bold text-wc-blue-600 wc-stat-number">
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-lg font-bold text-wc-blue-600">{stat.suffix}</span>
              )}
            </div>
            <span className="text-xs text-gray-600 mt-1 leading-tight">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsSection;

