'use client';

import type { ReactNode } from 'react';
import type { CreditReportAccount } from '@/types/credit-report';
import { formatInrAmount } from '@/lib/utils/credit-report-formatters';
import {
  formatAccountLimitLabel,
  getAccountSanctionedAmount,
  getAccountStatusTone,
} from '@/lib/utils/credit-report-flow';

interface AccountDetailsListProps {
  readonly accounts: readonly CreditReportAccount[];
}

function formatStatusLabel(status: CreditReportAccount['status']): string {
  if (status === 'ACTIVE') {
    return 'Active';
  }
  if (status === 'OVERDUE') {
    return 'Overdue';
  }
  return 'Closed';
}

/**
 * Full-report accounts — mobile cards; desktop table.
 */
export function AccountDetailsList({ accounts }: AccountDetailsListProps): ReactNode {
  let mobileList: ReactNode;
  let desktopTable: ReactNode;

  if (accounts.length === 0) {
    mobileList = <p className="mt-3 text-sm text-gray-500">No accounts found on this report.</p>;
    desktopTable = mobileList;
  } else {
    mobileList = (
      <ul className="mt-3 min-w-0 max-w-full space-y-3 lg:hidden">
        {accounts.map((account) => {
          const statusTone = getAccountStatusTone(account.status);
          const subtitle = formatAccountLimitLabel({
            accountType: account.accountType,
            creditLimit: account.creditLimit,
            sanctionedAmount: account.sanctionedAmount,
            formatAmount: formatInrAmount,
          });
          return (
            <li
              key={account.id}
              className="min-w-0 max-w-full rounded-xl border border-black/[0.06] bg-white px-4 py-3.5"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <p className="min-w-0 break-words text-sm font-bold text-[#1F2937] [overflow-wrap:anywhere]">
                  {account.lenderName}
                </p>
                <p className={`shrink-0 text-xs font-semibold uppercase ${statusTone.textClassName}`}>
                  • {account.status}
                </p>
              </div>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="min-w-0 break-words text-xs leading-5 text-gray-500 [overflow-wrap:anywhere]">
                  {subtitle}
                </p>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">o/s</p>
                  <p className="text-sm font-bold text-[#1F2937]">
                    {formatInrAmount(account.outstandingAmount)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );

    desktopTable = (
      <div className="mt-4 hidden min-w-0 max-w-full overflow-x-auto lg:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E7ECF3] text-[11px] font-medium uppercase tracking-wide text-gray-400">
              <th className="pb-3 pr-4 font-medium">Lender</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Sanctioned</th>
              <th className="pb-3 pr-4 font-medium">Outstanding</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const statusTone = getAccountStatusTone(account.status);
              const sanctioned = getAccountSanctionedAmount(account);
              let sanctionedLabel = '—';
              if (sanctioned !== undefined) {
                sanctionedLabel = formatInrAmount(sanctioned);
              }
              return (
                <tr key={account.id} className="border-b border-[#F0F3F7] last:border-b-0">
                  <td className="break-words py-3.5 pr-4 text-sm font-semibold text-[#1F2937] [overflow-wrap:anywhere]">
                    {account.lenderName}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-gray-500">{account.accountType}</td>
                  <td className="py-3.5 pr-4 text-sm text-[#1F2937]">{sanctionedLabel}</td>
                  <td className="py-3.5 pr-4 text-sm font-semibold text-[#1F2937]">
                    {formatInrAmount(account.outstandingAmount)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusTone.textClassName}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                      {formatStatusLabel(account.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="min-w-0 max-w-full">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8B1E2D]">
        Account details
      </h2>
      {mobileList}
      {desktopTable}
    </section>
  );
}
