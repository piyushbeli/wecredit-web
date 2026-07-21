'use client';

import type { ReactNode } from 'react';
import type { CreditReportConsumer } from '@/types/credit-report';
import { formatConsumerDateOfBirth } from '@/lib/utils/credit-report-flow';

interface ConsumerInformationProps {
  readonly consumer: CreditReportConsumer;
}

interface ConsumerRow {
  readonly label: string;
  readonly value: string;
}

/**
 * Full-report consumer demographics — stacked on mobile, 2-col grid on desktop.
 */
export function ConsumerInformation({ consumer }: ConsumerInformationProps): ReactNode {
  const rows: ConsumerRow[] = [
    { label: 'Name', value: consumer.name },
    { label: 'PAN', value: consumer.pan },
    { label: 'Date of birth', value: formatConsumerDateOfBirth(consumer.dateOfBirth) },
    { label: 'Mobile', value: consumer.mobile },
  ];
  if (consumer.email) {
    rows.push({ label: 'Email', value: consumer.email });
  }
  if (consumer.address) {
    rows.push({ label: 'Address', value: consumer.address });
  }

  return (
    <section className="min-w-0 max-w-full">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8B1E2D]">
        Consumer information
      </h2>
      <dl className="mt-4 grid min-w-0 max-w-full grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0 max-w-full">
            <div className="flex min-w-0 items-start justify-between gap-4 sm:hidden">
              <dt className="shrink-0 text-sm text-gray-400">{row.label}</dt>
              <dd className="min-w-0 max-w-full break-words text-right text-sm font-semibold text-[#1F2937] [overflow-wrap:anywhere]">
                {row.value}
              </dd>
            </div>
            <div className="hidden min-w-0 max-w-full sm:block">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                {row.label}
              </dt>
              <dd className="mt-1 min-w-0 max-w-full break-words text-sm font-semibold text-[#1F2937] [overflow-wrap:anywhere]">
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
