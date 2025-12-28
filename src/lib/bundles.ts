// Product Bundles and Kits

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  image: string;
  category: string;
  featured: boolean;
}

export const productBundles: ProductBundle[] = [
  {
    id: "kit-bem-estar-pet",
    name: "Kit Bem-Estar Pet Completo",
    description:
      "Tudo que seu pet precisa para uma vida saudável e feliz. Inclui difusor aromático, coleira anti-pulgas e shampoo premium.",
    products: [
      { productId: "difusor-aromatico", quantity: 1 },
      { productId: "coleira-anti-pulgas", quantity: 1 },
      { productId: "shampoo-premium", quantity: 1 },
    ],
    originalPrice: 389.7,
    bundlePrice: 299.9,
    discount: 23,
    image: "/images/kit-bem-estar.jpg",
    category: "Cuidados",
    featured: true,
  },
  {
    id: "kit-higiene-completa",
    name: "Kit Higiene Completa",
    description:
      "Mantenha seu pet sempre limpo e cheiroso com este kit completo de higiene.",
    products: [
      { productId: "shampoo-premium", quantity: 2 },
      { productId: "escova-pelos", quantity: 1 },
      { productId: "toalha-microfibra", quantity: 1 },
    ],
    originalPrice: 249.7,
    bundlePrice: 189.9,
    discount: 24,
    image: "/images/kit-higiene.jpg",
    category: "Higiene",
    featured: true,
  },
  {
    id: "kit-passeio",
    name: "Kit Passeio Seguro",
    description:
      "Tudo para passeios seguros e confortáveis com seu melhor amigo.",
    products: [
      { productId: "coleira-anti-pulgas", quantity: 1 },
      { productId: "guia-reforçada", quantity: 1 },
      { productId: "peitoral-acolchoado", quantity: 1 },
    ],
    originalPrice: 279.7,
    bundlePrice: 219.9,
    discount: 21,
    image: "/images/kit-passeio.jpg",
    category: "Acessórios",
    featured: false,
  },
  {
    id: "kit-filhote",
    name: "Kit Filhote Iniciante",
    description:
      "Tudo que você precisa para receber seu novo filhote em casa.",
    products: [
      { productId: "caminha-confort", quantity: 1 },
      { productId: "comedouro-duplo", quantity: 1 },
      { productId: "brinquedo-mordedor", quantity: 2 },
    ],
    originalPrice: 319.6,
    bundlePrice: 249.9,
    discount: 22,
    image: "/images/kit-filhote.jpg",
    category: "Iniciante",
    featured: true,
  },
];

export function calculateBundleSavings(bundle: ProductBundle): {
  savings: number;
  savingsPercentage: number;
} {
  const savings = bundle.originalPrice - bundle.bundlePrice;
  const savingsPercentage = (savings / bundle.originalPrice) * 100;

  return {
    savings,
    savingsPercentage: Math.round(savingsPercentage),
  };
}

export function getBundleById(id: string): ProductBundle | undefined {
  return productBundles.find((bundle) => bundle.id === id);
}

export function getFeaturedBundles(): ProductBundle[] {
  return productBundles.filter((bundle) => bundle.featured);
}

export function getBundlesByCategory(category: string): ProductBundle[] {
  return productBundles.filter((bundle) => bundle.category === category);
}

// Subscription Plans

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  productId: string;
  interval: "weekly" | "monthly" | "quarterly";
  intervalCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  benefits: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "sub-racao-mensal",
    name: "Ração Premium - Assinatura Mensal",
    description: "Receba ração premium todo mês na sua porta",
    productId: "racao-premium-15kg",
    interval: "monthly",
    intervalCount: 1,
    price: 189.9,
    originalPrice: 219.9,
    discount: 14,
    benefits: [
      "Entrega automática todo mês",
      "14% de desconto",
      "Frete grátis",
      "Cancele quando quiser",
    ],
  },
  {
    id: "sub-petiscos-semanal",
    name: "Petiscos Naturais - Assinatura Semanal",
    description: "Petiscos frescos toda semana para seu pet",
    productId: "petiscos-naturais",
    interval: "weekly",
    intervalCount: 1,
    price: 39.9,
    originalPrice: 49.9,
    discount: 20,
    benefits: [
      "Entrega semanal",
      "20% de desconto",
      "Variedade de sabores",
      "Sem compromisso",
    ],
  },
  {
    id: "sub-higiene-trimestral",
    name: "Kit Higiene - Assinatura Trimestral",
    description: "Kit completo de higiene a cada 3 meses",
    productId: "kit-higiene-completa",
    interval: "quarterly",
    intervalCount: 1,
    price: 169.9,
    originalPrice: 189.9,
    discount: 11,
    benefits: [
      "Entrega a cada 3 meses",
      "11% de desconto",
      "Produtos sempre novos",
      "Frete grátis",
    ],
  },
];

export function getSubscriptionById(id: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === id);
}

export function calculateSubscriptionSavings(
  plan: SubscriptionPlan,
  months: number = 12
): {
  totalSavings: number;
  totalCost: number;
  regularCost: number;
} {
  const deliveriesPerYear =
    plan.interval === "weekly"
      ? 52
      : plan.interval === "monthly"
      ? 12
      : 4;

  const deliveries = Math.floor((months / 12) * deliveriesPerYear);
  const totalCost = plan.price * deliveries;
  const regularCost = plan.originalPrice * deliveries;
  const totalSavings = regularCost - totalCost;

  return {
    totalSavings,
    totalCost,
    regularCost,
  };
}
