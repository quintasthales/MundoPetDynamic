"use client";

import { useState } from "react";
import { giftCardTemplates } from "@/lib/giftcards";

export default function GiftCardsPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const handlePurchase = () => {
    // In production, this would process the gift card purchase
    alert("Vale presente adicionado ao carrinho!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vale Presente Digital
          </h1>
          <p className="text-xl text-gray-600">
            O presente perfeito para quem ama pets
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Entrega Imediata</h3>
            <p className="text-sm text-gray-600">Por email instantaneamente</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
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
            <h3 className="font-medium text-gray-900 mb-1">Sem Taxas</h3>
            <p className="text-sm text-gray-600">100% do valor para usar</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Personalizável</h3>
            <p className="text-sm text-gray-600">Adicione mensagem especial</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Validade 1 Ano</h3>
            <p className="text-sm text-gray-600">Tempo para usar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gift Card Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Escolha o Valor
            </h2>

            {/* Predefined Values */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {giftCardTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedCard(template.id);
                    setCustomAmount("");
                  }}
                  className={`relative bg-white rounded-lg p-6 border-2 transition-all ${
                    selectedCard === template.id
                      ? "border-blue-600 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      R$ {template.value}
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Ou escolha um valor personalizado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedCard(null);
                  }}
                  placeholder="Digite o valor (mín. R$ 10)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Valor mínimo: R$ 10 • Valor máximo: R$ 1.000
              </p>
            </div>

            {/* Recipient Information */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Informações do Destinatário
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Destinatário
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email do Destinatário
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem Personalizada (Opcional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva uma mensagem especial..."
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length}/200 caracteres
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega (Opcional)
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deixe em branco para entrega imediata
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor do Vale:</span>
                  <span className="font-medium text-gray-900">
                    R${" "}
                    {selectedCard
                      ? giftCardTemplates
                          .find((t) => t.id === selectedCard)
                          ?.value.toFixed(2)
                      : customAmount
                      ? parseFloat(customAmount).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Processamento:</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      R${" "}
                      {selectedCard
                        ? giftCardTemplates
                            .find((t) => t.id === selectedCard)
                            ?.value.toFixed(2)
                        : customAmount
                        ? parseFloat(customAmount).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={
                  (!selectedCard && !customAmount) ||
                  !recipientName ||
                  !recipientEmail
                }
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar ao Carrinho
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                  <span>Entrega por email instantânea</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                  <span>Válido por 1 ano</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                  <span>Pode ser usado em qualquer produto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Check Balance */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Já tem um Vale Presente?</h2>
          <p className="mb-6">Consulte o saldo do seu vale presente</p>
          <a
            href="/consultar-vale"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50"
          >
            Consultar Saldo
          </a>
        </div>
      </div>
    </div>
  );
}
