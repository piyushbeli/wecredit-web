'use client';

import { Check, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { CreditReportPaymentHistoryItem } from '@/types/credit-report';
import { getPaymentStatusTone } from '@/lib/utils/credit-report-flow';

interface PaymentHistoryGridProps {
  readonly paymentHistory: readonly CreditReportPaymentHistoryItem[];
}

/**
 * 12-month payment history — mobile colour tiles; desktop labelled icons.
 */
export function PaymentHistoryGrid({
  paymentHistory,
}: PaymentHistoryGridProps): ReactNode {
  const legendItems = [
    { key: 'on-time', label: 'On time', className: 'bg-[#1FAF5A]' },
    { key: 'delayed', label: 'Delayed', className: 'bg-[#F09A2E]' },
  ] as const;

  let content: ReactNode;
  if (paymentHistory.length === 0) {
    content = <p className="mt-3 text-sm text-gray-500">No payment history available.</p>;
  } else {
    content = (
      <>
        <div className="mt-3 grid grid-cols-6 gap-2 lg:hidden">
          {paymentHistory.map((item, index) => {
            const tone = getPaymentStatusTone(item.status);
            return (
              <div
                key={`mobile-${item.month}-${index}`}
                title={`${item.month}: ${tone.label}`}
                className={`h-8 rounded-md ${tone.cellClassName}`}
                aria-label={`${item.month} ${tone.label}`}
              />
            );
          })}
        </div>
        <div className="mt-4 hidden lg:flex lg:flex-wrap lg:gap-3">
          {paymentHistory.map((item, index) => {
            const tone = getPaymentStatusTone(item.status);
            let icon: ReactNode = null;
            if (item.status === 'ON_TIME') {
              icon = <Check className="h-4 w-4 text-white" strokeWidth={3} aria-hidden />;
            } else if (item.status === 'DELAYED' || item.status === 'MISSED') {
              icon = <AlertTriangle className="h-3.5 w-3.5 text-white" aria-hidden />;
            }
            return (
              <div
                key={`desktop-${item.month}-${index}`}
                className="flex w-12 flex-col items-center gap-1.5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${tone.cellClassName}`}
                  aria-label={`${item.month} ${tone.label}`}
                >
                  {icon}
                </div>
                <span className="text-[11px] text-gray-400">{item.month}</span>
              </div>
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-4">
          {legendItems.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8B1E2D]">
        <span className="lg:hidden">Payment history · 12 mo</span>
        <span className="hidden lg:inline">Payment history · Last 12 months</span>
      </h2>
      {content}
    </section>
  );
}
