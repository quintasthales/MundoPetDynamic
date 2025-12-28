"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";

interface SearchSuggestion {
  type: "product" | "category" | "keyword";
  text: string;
  url: string;
  image?: string;
  price?: number;
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results: SearchSuggestion[] = [];

    // Search products
    const matchingProducts = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5)
      .map((product) => ({
        type: "product" as const,
        text: product.name,
        url: `/produto/${product.id}`,
        image: product.images[0],
        price: product.price,
      }));

    results.push(...matchingProducts);

    // Search categories
    const categories = Array.from(
      new Set(products.map((p) => p.category))
    ).filter((cat) => cat.toLowerCase().includes(searchTerm));

    categories.slice(0, 3).forEach((category) => {
      results.push({
        type: "category",
        text: category,
        url: `/produtos?categoria=${encodeURIComponent(category)}`,
      });
    });

    // Popular keywords
    const keywords = [
      "difusor",
      "coleira",
      "shampoo",
      "ração",
      "brinquedo",
      "cama",
      "petisco",
    ];
    const matchingKeywords = keywords.filter((kw) =>
      kw.toLowerCase().includes(searchTerm)
    );

    matchingKeywords.slice(0, 2).forEach((keyword) => {
      results.push({
        type: "keyword",
        text: keyword,
        url: `/busca?q=${encodeURIComponent(keyword)}`,
      });
    });

    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(finalQuery.trim())}`);
      setShowSuggestions(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        router.push(suggestions[selectedIndex].url);
        setShowSuggestions(false);
        setQuery("");
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Buscar produtos, categorias..."
          className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(suggestion.url);
                setShowSuggestions(false);
                setQuery("");
              }}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? "bg-blue-50" : ""
              }`}
            >
              {suggestion.type === "product" && suggestion.image && (
                <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                  <img
                    src={suggestion.image}
                    alt={suggestion.text}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {suggestion.type === "category" && (
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              )}

              {suggestion.type === "keyword" && (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              )}

              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{suggestion.text}</div>
                {suggestion.type === "product" && suggestion.price && (
                  <div className="text-sm text-blue-600 font-medium">
                    R$ {suggestion.price.toFixed(2)}
                  </div>
                )}
                {suggestion.type === "category" && (
                  <div className="text-xs text-gray-500">Categoria</div>
                )}
                {suggestion.type === "keyword" && (
                  <div className="text-xs text-gray-500">Busca sugerida</div>
                )}
              </div>

              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}

          {/* View All Results */}
          <button
            onClick={() => handleSearch()}
            className="w-full px-4 py-3 border-t border-gray-200 text-center text-blue-600 font-medium hover:bg-gray-50"
          >
            Ver todos os resultados para "{query}"
          </button>
        </div>
      )}

      {/* Popular Searches (when empty) */}
      {!query && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Buscas populares:</span>
          {["Difusor", "Coleira", "Ração", "Brinquedo"].map((term) => (
            <button
              key={term}
              onClick={() => handleSearch(term)}
              className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
