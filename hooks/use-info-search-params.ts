'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface InfoSearchParams {
  readonly isAffiliate: boolean;
  readonly affiliateCode: string;
  readonly originSubLender: string | null;
  readonly lenderUniqueId: string | null;
}

const EMPTY_INFO_SEARCH_PARAMS: InfoSearchParams = {
  isAffiliate: false,
  affiliateCode: '',
  originSubLender: null,
  lenderUniqueId: null,
};

/**
 * Reads affiliate query params from the URL on the client.
 * Avoids `useSearchParams()` so callers (e.g. PageHeader) do not need Suspense
 * for static prerender / CSR bailout.
 */
export const useInfoSearchParams = (): InfoSearchParams => {
  const pathname = usePathname();
  const [params, setParams] = useState<InfoSearchParams>(EMPTY_INFO_SEARCH_PARAMS);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const affiliateCode = searchParams.get('partner') ?? '';
    setParams({
      isAffiliate: affiliateCode.length > 0,
      affiliateCode,
      originSubLender: searchParams.get('originSubLender'),
      lenderUniqueId: searchParams.get('lenderUniqueId'),
    });
  }, [pathname]);

  return params;
};
