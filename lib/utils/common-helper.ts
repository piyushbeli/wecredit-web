/** Same rule as phone step: 10 digits starting with 6–9 (India mobile). */
export const isValidMobile = (mobile: string | null): mobile is string => {
    if (!mobile) return false;
    const trimmed = mobile.trim();
    return /^[6-9]\d{9}$/.test(trimmed);
};