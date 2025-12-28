// src/lib/checkout.ts - Checkout Helper Functions
import { prisma } from "./prisma";
import { sendOrderConfirmation } from "./email";
import { incrementCouponUsage } from "./coupons";

export interface CheckoutData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress?: {
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
  };
  paymentMethod: string;
  couponId?: string;
  userId?: string;
}

export async function createOrder(data: CheckoutData) {
  try {
    // Generate unique order number
    const orderNumber = `MPZ-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        shipping: data.shipping,
        discount: data.discount,
        total: data.total,
        couponId: data.couponId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create shipping address if provided and user is logged in
    if (data.shippingAddress && data.userId) {
      await prisma.address.create({
        data: {
          userId: data.userId,
          name: data.shippingAddress.name,
          street: data.shippingAddress.street,
          number: data.shippingAddress.number,
          complement: data.shippingAddress.complement,
          neighborhood: data.shippingAddress.neighborhood,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          zipCode: data.shippingAddress.zipCode,
          phone: data.shippingAddress.phone,
        },
      });
    }

    // Increment coupon usage if applied
    if (data.couponId) {
      await incrementCouponUsage(data.couponId);
    }

    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        email: data.customerEmail,
        name: data.customerName,
        orderNumber,
        total: data.total,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } catch (emailError) {
      console.error("Error sending order confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Erro ao criar pedido");
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  transactionId?: string
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus as any,
        ...(transactionId && { notes: `Transaction ID: ${transactionId}` }),
        ...(paymentStatus === "PAID" && { status: "CONFIRMED" }),
      },
    });

    return { success: true, order };
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Erro ao atualizar status do pagamento");
  }
}

export async function calculateShipping(
  zipCode: string,
  items: Array<{ weight?: number; quantity: number }>
) {
  // Simple shipping calculation
  // In production, integrate with Correios API or other shipping provider
  
  const totalWeight = items.reduce(
    (sum, item) => sum + (item.weight || 0.5) * item.quantity,
    0
  );

  // Base shipping rate
  let shippingCost = 15.0;

  // Add weight-based cost
  if (totalWeight > 1) {
    shippingCost += (totalWeight - 1) * 5;
  }

  // Free shipping for orders over R$ 150
  const FREE_SHIPPING_THRESHOLD = 150;

  return {
    cost: shippingCost,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    estimatedDays: 7,
  };
}

export function validateCheckoutData(data: CheckoutData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length < 3) {
    errors.push("Nome completo é obrigatório (mínimo 3 caracteres)");
  }

  if (!data.customerEmail || !isValidEmail(data.customerEmail)) {
    errors.push("Email válido é obrigatório");
  }

  if (!data.items || data.items.length === 0) {
    errors.push("Carrinho vazio");
  }

  if (data.total <= 0) {
    errors.push("Total do pedido inválido");
  }

  if (!data.paymentMethod) {
    errors.push("Método de pagamento é obrigatório");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
