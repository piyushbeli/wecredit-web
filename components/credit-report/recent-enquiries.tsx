'use client';

import type { ReactNode } from 'react';
import type { CreditReportEnquiry } from '@/types/credit-report';
import { formatReportGeneratedDateDesktop } from '@/lib/utils/credit-report-flow';

interface RecentEnquiriesProps {
  readonly enquiries: readonly CreditReportEnquiry[];
}

/**
 * Recent credit enquiries list (desktop-forward; also fine on mobile).
 */
export function RecentEnquiries({ enquiries }: RecentEnquiriesProps): ReactNode {
  let content: ReactNode;
  if (enquiries.length === 0) {
    content = <p className="mt-3 text-sm text-gray-500">No recent enquiries found.</p>;
  } else {
    content = (
      <ul className="mt-3 divide-y divide-[#F0F3F7]">
        {enquiries.map((enquiry) => (
          <li
            key={enquiry.id}
            className="flex items-center justify-between gap-4 py-3.5 first:pt-1"
          >
            <p className="min-w-0 text-sm text-[#1F2937]">
              <span className="font-semibold">{enquiry.lenderName}</span>
              <span className="text-gray-400"> · {enquiry.enquiryType}</span>
            </p>
            <p className="shrink-0 text-sm text-gray-400">
              {formatReportGeneratedDateDesktop(enquiry.enquiredAt)}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8B1E2D]">
        Recent enquiries
      </h2>
      {content}
    </section>
  );
}
