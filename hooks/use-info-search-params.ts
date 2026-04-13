import { useSearchParams } from "next/navigation";

export const useInfoSearchParams = () => {
  const searchParams = useSearchParams();
  const affiliateCode = searchParams.get('partner') ?? '';
  const originSubLender = searchParams.get('originSubLender');
  const lenderUniqueId = searchParams.get('lenderUniqueId');
  const isAffiliate = affiliateCode?.length > 0;
  return { isAffiliate, affiliateCode, originSubLender, lenderUniqueId };
};