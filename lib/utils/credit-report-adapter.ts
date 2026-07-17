import type {
  BureauReportApiResponse,
  BureauReportData,
  CreditReportAccount,
  CreditReportDashboard,
  CreditReportData,
  CreditReportEnquiry,
  CreditReportPaymentHistoryItem,
  CreditScoreInfo,
  CreditSummaryItem,
  ScoreFactorItem,
} from '@/types/credit-report';
import creditReportDashboardMock from '@/mocks/credit-report.json';

const FALLBACK = '—';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function safeArray<T>(value: readonly T[] | null | undefined): readonly T[] {
  return Array.isArray(value) ? value : [];
}

function safePercentage(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
}

function maskPan(value: unknown): string {
  const pan = optionalText(value);
  if (!pan || pan.length < 4) return FALLBACK;
  return `${pan.slice(0, 2)}${'*'.repeat(Math.max(0, pan.length - 4))}${pan.slice(-2)}`;
}

function maskMobile(value: unknown): string {
  const digits = optionalText(value)?.replace(/\D/g, '') ?? '';
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length !== 10) return FALLBACK;
  return `+91 ${local.slice(0, 2)}****${local.slice(-4)}`;
}

function parseCreditScore(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getBureauResponseRecord(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) {
    return null;
  }
  if (isRecord(value.data) && 'creditScore' in value.data) {
    return value;
  }
  if (isRecord(value.data) && typeof value.data.success === 'boolean') {
    return value.data;
  }
  if (isRecord(value.data) && isRecord(value.data.data) && 'creditScore' in value.data.data) {
    return {
      success: value.success,
      message: value.message,
      pdfUrl: value.data.pdfUrl ?? value.pdfUrl,
      data: value.data.data,
    };
  }
  return value;
}

function normalizeResponse(value: unknown): BureauReportApiResponse {
  const record = getBureauResponseRecord(value);
  if (!record) throw new Error('Invalid bureau report response');
  if (record.success !== true) {
    throw new Error(optionalText(record.message) ?? 'Bureau report request failed');
  }
  if (!isRecord(record.data)) throw new Error('Bureau report data is missing');
  if (parseCreditScore(record.data.creditScore) === null) throw new Error('Credit score is missing');
  return record as unknown as BureauReportApiResponse;
}

function buildFactors(data: BureauReportData): readonly ScoreFactorItem[] {
  const breakdown = data.creditHealthBreakdown ?? {};
  return [
    ['PAYMENT_HISTORY', 'Payment history', breakdown.paymentHistory],
    ['CREDIT_UTILIZATION', 'Credit utilization', breakdown.creditUtilization],
    ['CREDIT_AGE', 'Credit age', breakdown.creditAge],
    ['RECENT_ENQUIRIES', 'Recent enquiries', breakdown.creditEnquiries],
    ['CREDIT_MIX', 'Credit mix', breakdown.creditMix],
  ].map(([key, label, value]) => {
    const factor = isRecord(value) ? value : {};
    return {
      key: String(key),
      label: optionalText(factor.category) ?? String(label),
      rating: getFactorRating(factor.rating),
      displayValue: optionalText(factor.rating) ?? optionalText(factor.description) ?? FALLBACK,
      progress: safePercentage(factor.percentage),
    };
  });
}

function buildSummary(data: BureauReportData): readonly CreditSummaryItem[] {
  const summary = data.creditSummary ?? {};
  return [
    { key: 'ACTIVE_ACCOUNTS', label: 'Active accounts', value: safeNumber(summary.activeAccounts), valueType: 'NUMBER' },
    { key: 'TOTAL_ACCOUNTS', label: 'Total accounts', value: safeNumber(summary.totalAccounts), valueType: 'NUMBER' },
    { key: 'ON_TIME_PAYMENTS', label: 'On-time payments', value: safePercentage(summary.onTimePaymentsPercentage), valueType: 'PERCENTAGE', highlight: true },
    { key: 'TOTAL_ENQUIRIES', label: 'Total enquiries', value: safeNumber(summary.totalEnquiries), valueType: 'NUMBER' },
    { key: 'TOTAL_CREDIT_LIMIT', label: 'Total credit limit', value: safeNumber(summary.totalCreditLimit), valueType: 'CURRENCY_COMPACT', currency: 'INR' },
  ];
}

export function adaptBureauReport(value: unknown): { dashboard: CreditReportDashboard; report: CreditReportData } {
  const response = normalizeResponse(value);
  const data = response.data as BureauReportData;
  const consumer = data.consumer ?? {};
  const accounts: CreditReportAccount[] = safeArray(data.accounts).map((account, index) => ({
    id: `account-${index}`, lenderName: optionalText(account.lender) ?? FALLBACK,
    accountType: optionalText(account.type) ?? FALLBACK,
    sanctionedAmount: optionalNumber(account.sanctioned),
    outstandingAmount: safeNumber(account.outstanding),
    status: normalizeAccountStatus(account.status),
  }));
  const paymentHistory: CreditReportPaymentHistoryItem[] = safeArray(data.paymentHistory12Months).map((item) => ({
    month: optionalText(item.key) ?? FALLBACK,
    daysPastDue: typeof item.DaysPastDue === 'number' || typeof item.DaysPastDue === 'string' ? item.DaysPastDue : FALLBACK,
    status: getPaymentStatus(item.DaysPastDue),
  }));
  const enquiries: CreditReportEnquiry[] = safeArray(data.recentEnquiries).map((item, index) => ({
    id: `enquiry-${index}`, lenderName: optionalText(item.lender) ?? optionalText(item.enquiryInstitution) ?? FALLBACK,
    enquiryType: optionalText(item.type) ?? optionalText(item.enquiryPurpose) ?? FALLBACK,
    enquiredAt: optionalText(item.date) ?? optionalText(item.enquiryDate) ?? '', enquiryTime: optionalText(item.enquiryTime) ?? FALLBACK,
    amount: typeof item.enquiryAmount === 'number' && Number.isFinite(item.enquiryAmount) ? item.enquiryAmount : null,
  }));
  const score = parseCreditScore(data.creditScore) ?? 0;
  const scoreTrend = buildScoreTrend(data.scoreTrend);
  const monthlyChange = scoreTrend?.points ?? 0;
  let changeType: CreditScoreInfo['changeType'] = 'UNCHANGED';
  if (monthlyChange > 0) {
    changeType = 'INCREASED';
  } else if (monthlyChange < 0) {
    changeType = 'DECREASED';
  }
  const dashboardTemplate = creditReportDashboardMock as CreditReportDashboard;
  const loanOffer = dashboardTemplate.loanOffer;
  const improvementTips = dashboardTemplate.improvementTips;
  const visibility = {
    ...dashboardTemplate.visibility,
    showLoanOffer: dashboardTemplate.visibility.showLoanOffer,
    showImprovementTips: dashboardTemplate.visibility.showImprovementTips,
  };
  return {
    dashboard: {
      user: { firstName: optionalText(consumer.name)?.split(/\s+/)[0] ?? 'there' },
      creditScore: {
        ...dashboardTemplate.creditScore,
        score,
        rating: '',
        monthlyChange,
        changeType,
        lastUpdatedAt: '',
        scoreTrend,
      },
      loanOffer,
      fullCreditReport: dashboardTemplate.fullCreditReport,
      scoreFactors: buildFactors(data),
      creditSummary: buildSummary(data),
      improvementTips,
      visibility,
    },
    report: {
      reportId: '',
      generatedAt: '',
      pdfUrl: optionalText(response.pdfUrl), bureau: 'EQUIFAX',
      score: { value: score, min: 300, max: 900, category: '', riskLabel: '', change: 0 },
      consumer: { name: optionalText(consumer.name) ?? FALLBACK, pan: maskPan(consumer.pan), dateOfBirth: optionalText(consumer.dob) ?? '', mobile: maskMobile(consumer.mobile), email: optionalText(consumer.email) ?? undefined, address: optionalText(consumer.address) ?? undefined },
      accounts, paymentHistory, enquiries,
    },
  };
}

function buildScoreTrend(
  value: BureauReportData['scoreTrend']
): CreditScoreInfo['scoreTrend'] {
  if (!isRecord(value)) {
    return null;
  }
  const points = Number(value.points);
  const message = optionalText(value.message) ?? '';
  return {
    points: Number.isFinite(points) ? points : 0,
    message,
  };
}

function getPaymentStatus(value: unknown): CreditReportPaymentHistoryItem['status'] {
  if (value === 0 || value === '0') return 'ON_TIME';
  const daysPastDue = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(daysPastDue) && daysPastDue > 0 && daysPastDue !== 900) return 'DELAYED';
  return 'NO_DATA';
}

function getFactorRating(value: unknown): ScoreFactorItem['rating'] {
  const rating = optionalText(value)?.toUpperCase();
  if (rating === 'EXCELLENT' || rating === 'GOOD' || rating === 'FAIR' || rating === 'POOR' || rating === 'LOW') {
    return rating;
  }
  return 'NEUTRAL';
}

export function isUsableBureauReportResponse(value: unknown): boolean {
  try {
    normalizeResponse(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeAccountStatus(value: unknown): CreditReportAccount['status'] {
  const status = optionalText(value)?.toUpperCase();
  if (status === 'ACTIVE' || status === 'OVERDUE') return status;
  return 'CLOSED';
}
