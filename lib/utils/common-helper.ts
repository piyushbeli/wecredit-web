/** Same rule as phone step: 10 digits starting with 6–9 (India mobile). */
export const isValidMobile = (mobile: string | null): mobile is string => {
    if (!mobile) return false;
    const trimmed = mobile.trim();
    return /^[6-9]\d{9}$/.test(trimmed);
};

export const parseAmountToNumber = (amount: string | number | undefined): number => {
    if (!amount) return 0;

    const value = String(amount).toLowerCase().trim();

    // Handle lakh / lakhs
    if (value.includes('lakh')) {
        const numeric = parseFloat(value.replace(/[^\d.]/g, ''));
        return isNaN(numeric) ? 0 : numeric * 100000;
    }

    // Handle normal numbers like 50000 or ₹1,20,000
    const numeric = parseFloat(value.replace(/[^\d.]/g, ''));
    return isNaN(numeric) ? 0 : numeric;
};


export const mapingLenderNameToLenderCode = (lenderName: string): string => {
    switch (lenderName) {
        case 'lnt':
            return 'L&T';
        case 'upswing_lnt':
            return 'Upswing L&T';
        case 'upswing_dmi':
            return 'DMI';
        default:
            return lenderName;
    }
};

export const isUpswingRedirectAllowed = (lenderName: string): boolean => {
    return lenderName.toLowerCase() === 'lnt' || lenderName.toLowerCase() === 'upswing_lnt' || lenderName.toLowerCase() === 'upswing_dmi';
};