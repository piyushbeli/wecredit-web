'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, type PanInfo } from 'framer-motion';
import { ShieldCheck, QrCode, UsersRound } from 'lucide-react';
import { IMAGES } from '@/lib/constants/images';

interface StandaloneAuthLayoutProps {
  children: React.ReactNode;
}

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'RBI Registered',
    description: 'Lending Partners',
  },
  {
    icon: QrCode,
    title: '100% Digital',
    description: 'Paperless Process',
  },
  {
    icon: UsersRound,
    title: 'Trusted by Thousands',
    description: 'Across India',
  },
];

const testimonials = [
  {
    quote:
      'I needed urgent cash for a medical expense, and WeCredit approved my loan within minutes. The process was smooth and completely hassle-free.',
    name: 'Rohit Sharma',
    description: 'Salary Account Holder, Mumbai',
  },
  {
    quote:
      'I compared personal loan offers in one place and found an option that matched my monthly budget without any paperwork.',
    name: 'Priya Mehta',
    description: 'Marketing Manager, Pune',
  },
  {
    quote:
      'The login and approval journey was simple. I could continue my loan application without visiting a branch.',
    name: 'Amit Verma',
    description: 'Business Owner, Delhi',
  },
];

const SWIPE_THRESHOLD = 50;

const StandaloneAuthLayout = ({ children }: StandaloneAuthLayoutProps): React.ReactNode => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const goToTestimonial = useCallback((index: number): void => {
    const nextIndex = (index + testimonials.length) % testimonials.length;
    setActiveTestimonial(nextIndex);
  }, []);

  useEffect(() => {
    if (isCarouselPaused) return undefined;

    const timer = window.setInterval(() => {
      goToTestimonial(activeTestimonial + 1);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [activeTestimonial, goToTestimonial, isCarouselPaused]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      goToTestimonial(activeTestimonial + 1);
      return;
    }

    if (info.offset.x >= SWIPE_THRESHOLD) {
      goToTestimonial(activeTestimonial - 1);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f5f6f8] pt-16 text-[#20242b]">
      <main className="grid h-[calc(100vh-4rem)] w-full overflow-hidden bg-white md:grid-cols-[42vw_1fr]">
        <aside className="flex min-h-0 items-center justify-center overflow-hidden bg-brand-primary px-8 py-8 text-white sm:px-14 md:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[480px]">
            <h1 className="text-[34px] font-bold leading-[1.32] sm:text-[44px] md:text-[38px] lg:text-[46px] xl:text-[50px]">
              Get Instant
              <br />
              Personal Loans
              <br />
              Simple. Secure.
              <br />
              Transparent.
            </h1>

            <div className="mt-9 space-y-5 md:mt-8 lg:mt-10">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold leading-tight">{item.title}</span>
                      <span className="mt-0.5 block text-xs leading-tight text-white/80">{item.description}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-12 overflow-hidden rounded-2xl shadow-[0_18px_35px_rgba(0,0,0,0.15)] md:mt-10 lg:mt-14"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                animate={{ x: `-${activeTestimonial * 100}%` }}
                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={handleDragEnd}
              >
                {testimonials.map((testimonial) => (
                  <article
                    key={testimonial.name}
                    className="min-w-full bg-[#0a4fb4] p-6 sm:p-7 md:p-5 lg:p-7"
                  >
                    <p className="text-[15px] leading-7 text-white sm:text-lg sm:leading-8 md:text-sm md:leading-6 lg:text-base lg:leading-7">
                      {testimonial.quote}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <Image
                        src={IMAGES.DIRECT_CONTACT_EXPERTS.LAKASH}
                        alt={testimonial.name}
                        width={58}
                        height={58}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        draggable={false}
                      />
                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-tight md:text-base lg:text-lg">
                          {testimonial.name}
                        </p>
                        <p className="mt-1 text-xs leading-tight text-white/75 md:text-[11px] lg:text-sm">
                          {testimonial.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    activeTestimonial === index ? 'bg-white' : 'bg-white/45'
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 items-center justify-center overflow-hidden px-5 py-8 md:px-10 xl:px-16">
          {children}
        </section>
      </main>
    </div>
  );
};

export default StandaloneAuthLayout;
