export const formatCurrency = (amount: number): string => {
    return `GHS ${amount.toFixed(2)}`;
};

export const calculateSecurityLevel = (features: string[]): string => {
    const highSecurityFeatures = ['CCTV', 'Security Personnel', 'Gated Compound'];
    const moderateSecurityFeatures = ['Metal Doors', 'Fenced Compound'];
    
    const highCount = features.filter(feature => highSecurityFeatures.includes(feature)).length;
    const moderateCount = features.filter(feature => moderateSecurityFeatures.includes(feature)).length;

    if (highCount > 0) {
        return 'High';
    } else if (moderateCount > 0) {
        return 'Moderate';
    } else {
        return 'Low';
    }
};

export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+233[0-9]{9}$/; // Ghana phone number format
    return phoneRegex.test(phone);
};

export const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
};