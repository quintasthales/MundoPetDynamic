"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: OrderStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/orders/${orderId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar pedido");
      }

      setMessage("Pedido atualizado com sucesso!");
      router.refresh();
    } catch (error) {
      setMessage("Erro ao atualizar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("sucesso")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status do Pedido
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="PROCESSING">Processando</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregue</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="REFUNDED">Reembolsado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status do Pagamento
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="FAILED">Falhou</option>
          <option value="REFUNDED">Reembolsado</option>
        </select>
      </div>

      {status === "SHIPPED" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Rastreio
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Ex: BR123456789BR"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? "Atualizando..." : "Atualizar Pedido"}
      </button>
    </div>
  );
}
