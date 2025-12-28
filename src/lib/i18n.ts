// Internationalization and Multi-Currency System

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to BRL
  locale: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// Supported currencies
export const currencies: Currency[] = [
  {
    code: "BRL",
    symbol: "R$",
    name: "Real Brasileiro",
    exchangeRate: 1.0,
    locale: "pt-BR",
  },
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    exchangeRate: 0.2, // 1 BRL = 0.20 USD (approximate)
    locale: "en-US",
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    exchangeRate: 0.18, // 1 BRL = 0.18 EUR (approximate)
    locale: "de-DE",
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    exchangeRate: 0.16, // 1 BRL = 0.16 GBP (approximate)
    locale: "en-GB",
  },
  {
    code: "ARS",
    symbol: "$",
    name: "Peso Argentino",
    exchangeRate: 80.0, // 1 BRL = 80 ARS (approximate)
    locale: "es-AR",
  },
];

// Supported languages
export const languages: Language[] = [
  {
    code: "pt-BR",
    name: "Portuguese (Brazil)",
    nativeName: "Português (Brasil)",
    flag: "🇧🇷",
  },
  {
    code: "en-US",
    name: "English (US)",
    nativeName: "English (US)",
    flag: "🇺🇸",
  },
  {
    code: "es-ES",
    name: "Spanish (Spain)",
    nativeName: "Español (España)",
    flag: "🇪🇸",
  },
  {
    code: "es-AR",
    name: "Spanish (Argentina)",
    nativeName: "Español (Argentina)",
    flag: "🇦🇷",
  },
];

// Get currency by code
export function getCurrency(code: string): Currency | undefined {
  return currencies.find((c) => c.code === code);
}

// Get language by code
export function getLanguage(code: string): Language | undefined {
  return languages.find((l) => l.code === code);
}

// Convert price between currencies
export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const from = getCurrency(fromCurrency);
  const to = getCurrency(toCurrency);

  if (!from || !to) return amount;

  // Convert to BRL first, then to target currency
  const inBRL = amount / from.exchangeRate;
  return inBRL * to.exchangeRate;
}

// Format price with currency
export function formatPrice(
  amount: number,
  currencyCode: string = "BRL"
): string {
  const currency = getCurrency(currencyCode);
  if (!currency) return amount.toFixed(2);

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

// Detect user's preferred currency based on location
export function detectCurrency(countryCode?: string): string {
  const currencyMap: Record<string, string> = {
    BR: "BRL",
    US: "USD",
    GB: "GBP",
    AR: "ARS",
    ES: "EUR",
    DE: "EUR",
    FR: "EUR",
    IT: "EUR",
  };

  return countryCode ? currencyMap[countryCode] || "BRL" : "BRL";
}

// Detect user's preferred language
export function detectLanguage(
  browserLanguage?: string,
  countryCode?: string
): string {
  if (browserLanguage) {
    const lang = browserLanguage.split("-")[0];
    const languageMap: Record<string, string> = {
      pt: "pt-BR",
      en: "en-US",
      es: countryCode === "AR" ? "es-AR" : "es-ES",
    };
    return languageMap[lang] || "pt-BR";
  }

  return "pt-BR";
}

// Translation keys
export interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

export const translations: Translations = {
  // Navigation
  "nav.home": {
    "pt-BR": "Início",
    "en-US": "Home",
    "es-ES": "Inicio",
    "es-AR": "Inicio",
  },
  "nav.products": {
    "pt-BR": "Produtos",
    "en-US": "Products",
    "es-ES": "Productos",
    "es-AR": "Productos",
  },
  "nav.cart": {
    "pt-BR": "Carrinho",
    "en-US": "Cart",
    "es-ES": "Carrito",
    "es-AR": "Carrito",
  },
  "nav.account": {
    "pt-BR": "Minha Conta",
    "en-US": "My Account",
    "es-ES": "Mi Cuenta",
    "es-AR": "Mi Cuenta",
  },

  // Product
  "product.addToCart": {
    "pt-BR": "Adicionar ao Carrinho",
    "en-US": "Add to Cart",
    "es-ES": "Añadir al Carrito",
    "es-AR": "Agregar al Carrito",
  },
  "product.buyNow": {
    "pt-BR": "Comprar Agora",
    "en-US": "Buy Now",
    "es-ES": "Comprar Ahora",
    "es-AR": "Comprar Ahora",
  },
  "product.outOfStock": {
    "pt-BR": "Fora de Estoque",
    "en-US": "Out of Stock",
    "es-ES": "Agotado",
    "es-AR": "Agotado",
  },
  "product.inStock": {
    "pt-BR": "Em Estoque",
    "en-US": "In Stock",
    "es-ES": "En Stock",
    "es-AR": "En Stock",
  },

  // Cart
  "cart.title": {
    "pt-BR": "Carrinho de Compras",
    "en-US": "Shopping Cart",
    "es-ES": "Carrito de Compras",
    "es-AR": "Carrito de Compras",
  },
  "cart.empty": {
    "pt-BR": "Seu carrinho está vazio",
    "en-US": "Your cart is empty",
    "es-ES": "Tu carrito está vacío",
    "es-AR": "Tu carrito está vacío",
  },
  "cart.subtotal": {
    "pt-BR": "Subtotal",
    "en-US": "Subtotal",
    "es-ES": "Subtotal",
    "es-AR": "Subtotal",
  },
  "cart.shipping": {
    "pt-BR": "Frete",
    "en-US": "Shipping",
    "es-ES": "Envío",
    "es-AR": "Envío",
  },
  "cart.total": {
    "pt-BR": "Total",
    "en-US": "Total",
    "es-ES": "Total",
    "es-AR": "Total",
  },

  // Checkout
  "checkout.title": {
    "pt-BR": "Finalizar Compra",
    "en-US": "Checkout",
    "es-ES": "Finalizar Compra",
    "es-AR": "Finalizar Compra",
  },
  "checkout.placeOrder": {
    "pt-BR": "Finalizar Pedido",
    "en-US": "Place Order",
    "es-ES": "Realizar Pedido",
    "es-AR": "Realizar Pedido",
  },

  // Common
  "common.search": {
    "pt-BR": "Buscar",
    "en-US": "Search",
    "es-ES": "Buscar",
    "es-AR": "Buscar",
  },
  "common.loading": {
    "pt-BR": "Carregando...",
    "en-US": "Loading...",
    "es-ES": "Cargando...",
    "es-AR": "Cargando...",
  },
  "common.save": {
    "pt-BR": "Salvar",
    "en-US": "Save",
    "es-ES": "Guardar",
    "es-AR": "Guardar",
  },
  "common.cancel": {
    "pt-BR": "Cancelar",
    "en-US": "Cancel",
    "es-ES": "Cancelar",
    "es-AR": "Cancelar",
  },
  "common.continue": {
    "pt-BR": "Continuar",
    "en-US": "Continue",
    "es-ES": "Continuar",
    "es-AR": "Continuar",
  },
};

// Get translation
export function t(key: string, lang: string = "pt-BR"): string {
  return translations[key]?.[lang] || key;
}

// Format date according to locale
export function formatDate(date: Date, lang: string = "pt-BR"): string {
  const language = getLanguage(lang);
  if (!language) return date.toLocaleDateString();

  return new Intl.DateTimeFormat(language.code, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Format number according to locale
export function formatNumber(
  num: number,
  lang: string = "pt-BR",
  decimals: number = 0
): string {
  const language = getLanguage(lang);
  if (!language) return num.toFixed(decimals);

  return new Intl.NumberFormat(language.code, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Get shipping zones and costs
export interface ShippingZone {
  code: string;
  name: string;
  countries: string[];
  baseCost: number; // in BRL
  estimatedDays: string;
}

export const shippingZones: ShippingZone[] = [
  {
    code: "BR",
    name: "Brasil",
    countries: ["BR"],
    baseCost: 15.0,
    estimatedDays: "3-7 dias úteis",
  },
  {
    code: "LATAM",
    name: "América Latina",
    countries: ["AR", "CL", "UY", "PY", "BO", "PE", "CO", "VE"],
    baseCost: 45.0,
    estimatedDays: "10-20 dias úteis",
  },
  {
    code: "NA",
    name: "América do Norte",
    countries: ["US", "CA", "MX"],
    baseCost: 65.0,
    estimatedDays: "15-30 dias úteis",
  },
  {
    code: "EU",
    name: "Europa",
    countries: ["GB", "DE", "FR", "IT", "ES", "PT"],
    baseCost: 75.0,
    estimatedDays: "20-35 dias úteis",
  },
];

export function getShippingZone(countryCode: string): ShippingZone | undefined {
  return shippingZones.find((zone) => zone.countries.includes(countryCode));
}

export function calculateShipping(
  countryCode: string,
  cartTotal: number,
  currency: string = "BRL"
): {
  cost: number;
  estimatedDays: string;
  freeShippingEligible: boolean;
} {
  const zone = getShippingZone(countryCode);
  if (!zone) {
    return {
      cost: 0,
      estimatedDays: "N/A",
      freeShippingEligible: false,
    };
  }

  // Free shipping for orders over R$ 200 in Brazil
  const freeShippingThreshold = 200;
  const freeShippingEligible =
    countryCode === "BR" && cartTotal >= freeShippingThreshold;

  let cost = freeShippingEligible ? 0 : zone.baseCost;

  // Convert to target currency if needed
  if (currency !== "BRL") {
    cost = convertPrice(cost, "BRL", currency);
  }

  return {
    cost,
    estimatedDays: zone.estimatedDays,
    freeShippingEligible,
  };
}

// Tax calculation by country
export function calculateTax(
  amount: number,
  countryCode: string
): {
  taxRate: number;
  taxAmount: number;
  total: number;
} {
  const taxRates: Record<string, number> = {
    BR: 0, // Already included in price
    US: 0.08, // Average state tax
    GB: 0.2, // VAT
    DE: 0.19, // VAT
    AR: 0.21, // IVA
  };

  const taxRate = taxRates[countryCode] || 0;
  const taxAmount = amount * taxRate;

  return {
    taxRate,
    taxAmount,
    total: amount + taxAmount,
  };
}
