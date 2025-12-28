// src/lib/coupons.ts - Coupon/Discount System
import { prisma } from './prisma';

export interface CouponValidation {
  valid: boolean;
  message: string;
  discount?: number;
  couponId?: string;
}

// Validate and apply coupon
export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<CouponValidation> {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Cupom inválido',
      };
    }

    // Check if coupon is active
    if (!coupon.active) {
      return {
        valid: false,
        message: 'Este cupom não está mais ativo',
      };
    }

    // Check date validity
    const now = new Date();
    if (now < coupon.validFrom) {
      return {
        valid: false,
        message: 'Este cupom ainda não está válido',
      };
    }

    if (now > coupon.validUntil) {
      return {
        valid: false,
        message: 'Este cupom expirou',
      };
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return {
        valid: false,
        message: 'Este cupom atingiu o limite de uso',
      };
    }

    // Check minimum purchase
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Valor mínimo de compra: R$ ${coupon.minPurchase.toFixed(2)}`,
      };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (cartTotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);

    return {
      valid: true,
      message: `Cupom aplicado! Desconto de R$ ${discount.toFixed(2)}`,
      discount,
      couponId: coupon.id,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      message: 'Erro ao validar cupom',
    };
  }
}

// Increment coupon usage
export async function incrementCouponUsage(couponId: string) {
  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
  }
}

// Create a new coupon (admin function)
export async function createCoupon(data: {
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  validFrom: Date;
  validUntil: Date;
}) {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        value: data.value,
        minPurchase: data.minPurchase,
        maxUses: data.maxUses,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
      },
    });

    return coupon;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
}

// Get all active coupons (admin function)
export async function getAllCoupons() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return coupons;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

// Deactivate coupon (admin function)
export async function deactivateCoupon(couponId: string) {
  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: {
        active: false,
      },
    });
  } catch (error) {
    console.error('Error deactivating coupon:', error);
    throw error;
  }
}

// Sample coupons for testing (can be seeded to database)
export const sampleCoupons = [
  {
    code: 'BEMVINDO10',
    description: 'Desconto de 10% para novos clientes',
    type: 'PERCENTAGE' as const,
    value: 10,
    minPurchase: 50,
    maxUses: 100,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
  },
  {
    code: 'FRETEGRATIS',
    description: 'Frete grátis em compras acima de R$ 100',
    type: 'FIXED' as const,
    value: 15,
    minPurchase: 100,
    maxUses: 500,
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2025-12-31'),
  },
  {
    code: 'BLACKFRIDAY',
    description: 'Black Friday - 25% de desconto',
    type: 'PERCENTAGE' as const,
    value: 25,
    minPurchase: 0,
    maxUses: 1000,
    validFrom: new Date('2024-11-20'),
    validUntil: new Date('2024-11-30'),
  },
];
