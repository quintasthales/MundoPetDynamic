import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OrderStatusUpdate from "@/components/OrderStatusUpdate";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
      shippingAddress: true,
    },
  });

  if (!order) {
    redirect("/admin/pedidos");
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    PROCESSING: "Processando",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/pedidos"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
          >
            ← Voltar para Pedidos
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Realizado em{" "}
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Itens do Pedido
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      {item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantidade: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        SKU: {item.product.sku || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {item.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        un. R$ {(item.price / item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      R$ {order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="text-gray-900">
                      R$ {order.shipping.toFixed(2)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desconto</span>
                      <span className="text-green-600">
                        -R$ {order.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Endereço de Entrega
                </h2>
                <div className="text-gray-700">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="mt-2">
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.number}
                  </p>
                  {order.shippingAddress.complement && (
                    <p>{order.shippingAddress.complement}</p>
                  )}
                  <p>
                    {order.shippingAddress.neighborhood} -{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>CEP: {order.shippingAddress.zipCode}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">Tel: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Status do Pedido
              </h2>
              <OrderStatusUpdate
                orderId={order.id}
                currentStatus={order.status}
                currentPaymentStatus={order.paymentStatus}
              />
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Cliente</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Nome</div>
                  <div className="font-medium text-gray-900">
                    {order.customerName}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Email</div>
                  <div className="font-medium text-gray-900">
                    {order.customerEmail}
                  </div>
                </div>
                {order.customerPhone && (
                  <div>
                    <div className="text-gray-600">Telefone</div>
                    <div className="font-medium text-gray-900">
                      {order.customerPhone}
                    </div>
                  </div>
                )}
                {order.user && (
                  <div>
                    <div className="text-gray-600">Conta</div>
                    <div className="font-medium text-gray-900">
                      <Link
                        href={`/admin/usuarios/${order.user.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Pagamento
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Método</div>
                  <div className="font-medium text-gray-900">
                    {order.paymentMethod || "Não especificado"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Status</div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : order.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
