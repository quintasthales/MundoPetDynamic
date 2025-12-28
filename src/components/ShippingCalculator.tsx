"use client";

import { useState } from "react";

interface ShippingCalculatorProps {
  items: Array<{
    id: string;
    weight?: number;
    quantity: number;
  }>;
  cartTotal: number;
  onShippingCalculated?: (cost: number) => void;
}

export default function ShippingCalculator({
  items,
  cartTotal,
  onShippingCalculated,
}: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    setZipCode(formatted);
  };

  const calculateShipping = async () => {
    if (zipCode.replace(/\D/g, "").length !== 8) {
      setError("CEP inválido. Digite um CEP válido.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zipCode,
          items,
          cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao calcular frete");
      }

      setResult(data.shipping);
      if (onShippingCalculated) {
        onShippingCalculated(data.shipping.cost);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao calcular frete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calcular Frete
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="00000-000"
            maxLength={9}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={calculateShipping}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "..." : "Calcular"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Digite seu CEP para calcular o frete
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Frete</div>
              {result.isFreeShipping ? (
                <div className="text-lg font-bold text-green-600">GRÁTIS</div>
              ) : (
                <div className="text-lg font-bold text-gray-900">
                  R$ {result.cost.toFixed(2)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Prazo</div>
              <div className="text-lg font-bold text-gray-900">
                {result.estimatedDays} dias
              </div>
            </div>
          </div>

          {result.isFreeShipping && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
              🎉 Você ganhou frete grátis! Compras acima de R${" "}
              {result.freeShippingThreshold.toFixed(2)}
            </div>
          )}

          {!result.isFreeShipping &&
            cartTotal < result.freeShippingThreshold && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm">
                💡 Faltam R${" "}
                {(result.freeShippingThreshold - cartTotal).toFixed(2)} para
                frete grátis!
              </div>
            )}

          <div className="text-xs text-gray-500">
            Entrega prevista: {result.estimatedDate}
          </div>
        </div>
      )}
    </div>
  );
}
