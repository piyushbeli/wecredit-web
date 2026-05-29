'use client';

import type { ReactNode } from 'react';
import { FooterLinkPageWrapper } from './footer-link-page-wrapper';

type CalculatorPageWrapperProps = {
  children: ReactNode;
};

/** Calculator footer link page — no banner, shared mobile webview layout */
const CalculatorPageWrapper = ({
  children,
}: CalculatorPageWrapperProps): ReactNode => {
  return (
    <FooterLinkPageWrapper contentClassName="px-4">{children}</FooterLinkPageWrapper>
  );
};

export default CalculatorPageWrapper;
