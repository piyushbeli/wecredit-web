export type LoanFeatureIconName = 'zap' | 'coins' | 'calendar';

export type LoanFeatureAccent = 'blue' | 'gold';

export interface LoanFeatureItem {
  title: string;
  description: string;
  icon: LoanFeatureIconName;
}

export interface LoanFeatureHighlightsProps {
  features?: readonly LoanFeatureItem[];
  accent?: LoanFeatureAccent;
}
