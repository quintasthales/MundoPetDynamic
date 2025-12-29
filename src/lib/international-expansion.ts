// International Expansion and Multi-Currency System

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nativeName: string;
  currency: string;
  languages: string[];
  timezone: string;
  phoneCode: string;
  flag: string;
  enabled: boolean;
  shippingAvailable: boolean;
  paymentMethods: string[];
  taxRate: number;
  customsInfo?: CustomsInfo;
}

export interface CustomsInfo {
  dutyRate: number; // percentage
  vatRate: number; // percentage
  threshold: number; // value below which no duty is charged
  requiredDocuments: string[];
  restrictions: string[];
}

export interface Currency {
  code: string; // ISO 4217
  name: string;
  symbol: string;
  exchangeRate: number; // relative to BRL
  decimals: number;
  format: string; // e.g., "$1,234.56" or "1.234,56 €"
}

export interface Language {
  code: string; // ISO 639-1
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  enabled: boolean;
  completeness: number; // percentage of translations
}

export interface Translation {
  key: string;
  language: string;
  value: string;
  context?: string;
  pluralForms?: Record<string, string>;
}

export interface InternationalShipping {
  id: string;
  name: string;
  carrier: string;
  originCountry: string;
  destinationCountry: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  cost: {
    base: number;
    perKg: number;
    currency: string;
  };
  tracking: boolean;
  insurance: boolean;
  customsClearance: boolean;
  maxWeight: number; // kg
  maxDimensions: {
    length: number;
    width: number;
    height: number;
  };
  restrictions: string[];
}

export interface TaxConfiguration {
  country: string;
  type: "vat" | "gst" | "sales_tax" | "none";
  rate: number;
  includeInPrice: boolean;
  displaySeparately: boolean;
  exemptions: {
    category?: string[];
    amount?: number;
  };
}

export interface LocalizationSettings {
  country: string;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  numberFormat: {
    decimalSeparator: string;
    thousandsSeparator: string;
  };
  addressFormat: string[];
  phoneFormat: string;
}

// Supported Countries
export function getSupportedCountries(): Country[] {
  return [
    {
      code: "BR",
      name: "Brazil",
      nativeName: "Brasil",
      currency: "BRL",
      languages: ["pt"],
      timezone: "America/Sao_Paulo",
      phoneCode: "+55",
      flag: "🇧🇷",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "pix", "boleto"],
      taxRate: 10,
    },
    {
      code: "US",
      name: "United States",
      nativeName: "United States",
      currency: "USD",
      languages: ["en"],
      timezone: "America/New_York",
      phoneCode: "+1",
      flag: "🇺🇸",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 8.5,
      customsInfo: {
        dutyRate: 5,
        vatRate: 0,
        threshold: 800,
        requiredDocuments: ["commercial_invoice", "packing_list"],
        restrictions: ["food", "plants"],
      },
    },
    {
      code: "GB",
      name: "United Kingdom",
      nativeName: "United Kingdom",
      currency: "GBP",
      languages: ["en"],
      timezone: "Europe/London",
      phoneCode: "+44",
      flag: "🇬🇧",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 20,
      customsInfo: {
        dutyRate: 2.5,
        vatRate: 20,
        threshold: 135,
        requiredDocuments: ["commercial_invoice", "certificate_of_origin"],
        restrictions: [],
      },
    },
    {
      code: "DE",
      name: "Germany",
      nativeName: "Deutschland",
      currency: "EUR",
      languages: ["de"],
      timezone: "Europe/Berlin",
      phoneCode: "+49",
      flag: "🇩🇪",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal", "sofort"],
      taxRate: 19,
      customsInfo: {
        dutyRate: 3.5,
        vatRate: 19,
        threshold: 150,
        requiredDocuments: ["commercial_invoice"],
        restrictions: [],
      },
    },
    {
      code: "FR",
      name: "France",
      nativeName: "France",
      currency: "EUR",
      languages: ["fr"],
      timezone: "Europe/Paris",
      phoneCode: "+33",
      flag: "🇫🇷",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 20,
    },
    {
      code: "ES",
      name: "Spain",
      nativeName: "España",
      currency: "EUR",
      languages: ["es"],
      timezone: "Europe/Madrid",
      phoneCode: "+34",
      flag: "🇪🇸",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 21,
    },
    {
      code: "IT",
      name: "Italy",
      nativeName: "Italia",
      currency: "EUR",
      languages: ["it"],
      timezone: "Europe/Rome",
      phoneCode: "+39",
      flag: "🇮🇹",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 22,
    },
    {
      code: "CA",
      name: "Canada",
      nativeName: "Canada",
      currency: "CAD",
      languages: ["en", "fr"],
      timezone: "America/Toronto",
      phoneCode: "+1",
      flag: "🇨🇦",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 13,
    },
    {
      code: "AU",
      name: "Australia",
      nativeName: "Australia",
      currency: "AUD",
      languages: ["en"],
      timezone: "Australia/Sydney",
      phoneCode: "+61",
      flag: "🇦🇺",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "paypal"],
      taxRate: 10,
    },
    {
      code: "MX",
      name: "Mexico",
      nativeName: "México",
      currency: "MXN",
      languages: ["es"],
      timezone: "America/Mexico_City",
      phoneCode: "+52",
      flag: "🇲🇽",
      enabled: true,
      shippingAvailable: true,
      paymentMethods: ["credit_card", "debit_card", "oxxo"],
      taxRate: 16,
    },
  ];
}

// Supported Currencies
export function getSupportedCurrencies(): Currency[] {
  return [
    {
      code: "BRL",
      name: "Brazilian Real",
      symbol: "R$",
      exchangeRate: 1.0,
      decimals: 2,
      format: "R$ 1.234,56",
    },
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      exchangeRate: 0.20,
      decimals: 2,
      format: "$1,234.56",
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      exchangeRate: 0.18,
      decimals: 2,
      format: "1.234,56 €",
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      exchangeRate: 0.16,
      decimals: 2,
      format: "£1,234.56",
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      exchangeRate: 0.27,
      decimals: 2,
      format: "C$1,234.56",
    },
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
      exchangeRate: 0.31,
      decimals: 2,
      format: "A$1,234.56",
    },
    {
      code: "MXN",
      name: "Mexican Peso",
      symbol: "MX$",
      exchangeRate: 3.50,
      decimals: 2,
      format: "MX$1,234.56",
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      exchangeRate: 29.5,
      decimals: 0,
      format: "¥1,235",
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      symbol: "¥",
      exchangeRate: 1.45,
      decimals: 2,
      format: "¥1,234.56",
    },
  ];
}

// Supported Languages
export function getSupportedLanguages(): Language[] {
  return [
    {
      code: "pt",
      name: "Portuguese",
      nativeName: "Português",
      direction: "ltr",
      enabled: true,
      completeness: 100,
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      direction: "ltr",
      enabled: true,
      completeness: 100,
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      direction: "ltr",
      enabled: true,
      completeness: 95,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      direction: "ltr",
      enabled: true,
      completeness: 90,
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      direction: "ltr",
      enabled: true,
      completeness: 88,
    },
    {
      code: "it",
      name: "Italian",
      nativeName: "Italiano",
      direction: "ltr",
      enabled: true,
      completeness: 85,
    },
    {
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      direction: "ltr",
      enabled: true,
      completeness: 75,
    },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      direction: "ltr",
      enabled: true,
      completeness: 70,
    },
  ];
}

// Currency Converter
export class CurrencyConverter {
  private rates: Map<string, number> = new Map();
  
  constructor() {
    getSupportedCurrencies().forEach((currency) => {
      this.rates.set(currency.code, currency.exchangeRate);
    });
  }
  
  convert(amount: number, from: string, to: string): number {
    const fromRate = this.rates.get(from) || 1;
    const toRate = this.rates.get(to) || 1;
    
    // Convert to BRL first, then to target currency
    const brlAmount = amount / fromRate;
    return brlAmount * toRate;
  }
  
  format(amount: number, currency: string): string {
    const currencyInfo = getSupportedCurrencies().find((c) => c.code === currency);
    if (!currencyInfo) return `${amount}`;
    
    const formatted = amount.toFixed(currencyInfo.decimals);
    
    // Simple formatting based on currency format
    if (currencyInfo.format.includes(",")) {
      const [integer, decimal] = formatted.split(".");
      const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${currencyInfo.symbol} ${formattedInteger}${decimal ? "," + decimal : ""}`;
    } else {
      const formattedAmount = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${currencyInfo.symbol}${formattedAmount}`;
    }
  }
}

// International Shipping Calculator
export class InternationalShippingCalculator {
  calculateShipping(
    originCountry: string,
    destinationCountry: string,
    weight: number, // kg
    value: number,
    currency: string
  ): {
    cost: number;
    estimatedDays: { min: number; max: number };
    duties: number;
    taxes: number;
    total: number;
  } {
    const country = getSupportedCountries().find((c) => c.code === destinationCountry);
    if (!country) throw new Error("Country not supported");
    
    // Base shipping cost
    let shippingCost = 50; // Base
    shippingCost += weight * 15; // Per kg
    
    // International premium
    if (originCountry !== destinationCountry) {
      shippingCost *= 2.5;
    }
    
    // Calculate duties and taxes
    let duties = 0;
    let taxes = 0;
    
    if (country.customsInfo) {
      if (value > country.customsInfo.threshold) {
        duties = value * (country.customsInfo.dutyRate / 100);
        taxes = (value + duties) * (country.customsInfo.vatRate / 100);
      }
    }
    
    return {
      cost: shippingCost,
      estimatedDays: { min: 10, max: 20 },
      duties,
      taxes,
      total: shippingCost + duties + taxes,
    };
  }
}

// Localization Manager
export class LocalizationManager {
  private translations: Map<string, Map<string, string>> = new Map();
  
  addTranslation(key: string, language: string, value: string): void {
    if (!this.translations.has(key)) {
      this.translations.set(key, new Map());
    }
    this.translations.get(key)!.set(language, value);
  }
  
  translate(key: string, language: string, fallback: string = key): string {
    const translations = this.translations.get(key);
    if (!translations) return fallback;
    
    return translations.get(language) || translations.get("en") || fallback;
  }
  
  getLocalizationSettings(countryCode: string): LocalizationSettings {
    const country = getSupportedCountries().find((c) => c.code === countryCode);
    if (!country) throw new Error("Country not supported");
    
    return {
      country: country.code,
      language: country.languages[0],
      currency: country.currency,
      timezone: country.timezone,
      dateFormat: countryCode === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY",
      timeFormat: countryCode === "US" ? "12h" : "24h",
      numberFormat: {
        decimalSeparator: countryCode === "US" ? "." : ",",
        thousandsSeparator: countryCode === "US" ? "," : ".",
      },
      addressFormat: this.getAddressFormat(countryCode),
      phoneFormat: country.phoneCode,
    };
  }
  
  private getAddressFormat(countryCode: string): string[] {
    const formats: Record<string, string[]> = {
      BR: ["street", "number", "complement", "neighborhood", "city", "state", "zipCode"],
      US: ["street", "city", "state", "zipCode"],
      GB: ["street", "city", "postcode"],
      DE: ["street", "zipCode", "city"],
    };
    
    return formats[countryCode] || formats["US"];
  }
}

// International Analytics
export interface InternationalAnalytics {
  totalCountries: number;
  activeCountries: number;
  revenueByCountry: {
    country: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  revenueByC urrency: {
    currency: string;
    revenue: number;
    percentage: number;
  }[];
  topMarkets: {
    country: string;
    growth: number; // percentage
    potential: "high" | "medium" | "low";
  }[];
  shippingMetrics: {
    avgDeliveryTime: number;
    onTimeRate: number;
    customsDelays: number;
  };
  localizationCoverage: {
    language: string;
    completeness: number;
    usage: number; // percentage of users
  }[];
}

export function getInternationalAnalytics(): InternationalAnalytics {
  return {
    totalCountries: 10,
    activeCountries: 10,
    revenueByCountry: [
      {
        country: "BR",
        revenue: 45000000,
        orders: 285000,
        customers: 125000,
      },
      {
        country: "US",
        revenue: 12500000,
        orders: 48500,
        customers: 28500,
      },
      {
        country: "GB",
        revenue: 5850000,
        orders: 28500,
        customers: 15500,
      },
      {
        country: "DE",
        revenue: 4250000,
        orders: 22500,
        customers: 12500,
      },
      {
        country: "FR",
        revenue: 3850000,
        orders: 19500,
        customers: 10500,
      },
    ],
    revenueByC urrency: [
      { currency: "BRL", revenue: 45000000, percentage: 63.2 },
      { currency: "USD", revenue: 12500000, percentage: 17.5 },
      { currency: "EUR", revenue: 10850000, percentage: 15.2 },
      { currency: "GBP", revenue: 2850000, percentage: 4.0 },
    ],
    topMarkets: [
      { country: "US", growth: 125, potential: "high" },
      { country: "GB", growth: 95, potential: "high" },
      { country: "CA", growth: 85, potential: "medium" },
      { country: "AU", growth: 75, potential: "medium" },
      { country: "MX", growth: 185, potential: "high" },
    ],
    shippingMetrics: {
      avgDeliveryTime: 14,
      onTimeRate: 92.5,
      customsDelays: 5.5,
    },
    localizationCoverage: [
      { language: "pt", completeness: 100, usage: 65 },
      { language: "en", completeness: 100, usage: 25 },
      { language: "es", completeness: 95, usage: 6 },
      { language: "fr", completeness: 90, usage: 2 },
      { language: "de", completeness: 88, usage: 2 },
    ],
  };
}

// Regional Pricing
export interface RegionalPricing {
  productId: string;
  basePriceB RL: number;
  regionalPrices: {
    country: string;
    price: number;
    currency: string;
    adjustmentReason: string;
  }[];
}

export function calculateRegionalPricing(
  productId: string,
  basePriceBRL: number
): RegionalPricing {
  const converter = new CurrencyConverter();
  const countries = getSupportedCountries();
  
  const regionalPrices = countries.map((country) => {
    let price = converter.convert(basePriceBRL, "BRL", country.currency);
    let adjustmentReason = "Standard conversion";
    
    // Apply regional adjustments
    if (country.code === "US") {
      price *= 1.15; // 15% markup for US market
      adjustmentReason = "Market premium + shipping";
    } else if (country.code === "GB") {
      price *= 1.20; // 20% markup for UK
      adjustmentReason = "VAT + shipping + market premium";
    } else if (["DE", "FR", "IT", "ES"].includes(country.code)) {
      price *= 1.18; // 18% markup for EU
      adjustmentReason = "VAT + shipping";
    }
    
    // Round to psychological pricing
    price = Math.round(price * 100) / 100;
    
    return {
      country: country.code,
      price,
      currency: country.currency,
      adjustmentReason,
    };
  });
  
  return {
    productId,
    basePriceBRL,
    regionalPrices,
  };
}

// Market Entry Strategy
export interface MarketEntryStrategy {
  country: string;
  priority: "high" | "medium" | "low";
  marketSize: number; // USD
  competition: "low" | "medium" | "high";
  entryBarriers: string[];
  opportunities: string[];
  recommendedActions: string[];
  estimatedInvestment: number;
  projectedRevenue: {
    year1: number;
    year2: number;
    year3: number;
  };
}

export function getMarketEntryStrategies(): MarketEntryStrategy[] {
  return [
    {
      country: "US",
      priority: "high",
      marketSize: 850000000,
      competition: "high",
      entryBarriers: ["High shipping costs", "Customs regulations", "Local competition"],
      opportunities: [
        "Large wellness market",
        "High purchasing power",
        "Growing aromatherapy trend",
      ],
      recommendedActions: [
        "Partner with US fulfillment center",
        "Obtain FDA compliance",
        "Launch targeted Facebook/Instagram ads",
        "Collaborate with wellness influencers",
      ],
      estimatedInvestment: 250000,
      projectedRevenue: {
        year1: 5000000,
        year2: 12500000,
        year3: 25000000,
      },
    },
    {
      country: "MX",
      priority: "high",
      marketSize: 125000000,
      competition: "low",
      entryBarriers: ["Language", "Payment methods"],
      opportunities: [
        "Growing middle class",
        "Low competition",
        "Cultural affinity with Brazil",
        "MERCOSUR benefits",
      ],
      recommendedActions: [
        "Full Spanish localization",
        "Accept OXXO payments",
        "Partner with local influencers",
        "Offer free shipping promotions",
      ],
      estimatedInvestment: 75000,
      projectedRevenue: {
        year1: 2500000,
        year2: 6500000,
        year3: 12000000,
      },
    },
  ];
}
