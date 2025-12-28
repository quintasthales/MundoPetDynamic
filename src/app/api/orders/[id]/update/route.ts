import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { status, paymentStatus, trackingNumber } = await request.json();

    // Get current order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        paymentStatus,
        ...(trackingNumber && { notes: trackingNumber }),
      },
    });

    // Send status update email if status changed
    if (status !== order.status) {
      try {
        await sendOrderStatusUpdate({
          email: order.customerEmail,
          name: order.customerName,
          orderNumber: order.orderNumber,
          status,
          trackingNumber,
        });
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
        // Don't fail the update if email fails
      }
    }

    return NextResponse.json({
      message: "Pedido atualizado com sucesso",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
