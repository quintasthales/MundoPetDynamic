// Abandoned Cart Recovery System

export interface AbandonedCart {
  id: string;
  userId?: string;
  email: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  abandonedAt: Date;
  remindersSent: number;
  lastReminderAt?: Date;
  recovered: boolean;
  recoveredAt?: Date;
  recoveryOrderId?: string;
  incentive?: {
    type: "discount" | "free_shipping";
    value: number;
    code: string;
  };
}

export interface RecoveryEmail {
  id: string;
  cartId: string;
  type: "first_reminder" | "second_reminder" | "final_reminder";
  sentAt: Date;
  opened: boolean;
  clicked: boolean;
  converted: boolean;
}

// Time delays for recovery emails (in hours)
export const RECOVERY_EMAIL_DELAYS = {
  first: 1, // 1 hour after abandonment
  second: 24, // 24 hours after abandonment
  final: 72, // 72 hours after abandonment
};

// Detect abandoned cart
export function detectAbandonedCart(
  userId: string | undefined,
  email: string,
  cartItems: any[]
): AbandonedCart | null {
  if (cartItems.length === 0) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const abandonedCart: AbandonedCart = {
    id: `cart-${Date.now()}`,
    userId,
    email,
    items: cartItems.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    })),
    total,
    abandonedAt: new Date(),
    remindersSent: 0,
    recovered: false,
  };

  // In production, save to database
  return abandonedCart;
}

// Generate recovery incentive
export function generateRecoveryIncentive(
  cart: AbandonedCart,
  reminderNumber: number
): AbandonedCart["incentive"] {
  // Increase incentive with each reminder
  if (reminderNumber === 1) {
    // First reminder: 10% discount
    return {
      type: "discount",
      value: 10,
      code: `RECOVER10-${cart.id.slice(-6)}`,
    };
  } else if (reminderNumber === 2) {
    // Second reminder: 15% discount
    return {
      type: "discount",
      value: 15,
      code: `RECOVER15-${cart.id.slice(-6)}`,
    };
  } else {
    // Final reminder: 20% discount + free shipping
    return {
      type: "discount",
      value: 20,
      code: `RECOVER20-${cart.id.slice(-6)}`,
    };
  }
}

// Send recovery email
export async function sendRecoveryEmail(
  cart: AbandonedCart,
  type: RecoveryEmail["type"]
): Promise<RecoveryEmail> {
  const incentive = generateRecoveryIncentive(
    cart,
    cart.remindersSent + 1
  );

  const email: RecoveryEmail = {
    id: `email-${Date.now()}`,
    cartId: cart.id,
    type,
    sentAt: new Date(),
    opened: false,
    clicked: false,
    converted: false,
  };

  // Email content based on type
  const emailContent = getEmailContent(cart, type, incentive);

  // In production, send actual email using email service
  console.log(`Sending ${type} to ${cart.email}:`, emailContent);

  // Update cart
  cart.remindersSent++;
  cart.lastReminderAt = new Date();
  cart.incentive = incentive;

  // In production, save to database

  return email;
}

// Get email content
function getEmailContent(
  cart: AbandonedCart,
  type: RecoveryEmail["type"],
  incentive: AbandonedCart["incentive"]
): {
  subject: string;
  body: string;
} {
  const baseUrl = "https://mundopetzen.com.br";

  switch (type) {
    case "first_reminder":
      return {
        subject: "Você esqueceu algo no carrinho! 🛒",
        body: `
          <h2>Olá!</h2>
          <p>Notamos que você deixou alguns itens no carrinho:</p>
          <ul>
            ${cart.items
              .map(
                (item) =>
                  `<li>${item.productName} - ${item.quantity}x R$ ${item.price.toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          <p><strong>Total: R$ ${cart.total.toFixed(2)}</strong></p>
          ${
            incentive
              ? `<p>🎁 Use o cupom <strong>${incentive.code}</strong> para ganhar ${incentive.value}% de desconto!</p>`
              : ""
          }
          <a href="${baseUrl}/carrinho?recover=${cart.id}">Finalizar Compra</a>
        `,
      };

    case "second_reminder":
      return {
        subject: "Última chance! Seu carrinho está esperando 💝",
        body: `
          <h2>Seus produtos ainda estão reservados!</h2>
          <p>Não perca a oportunidade de levar:</p>
          <ul>
            ${cart.items
              .map(
                (item) =>
                  `<li>${item.productName} - ${item.quantity}x R$ ${item.price.toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          ${
            incentive
              ? `<p>🎉 OFERTA ESPECIAL: ${incentive.value}% OFF com o cupom <strong>${incentive.code}</strong>!</p>`
              : ""
          }
          <a href="${baseUrl}/carrinho?recover=${cart.id}">Aproveitar Agora</a>
        `,
      };

    case "final_reminder":
      return {
        subject: "⏰ ÚLTIMA OPORTUNIDADE - 20% OFF + Frete Grátis!",
        body: `
          <h2>Esta é sua última chance!</h2>
          <p>Seus itens serão liberados em breve:</p>
          <ul>
            ${cart.items
              .map(
                (item) =>
                  `<li>${item.productName} - ${item.quantity}x R$ ${item.price.toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          ${
            incentive
              ? `<p>🔥 OFERTA FINAL: ${incentive.value}% OFF + FRETE GRÁTIS com o cupom <strong>${incentive.code}</strong>!</p>`
              : ""
          }
          <p>Esta oferta expira em 24 horas!</p>
          <a href="${baseUrl}/carrinho?recover=${cart.id}">Finalizar Agora</a>
        `,
      };
  }
}

// Check if cart should receive reminder
export function shouldSendReminder(cart: AbandonedCart): {
  shouldSend: boolean;
  type?: RecoveryEmail["type"];
} {
  if (cart.recovered) {
    return { shouldSend: false };
  }

  const hoursSinceAbandonment =
    (Date.now() - cart.abandonedAt.getTime()) / (1000 * 60 * 60);

  if (cart.remindersSent === 0 && hoursSinceAbandonment >= RECOVERY_EMAIL_DELAYS.first) {
    return { shouldSend: true, type: "first_reminder" };
  }

  if (cart.remindersSent === 1 && hoursSinceAbandonment >= RECOVERY_EMAIL_DELAYS.second) {
    return { shouldSend: true, type: "second_reminder" };
  }

  if (cart.remindersSent === 2 && hoursSinceAbandonment >= RECOVERY_EMAIL_DELAYS.final) {
    return { shouldSend: true, type: "final_reminder" };
  }

  return { shouldSend: false };
}

// Mark cart as recovered
export function markCartAsRecovered(
  cartId: string,
  orderId: string
): boolean {
  // In production, update database
  return true;
}

// Get recovery statistics
export interface RecoveryStats {
  totalAbandoned: number;
  totalRecovered: number;
  recoveryRate: number;
  totalRevenue: number;
  averageCartValue: number;
  emailPerformance: {
    first: { sent: number; opened: number; clicked: number; converted: number };
    second: { sent: number; opened: number; clicked: number; converted: number };
    final: { sent: number; opened: number; clicked: number; converted: number };
  };
}

export function getRecoveryStats(): RecoveryStats {
  // Mock stats - in production, query from database
  return {
    totalAbandoned: 156,
    totalRecovered: 47,
    recoveryRate: 30.1,
    totalRevenue: 7234.5,
    averageCartValue: 153.9,
    emailPerformance: {
      first: {
        sent: 156,
        opened: 98,
        clicked: 45,
        converted: 18,
      },
      second: {
        sent: 138,
        opened: 76,
        clicked: 32,
        converted: 15,
      },
      final: {
        sent: 123,
        opened: 67,
        clicked: 28,
        converted: 14,
      },
    },
  };
}

// Get abandoned carts needing attention
export function getAbandonedCartsNeedingAttention(): AbandonedCart[] {
  // Mock data - in production, query from database
  const mockCarts: AbandonedCart[] = [
    {
      id: "cart-001",
      email: "cliente1@example.com",
      items: [
        {
          productId: "difusor-aromatico",
          productName: "Difusor Aromático",
          quantity: 1,
          price: 129.9,
          image: "/images/difusor.jpg",
        },
      ],
      total: 129.9,
      abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      remindersSent: 0,
      recovered: false,
    },
    {
      id: "cart-002",
      email: "cliente2@example.com",
      items: [
        {
          productId: "coleira-led",
          productName: "Coleira LED",
          quantity: 2,
          price: 49.9,
          image: "/images/coleira.jpg",
        },
      ],
      total: 99.8,
      abandonedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      remindersSent: 1,
      lastReminderAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      recovered: false,
    },
  ];

  return mockCarts.filter((cart) => shouldSendReminder(cart).shouldSend);
}

// Calculate potential revenue from abandoned carts
export function calculatePotentialRevenue(): {
  total: number;
  recoverable: number;
  estimatedRecovery: number;
} {
  const stats = getRecoveryStats();
  const abandonedCarts = getAbandonedCartsNeedingAttention();

  const total = abandonedCarts.reduce((sum, cart) => sum + cart.total, 0);
  const recoverable = total * 0.7; // Assume 70% are recoverable
  const estimatedRecovery = recoverable * (stats.recoveryRate / 100);

  return {
    total,
    recoverable,
    estimatedRecovery,
  };
}
