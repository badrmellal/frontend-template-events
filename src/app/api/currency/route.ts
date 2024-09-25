
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
    { code: 'NG', dial_code: '+234', name: 'Nigeria', currency: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' } },
    { code: 'KE', dial_code: '+254', name: 'Kenya', currency: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' } },
    { code: 'ZA', dial_code: '+27', name: 'South Africa', currency: { code: 'ZAR', name: 'South African Rand', symbol: 'R' } },
    { code: 'GH', dial_code: '+233', name: 'Ghana', currency: { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' } },
    { code: 'ET', dial_code: '+251', name: 'Ethiopia', currency: { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' } },
    { code: 'TZ', dial_code: '+255', name: 'Tanzania', currency: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' } },
    { code: 'MA', dial_code: '+212', name: 'Morocco', currency: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' } },
    { code: 'DZ', dial_code: '+213', name: 'Algeria', currency: { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' } },
    { code: 'TN', dial_code: '+216', name: 'Tunisia', currency: { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' } },
    { code: 'MR', dial_code: '+222', name: 'Mauritania', currency: { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' } },
    { code: 'SN', dial_code: '+221', name: 'Senegal', currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'CFA' } },
    { code: 'CG', dial_code: '+242', name: 'Congo', currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'FCFA' } },
    { code: 'CM', dial_code: '+237', name: 'Cameroon', currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'FCFA' } },
    { code: 'CI', dial_code: '+225', name: 'Côte d\'Ivoire', currency: { code: 'XOF', name: 'West African CFA franc', symbol: 'CFA' } },
    { code: 'GA', dial_code: '+241', name: 'Gabon', currency: { code: 'XAF', name: 'Central African CFA franc', symbol: 'FCFA' } },
    { code: 'ZW', dial_code: '+263', name: 'Zimbabwe', currency: { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$' } },
];

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