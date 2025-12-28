"use client";

import { useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  productPurchased?: string;
  avatar?: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Produtos de excelente qualidade! Meu cachorro adorou o difusor aromático. A entrega foi super rápida e o atendimento impecável. Recomendo!",
    date: "2024-12-15",
    productPurchased: "Difusor Aromático Ultrassônico",
    verified: true,
  },
  {
    id: "2",
    name: "João Santos",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Melhor loja de produtos pet que já comprei! Os preços são justos e a qualidade é top. Minha gata está muito mais tranquila depois que comecei a usar os produtos.",
    date: "2024-12-10",
    productPurchased: "Kit Bem-Estar Completo",
    verified: true,
  },
  {
    id: "3",
    name: "Ana Costa",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Atendimento excepcional! Tive uma dúvida sobre o produto e fui atendida super rápido. O produto chegou antes do prazo e meu pet amou!",
    date: "2024-12-08",
    productPurchased: "Coleira Anti-Pulgas Natural",
    verified: true,
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    location: "Curitiba, PR",
    rating: 5,
    text: "Já sou cliente há 6 meses e nunca tive problemas. Produtos sempre chegam bem embalados e em perfeito estado. Parabéns pelo trabalho!",
    date: "2024-12-05",
    verified: true,
  },
  {
    id: "5",
    name: "Fernanda Lima",
    location: "Porto Alegre, RS",
    rating: 5,
    text: "Adorei o programa de fidelidade! Já resgatei vários descontos. Os produtos são ótimos e meu cachorro está mais saudável. Muito satisfeita!",
    date: "2024-12-01",
    productPurchased: "Assinatura Mensal",
    verified: true,
  },
  {
    id: "6",
    name: "Roberto Alves",
    location: "Salvador, BA",
    rating: 5,
    text: "Comprei o kit para filhote e veio tudo certinho. Meu cachorrinho está adorando! Preço excelente e entrega rápida. Voltarei a comprar com certeza.",
    date: "2024-11-28",
    productPurchased: "Kit Filhote Iniciante",
    verified: true,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const nextTestimonials = () => {
    setCurrentIndex((prev) =>
      prev + testimonialsPerPage >= testimonials.length
        ? 0
        : prev + testimonialsPerPage
    );
  };

  const prevTestimonials = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, testimonials.length - testimonialsPerPage)
        : Math.max(0, prev - testimonialsPerPage)
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + testimonialsPerPage
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600">
            Mais de 10.000 clientes satisfeitos em todo o Brasil
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900">
              4.9/5.0 (2.543 avaliações)
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Product */}
                {testimonial.productPurchased && (
                  <div className="bg-gray-50 rounded-md px-3 py-2 mb-4">
                    <p className="text-xs text-gray-600">Comprou:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.productPurchased}
                    </p>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {testimonial.name}
                      </p>
                      {testimonial.verified && (
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {testimonial.location}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonials}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex gap-2">
              {Array.from({
                length: Math.ceil(testimonials.length / testimonialsPerPage),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * testimonialsPerPage)}
                  className={`w-2 h-2 rounded-full ${
                    Math.floor(currentIndex / testimonialsPerPage) === i
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonials}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 disabled:opacity-50"
              disabled={currentIndex + testimonialsPerPage >= testimonials.length}
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10.000+</div>
            <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5.0</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Recomendariam</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
            <div className="text-sm text-gray-600">Suporte Rápido</div>
          </div>
        </div>
      </div>
    </div>
  );
}
