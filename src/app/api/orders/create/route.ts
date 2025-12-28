import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import { incrementCouponUsage } from "@/lib/coupons";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const data = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      shipping,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      couponId,
    } = data;

    // Validate required fields
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { message: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `MPZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? (session.user as any).id : null,
        customerName,
        customerEmail,
        customerPhone,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod,
        subtotal,
        shipping,
        discount,
        total,
        couponId,
        items: {
          create: items.map((item: any) => ({
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

    // Create shipping address if provided
    if (shippingAddress && session?.user) {
      await prisma.address.create({
        data: {
          userId: (session.user as any).id,
          name: shippingAddress.name,
          street: shippingAddress.street,
          number: shippingAddress.number,
          complement: shippingAddress.complement,
          neighborhood: shippingAddress.neighborhood,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          phone: shippingAddress.phone,
        },
      });
    }

    // Increment coupon usage if applied
    if (couponId) {
      await incrementCouponUsage(couponId);
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        email: customerEmail,
        name: customerName,
        orderNumber,
        total,
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

    return NextResponse.json(
      {
        message: "Pedido criado com sucesso",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
