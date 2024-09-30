
export interface Country {
    code: string;
    dial_code: string;
    name: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
}

export const africanCountries: Country[] = [
    { code: 'EG', dial_code: '+20', name: 'Egypt', currency: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' } },
    { code: 'KE', dial_code: '+254', name: 'Kenya', currency: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' } },
    { code: 'ZA', dial_code: '+27', name: 'South Africa', currency: { code: 'ZAR', name: 'South African Rand', symbol: 'R' } },
    { code: 'GH', dial_code: '+233', name: 'Ghana', currency: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' } },
    { code: 'TZ', dial_code: '+255', name: 'Tanzania', currency: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' } },
    { code: 'MA', dial_code: '+212', name: 'Morocco', currency: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' } },
    { code: 'SN', dial_code: '+221', name: 'Senegal', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' } },
    { code: 'CI', dial_code: '+225', name: 'Côte d\'Ivoire', currency: { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' } },
    { code: 'UG', dial_code: '+256', name: 'Uganda', currency: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' } },
    { code: 'ZM', dial_code: '+260', name: 'Zambia', currency: { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' } },
];


export function getCountryCodeByCurrency(currencyCode: string): string | undefined {
    const country = africanCountries.find(c => c.currency.code.toLowerCase() === currencyCode.toLowerCase());
    return country?.code;
}


export function getCurrencyByCountryCode(countryCode: string): Country['currency'] | undefined {
    const country = africanCountries.find(c => c.code === countryCode);
    return country?.currency;
}

export function formatCurrency(amount: number, currencyOrCountryCode: string): string {
    let currency: Country['currency'] | undefined;

    // first let's check if it's a country code
    currency = getCurrencyByCountryCode(currencyOrCountryCode);

    // If not found, let's assume it's a currency code
    if (!currency) {
        currency = africanCountries.find(c => c.currency.code === currencyOrCountryCode)?.currency;
    }

    if (!currency) return `${amount}`;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}