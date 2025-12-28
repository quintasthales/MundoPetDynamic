import { productBundles, calculateBundleSavings } from "@/lib/bundles";
import Link from "next/link";

export default function BundlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kits e Combos
          </h1>
          <p className="text-xl text-gray-600">
            Economize comprando kits completos para seu pet
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {productBundles.map((bundle) => {
            const savings = calculateBundleSavings(bundle);

            return (
              <div
                key={bundle.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Badge */}
                {bundle.featured && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    ⭐ Mais Popular
                  </div>
                )}

                <div className="p-6">
                  {/* Image */}
                  <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <p className="text-sm">Kit {bundle.name}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {bundle.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        -{savings.savingsPercentage}%
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {bundle.description}
                    </p>

                    {/* Products Included */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Inclui {bundle.products.length} produtos:
                      </p>
                      <ul className="space-y-1">
                        {bundle.products.map((item, index) => (
                          <li
                            key={index}
                            className="text-xs text-gray-600 flex items-center gap-2"
                          >
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {item.quantity}x Produto
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-500 line-through">
                          De R$ {bundle.originalPrice.toFixed(2)}
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                          R$ {bundle.bundlePrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Economize R$ {savings.savings.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                        Adicionar ao Carrinho
                      </button>
                      <Link
                        href={`/kit/${bundle.id}`}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Por que comprar kits?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Economia Garantida
              </h3>
              <p className="text-gray-600">
                Economize até 25% comprando produtos em kits
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Produtos Selecionados
              </h3>
              <p className="text-gray-600">
                Combinações perfeitas escolhidas por especialistas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Praticidade
              </h3>
              <p className="text-gray-600">
                Tudo que você precisa em um único pedido
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou o kit ideal?
          </h2>
          <p className="text-xl mb-6">
            Entre em contato e montamos um kit personalizado para você!
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50"
          >
            Falar com Especialista
          </Link>
        </div>
      </div>
    </div>
  );
}
