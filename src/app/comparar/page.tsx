"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/products";

const products = getAllProducts();
import Link from "next/link";

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("compareItems");
    if (stored) {
      const items = JSON.parse(stored);
      setCompareItems(items);
      const prods = items.map((id: string) =>
        products.find((p) => p.id === id)
      ).filter(Boolean);
      setSelectedProducts(prods);
    }
  }, []);

  const removeFromCompare = (productId: string) => {
    const updated = compareItems.filter((id) => id !== productId);
    setCompareItems(updated);
    localStorage.setItem("compareItems", JSON.stringify(updated));
    setSelectedProducts(
      updated.map((id) => products.find((p) => p.id === id)).filter(Boolean)
    );
  };

  const clearAll = () => {
    setCompareItems([]);
    setSelectedProducts([]);
    localStorage.removeItem("compareItems");
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum produto para comparar
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Adicione produtos à comparação para ver as diferenças
            </p>
            <div className="mt-6">
              <Link
                href="/produtos"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Comparar Produtos
            </h1>
            <p className="text-gray-600 mt-2">
              Compare {selectedProducts.length} produto(s)
            </p>
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Limpar Todos
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Atributo
                </th>
                {selectedProducts.map((product) => (
                  <th
                    key={product.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden mb-2">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 normal-case">
                        {product.name}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Price */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Preço
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {product.price.toFixed(2)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Avaliação
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">
                        {product.rating || "N/A"}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Categoria
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600"
                  >
                    {product.category}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Descrição
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 text-center text-sm text-gray-600"
                  >
                    <div className="max-w-xs mx-auto">
                      {product.description}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Disponibilidade
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? "Em estoque" : "Indisponível"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Ações
                </td>
                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="px-6 py-4 whitespace-nowrap text-center"
                  >
                    <div className="space-y-2">
                      <Link
                        href={`/produto/${product.id}`}
                        className="block w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
                      >
                        Ver Detalhes
                      </Link>
                      <button className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/produtos"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para Produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
