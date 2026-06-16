'use client';

import { motion, Variants } from 'framer-motion';

interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
}

const stats: StatItem[] = [
  {
    id: 'users',
    value: '180K',
    suffix: ' +',
    label: 'Satisfied Users',
  },
  {
    id: 'disbursal',
    value: '1000 Cr',
    suffix: '+',
    label: 'Total Disbursal',
  },
  {
    id: 'ratings',
    value: '4.2',
    suffix: '',
    label: 'Ratings',
  },
  {
    id: 'support',
    value: '24/7',
    suffix: '',
    label: 'Expert Support',
  },
];

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
 * Stats section displaying key metrics in a 4-column layout with dividers
 */
const StatsSection = (): React.ReactNode => {
  return (
    <section className="bg-white py-8 lg:py-10">
      <motion.div
        className="mx-auto max-w-7xl xl:px-0 px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className={`flex flex-col items-center text-center py-4 lg:py-0 ${index % 2 === 1 ? 'border-l border-gray-200' : ''
                } ${index >= 2 ? 'md:mt-0 mt-8 border-gray-200 md:border-t-0' : ''} ${index > 0 ? 'md:border-l md:border-gray-200' : ''
                }`}
              variants={itemVariants}
            >
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-semibold text-wc-blue-600 wc-stat-number">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-xl sm:text-2xl font-semibold text-wc-blue-600">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;

