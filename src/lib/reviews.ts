// src/lib/reviews.ts - Product Reviews System
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verified: boolean; // Verified purchase
  helpful: number; // Number of helpful votes
  createdAt: string;
  images?: string[]; // Optional review images
}

// Mock reviews data (in production, this would come from a database)
const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'difusor-aromatico',
    userId: 'user-1',
    userName: 'Maria Silva',
    rating: 5,
    title: 'Excelente produto!',
    comment: 'O difusor é lindo e funciona perfeitamente. O aroma se espalha por todo o ambiente e a iluminação LED cria uma atmosfera muito relaxante.',
    verified: true,
    helpful: 12,
    createdAt: '2024-11-10',
  },
  {
    id: 'rev-2',
    productId: 'difusor-aromatico',
    userId: 'user-2',
    userName: 'João Santos',
    rating: 4,
    title: 'Muito bom, recomendo',
    comment: 'Produto de qualidade, chegou rápido e bem embalado. Único ponto é que o reservatório poderia ser um pouco maior.',
    verified: true,
    helpful: 8,
    createdAt: '2024-11-08',
  },
  {
    id: 'rev-3',
    productId: 'brinquedo-interativo',
    userId: 'user-3',
    userName: 'Ana Costa',
    rating: 5,
    title: 'Meu cachorro ama!',
    comment: 'Comprei para meu golden retriever e ele não para de brincar! Muito resistente e estimula a inteligência dele.',
    verified: true,
    helpful: 15,
    createdAt: '2024-11-12',
  },
  {
    id: 'rev-4',
    productId: 'brinquedo-interativo',
    userId: 'user-4',
    userName: 'Carlos Oliveira',
    rating: 5,
    title: 'Ótimo para pets inteligentes',
    comment: 'Minha border collie resolveu o desafio em 10 minutos, mas ela adora! Mantém ela entretida por horas.',
    verified: true,
    helpful: 6,
    createdAt: '2024-11-05',
  },
  {
    id: 'rev-5',
    productId: 'cama-pet',
    userId: 'user-5',
    userName: 'Fernanda Lima',
    rating: 5,
    title: 'Perfeita para pets idosos',
    comment: 'Meu cachorro de 12 anos está dormindo muito melhor. A espuma ortopédica realmente faz diferença!',
    verified: true,
    helpful: 20,
    createdAt: '2024-11-15',
  },
  {
    id: 'rev-6',
    productId: 'tapete-yoga',
    userId: 'user-6',
    userName: 'Patricia Mendes',
    rating: 5,
    title: 'Melhor tapete que já tive',
    comment: 'Aderência perfeita, confortável e fácil de limpar. Vale cada centavo!',
    verified: true,
    helpful: 9,
    createdAt: '2024-11-13',
  },
];

// Get all reviews for a product
export function getProductReviews(productId: string): Review[] {
  return mockReviews.filter(review => review.productId === productId);
}

// Get review statistics for a product
export function getReviewStats(productId: string) {
  const reviews = getProductReviews(productId);
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  const ratingDistribution = reviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  return {
    totalReviews: reviews.length,
    averageRating: Number(averageRating.toFixed(1)),
    ratingDistribution,
  };
}

// Add a new review (in production, this would save to database)
export function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Review {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    helpful: 0,
  };
  
  mockReviews.push(newReview);
  
  // In production, save to database
  if (typeof window !== 'undefined') {
    const savedReviews = localStorage.getItem('product_reviews');
    const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
    allReviews.push(newReview);
    localStorage.setItem('product_reviews', JSON.stringify(allReviews));
  }
  
  return newReview;
}

// Load reviews from localStorage (for client-side persistence)
export function loadReviewsFromStorage(): Review[] {
  if (typeof window === 'undefined') return [];
  
  const savedReviews = localStorage.getItem('product_reviews');
  return savedReviews ? JSON.parse(savedReviews) : [];
}

// Mark review as helpful
export function markReviewHelpful(reviewId: string): void {
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) {
    review.helpful++;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const savedReviews = localStorage.getItem('product_reviews');
      if (savedReviews) {
        const allReviews = JSON.parse(savedReviews);
        const reviewIndex = allReviews.findIndex((r: Review) => r.id === reviewId);
        if (reviewIndex !== -1) {
          allReviews[reviewIndex].helpful++;
          localStorage.setItem('product_reviews', JSON.stringify(allReviews));
        }
      }
    }
  }
}

// Get all reviews (merged with localStorage)
export function getAllReviews(productId: string): Review[] {
  const baseReviews = getProductReviews(productId);
  const storedReviews = loadReviewsFromStorage().filter(r => r.productId === productId);
  
  // Merge and deduplicate
  const allReviews = [...baseReviews, ...storedReviews];
  const uniqueReviews = Array.from(
    new Map(allReviews.map(review => [review.id, review])).values()
  );
  
  // Sort by date (newest first)
  return uniqueReviews.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
