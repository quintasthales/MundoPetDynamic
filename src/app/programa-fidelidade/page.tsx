import { auth } from "@/lib/auth";
import { loyaltyTiers, getTierByPoints, getNextTier, rewardOptions } from "@/lib/loyalty";
import Link from "next/link";

export default async function LoyaltyProgramPage() {
  const session = await auth();

  // Mock user points - in production, fetch from database
  const userPoints = session ? 750 : 0;
  const currentTier = getTierByPoints(userPoints);
  const nextTierInfo = getNextTier(userPoints);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Programa de Fidelidade
          </h1>
          <p className="text-xl text-gray-600">
            Ganhe pontos a cada compra e troque por descontos exclusivos
          </p>
        </div>

        {/* User Status */}
        {session ? (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-12 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {userPoints.toLocaleString("pt-BR")} Pontos
                </h2>
                <p className="text-blue-100">Nível {currentTier.name}</p>
              </div>
              <div className="text-right">
                {nextTierInfo.tier ? (
                  <>
                    <p className="text-sm text-blue-100 mb-1">
                      Próximo nível: {nextTierInfo.tier.name}
                    </p>
                    <p className="text-2xl font-bold">
                      {nextTierInfo.pointsNeeded} pontos
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold">Nível Máximo!</p>
                )}
              </div>
            </div>

            {nextTierInfo.tier && (
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-white h-full transition-all"
                  style={{
                    width: `${
                      ((userPoints - currentTier.minPoints) /
                        (nextTierInfo.tier.minPoints - currentTier.minPoints)) *
                      100
                    }%`,
                  }}
                />
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Link
                href="/minha-conta"
                className="px-6 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50"
              >
                Minha Conta
              </Link>
              <Link
                href="#resgatar"
                className="px-6 py-2 bg-white/20 text-white rounded-md font-medium hover:bg-white/30"
              >
                Resgatar Pontos
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Faça login para ver seus pontos
            </h2>
            <p className="text-gray-600 mb-6">
              Entre na sua conta para acompanhar seus pontos e resgatar recompensas
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Fazer Login
            </Link>
          </div>
        )}

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                1. Compre
              </h3>
              <p className="text-gray-600">
                Ganhe pontos a cada compra realizada em nossa loja
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                2. Acumule
              </h3>
              <p className="text-gray-600">
                Quanto mais você compra, mais pontos você acumula
              </p>
            </div>
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
                3. Resgate
              </h3>
              <p className="text-gray-600">
                Troque seus pontos por descontos e benefícios exclusivos
              </p>
            </div>
          </div>
        </div>

        {/* Tiers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Níveis de Fidelidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loyaltyTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-lg shadow-sm p-6 border-2 ${
                  currentTier.id === tier.id
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tier.minPoints.toLocaleString("pt-BR")}+ pontos
                  </p>
                  {tier.discountPercentage > 0 && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {tier.discountPercentage}% de desconto
                    </div>
                  )}
                </div>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0"
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
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div id="resgatar" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recompensas Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardOptions.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {reward.name}
                    </h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {reward.pointsCost} pts
                  </div>
                  <button
                    disabled={!session || userPoints < reward.pointsCost}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {!session
                      ? "Faça login"
                      : userPoints < reward.pointsCost
                      ? "Pontos insuficientes"
                      : "Resgatar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Como ganho pontos?
              </h3>
              <p className="text-gray-600">
                Você ganha pontos automaticamente a cada compra. A quantidade de
                pontos depende do seu nível de fidelidade atual.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Os pontos expiram?
              </h3>
              <p className="text-gray-600">
                Sim, os pontos expiram após 12 meses sem atividade na conta.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Posso transferir pontos?
              </h3>
              <p className="text-gray-600">
                Não, os pontos são pessoais e intransferíveis.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Como subo de nível?
              </h3>
              <p className="text-gray-600">
                Você sobe de nível automaticamente ao atingir a quantidade mínima
                de pontos necessária para o próximo nível.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
