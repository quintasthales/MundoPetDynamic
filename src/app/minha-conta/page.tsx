import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyAccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      addresses: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  const orderStats = await prisma.order.groupBy({
    by: ["status"],
    where: { userId: (session.user as any).id },
    _count: true,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo à sua conta MundoPetZen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <Link
                  href="/minha-conta"
                  className="block px-4 py-2 text-blue-600 bg-blue-50 rounded-md font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/meus-pedidos"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Meus Pedidos
                </Link>
                <Link
                  href="/meus-enderecos"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Endereços
                </Link>
                <Link
                  href="/favoritos"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Favoritos
                </Link>
                <Link
                  href="/meus-dados"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Meus Dados
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sair
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600">Total de Pedidos</div>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {user?.orders.length || 0}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600">Em Andamento</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  {orderStats.find((s) => s.status === "PROCESSING")?._count || 0}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-sm text-gray-600">Entregues</div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {orderStats.find((s) => s.status === "DELIVERED")?._count || 0}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Pedidos Recentes
                </h2>
                <Link
                  href="/meus-pedidos"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todos
                </Link>
              </div>

              {user?.orders && user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            Pedido #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            R$ {order.total.toFixed(2)}
                          </div>
                          <div className="text-sm mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "SHIPPED"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "PROCESSING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Você ainda não fez nenhum pedido
                  </p>
                  <Link
                    href="/produtos"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Começar a comprar
                  </Link>
                </div>
              )}
            </div>

            {/* Default Address */}
            {user?.addresses && user.addresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Endereço Principal
                  </h2>
                  <Link
                    href="/meus-enderecos"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
                <div className="text-gray-700">
                  <p className="font-medium">{user.addresses[0].name}</p>
                  <p className="mt-1">
                    {user.addresses[0].street}, {user.addresses[0].number}
                  </p>
                  {user.addresses[0].complement && (
                    <p>{user.addresses[0].complement}</p>
                  )}
                  <p>
                    {user.addresses[0].neighborhood} - {user.addresses[0].city},{" "}
                    {user.addresses[0].state}
                  </p>
                  <p>CEP: {user.addresses[0].zipCode}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
