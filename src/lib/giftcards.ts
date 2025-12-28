// Gift Cards and Vouchers System

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  purchasedBy?: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  usedBy?: string[];
}

export interface GiftCardTemplate {
  id: string;
  name: string;
  value: number;
  image: string;
  description: string;
  popular?: boolean;
}

export const giftCardTemplates: GiftCardTemplate[] = [
  {
    id: "gc-50",
    name: "Vale Presente R$ 50",
    value: 50,
    image: "/images/giftcard-50.jpg",
    description: "Perfeito para pequenos mimos",
  },
  {
    id: "gc-100",
    name: "Vale Presente R$ 100",
    value: 100,
    image: "/images/giftcard-100.jpg",
    description: "Ideal para presentear",
    popular: true,
  },
  {
    id: "gc-150",
    name: "Vale Presente R$ 150",
    value: 150,
    image: "/images/giftcard-150.jpg",
    description: "Ótimo para compras completas",
    popular: true,
  },
  {
    id: "gc-200",
    name: "Vale Presente R$ 200",
    value: 200,
    image: "/images/giftcard-200.jpg",
    description: "Para quem ama pets",
  },
  {
    id: "gc-300",
    name: "Vale Presente R$ 300",
    value: 300,
    image: "/images/giftcard-300.jpg",
    description: "Presente especial",
  },
  {
    id: "gc-500",
    name: "Vale Presente R$ 500",
    value: 500,
    image: "/images/giftcard-500.jpg",
    description: "Presente premium",
  },
];

export function generateGiftCardCode(): string {
  const prefix = "MPZEN";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const checksum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `${prefix}-${random}-${checksum}`;
}

export function validateGiftCardCode(code: string): boolean {
  // Basic format validation
  const pattern = /^MPZEN-[A-Z0-9]{8}-\d{2}$/;
  return pattern.test(code);
}

export async function checkGiftCardBalance(
  code: string
): Promise<{ valid: boolean; balance: number; expiresAt: Date | null }> {
  // In production, this would query the database
  // Mock implementation
  if (!validateGiftCardCode(code)) {
    return { valid: false, balance: 0, expiresAt: null };
  }

  // Mock balance check
  return {
    valid: true,
    balance: 100,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  };
}

export async function applyGiftCard(
  code: string,
  orderTotal: number
): Promise<{
  success: boolean;
  discount: number;
  remainingBalance: number;
  message: string;
}> {
  const cardInfo = await checkGiftCardBalance(code);

  if (!cardInfo.valid) {
    return {
      success: false,
      discount: 0,
      remainingBalance: 0,
      message: "Código de vale presente inválido",
    };
  }

  if (cardInfo.balance === 0) {
    return {
      success: false,
      discount: 0,
      remainingBalance: 0,
      message: "Este vale presente já foi totalmente utilizado",
    };
  }

  if (cardInfo.expiresAt && cardInfo.expiresAt < new Date()) {
    return {
      success: false,
      discount: 0,
      remainingBalance: 0,
      message: "Este vale presente expirou",
    };
  }

  const discount = Math.min(cardInfo.balance, orderTotal);
  const remainingBalance = cardInfo.balance - discount;

  return {
    success: true,
    discount,
    remainingBalance,
    message: `Vale presente aplicado! Desconto de R$ ${discount.toFixed(2)}`,
  };
}

export async function createGiftCard(data: {
  value: number;
  purchasedBy: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}): Promise<GiftCard> {
  const code = generateGiftCardCode();
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Expires in 1 year

  const giftCard: GiftCard = {
    id: `gc-${Date.now()}`,
    code,
    value: data.value,
    balance: data.value,
    isActive: true,
    expiresAt,
    createdAt: new Date(),
    purchasedBy: data.purchasedBy,
    recipientEmail: data.recipientEmail,
    recipientName: data.recipientName,
    message: data.message,
    usedBy: [],
  };

  // In production, save to database and send email

  return giftCard;
}

export function formatGiftCardCode(code: string): string {
  // Format: MPZEN-XXXXXXXX-XX
  return code.replace(/(.{5})(.{8})(.{2})/, "$1-$2-$3");
}

export interface GiftCardTransaction {
  id: string;
  giftCardId: string;
  amount: number;
  type: "purchase" | "redemption" | "refund";
  orderId?: string;
  date: Date;
}

export function calculateGiftCardFees(value: number): {
  subtotal: number;
  processingFee: number;
  total: number;
} {
  const processingFee = 0; // No fees for gift cards
  return {
    subtotal: value,
    processingFee,
    total: value,
  };
}
