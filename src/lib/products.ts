// src/lib/products.ts - Biblioteca de produtos e funções do carrinho
"use client";

// Tipos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'saude' | 'pet';
  subcategory: string;
  images: string[];
  stock: number;
  featured: boolean;
  features?: string[];
  relatedProducts?: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Produtos de Saúde e Bem-Estar
export const healthProducts: Product[] = [
  {
    id: 'difusor-aromatico',
    name: 'Difusor Aromático Ultrassônico Zen',
    description: 'Difusor aromático ultrassônico com luz LED colorida. Perfeito para aromaterapia, criando um ambiente relaxante e harmonioso em sua casa. Capacidade de 300ml, funciona até 8 horas contínuas.',
    price: 129.90,
    originalPrice: 159.90,
    category: 'saude',
    subcategory: 'aromaterapia',
    images: ['/images/products/aromaterapia.jpg'],
    stock: 15,
    featured: true,
    features: [
      'Capacidade de 300ml',
      'Luzes LED com 7 cores',
      'Desligamento automático',
      'Modo contínuo ou intermitente',
      'Silencioso (menos de 35dB)'
    ]
  },
  {
    id: 'oleo-essencial-lavanda',
    name: 'Óleo Essencial de Lavanda 100% Puro',
    description: 'Óleo essencial de lavanda 100% puro e natural. Conhecido por suas propriedades calmantes e relaxantes, ideal para aromaterapia, massagens e para criar um ambiente tranquilo em casa.',
    price: 49.90,
    category: 'saude',
    subcategory: 'aromaterapia',
    images: ['/images/products/aromaterapia.jpg'],
    stock: 30,
    featured: false,
    features: [
      '10ml de óleo essencial puro',
      'Extraído por destilação a vapor',
      'Sem aditivos ou diluentes',
      'Frasco com conta-gotas'
    ]
  },
  {
    id: 'tapete-yoga',
    name: 'Tapete de Yoga Ecológico Premium',
    description: 'Tapete de yoga ecológico, feito com materiais sustentáveis e não tóxicos. Antiderrapante e com excelente aderência, proporcionando segurança e conforto durante a prática.',
    price: 149.90,
    originalPrice: 179.90,
    category: 'saude',
    subcategory: 'fitness',
    images: ['/images/categories/saude_bem_estar.jpg'],
    stock: 10,
    featured: true,
    features: [
      'Material TPE ecológico',
      'Dimensões: 183cm x 61cm x 6mm',
      'Antiderrapante em ambos os lados',
      'Fácil de limpar',
      'Inclui alça para transporte'
    ]
  },
  {
    id: 'almofada-meditacao',
    name: 'Almofada de Meditação Zafu',
    description: 'Almofada de meditação Zafu tradicional, preenchida com fibras naturais. Proporciona conforto e alinhamento correto da coluna durante a meditação, reduzindo o desconforto nas pernas e costas.',
    price: 89.90,
    category: 'saude',
    subcategory: 'meditacao',
    images: ['/images/categories/saude_bem_estar.jpg'],
    stock: 8,
    featured: false,
    features: [
      'Preenchimento de fibras naturais',
      'Capa removível e lavável',
      'Diâmetro: 35cm, Altura: 15cm',
      'Tecido 100% algodão'
    ]
  },
  {
    id: 'suporte-ergonomico-notebook',
    name: 'Suporte Ergonômico para Notebook',
    description: 'Suporte ergonômico ajustável para notebook, ideal para home office. Melhora a postura, reduz dores no pescoço e costas, e previne a fadiga ocular. Compatível com notebooks de 11 a 17 polegadas.',
    price: 79.90,
    category: 'saude',
    subcategory: 'home-office',
    images: ['/images/categories/saude_bem_estar.jpg'],
    stock: 12,
    featured: false,
    features: [
      'Altura ajustável (6 níveis)',
      'Material leve e resistente',
      'Dobrável para transporte',
      'Compatível com notebooks de 11" a 17"',
      'Ventilação para evitar superaquecimento'
    ]
  }
];

// Produtos para Pets
export const petProducts: Product[] = [
  {
    id: 'brinquedo-interativo-pet',
    name: 'Brinquedo Interativo Dispensador de Petiscos',
    description: 'Brinquedo interativo que dispensa petiscos enquanto seu pet brinca. Estimula o instinto natural de caça, reduz o tédio e a ansiedade, além de proporcionar entretenimento por horas.',
    price: 69.90,
    originalPrice: 89.90,
    category: 'pet',
    subcategory: 'brinquedos',
    images: ['/images/products/pet_brinquedo.jpg'],
    stock: 20,
    featured: true,
    features: [
      'Material atóxico e resistente',
      'Fácil de limpar',
      'Ajustável para diferentes tamanhos de petiscos',
      'Adequado para cães e gatos',
      'Nível de dificuldade ajustável'
    ]
  },
  {
    id: 'cama-ortopedica-pet',
    name: 'Cama Ortopédica para Pets',
    description: 'Cama ortopédica com espuma viscoelástica que se adapta ao corpo do seu pet, aliviando pontos de pressão e proporcionando suporte para articulações. Ideal para pets idosos ou com problemas articulares.',
    price: 159.90,
    category: 'pet',
    subcategory: 'conforto',
    images: ['/images/categories/produtos_para_pets.jpg'],
    stock: 8,
    featured: true,
    features: [
      'Espuma viscoelástica de alta densidade',
      'Capa removível e lavável',
      'Base antiderrapante',
      'Bordas elevadas para suporte',
      'Tamanho: 80cm x 60cm x 20cm'
    ]
  },
  {
    id: 'coleira-ajustavel-pet',
    name: 'Coleira Ajustável com Plaquinha Personalizada',
    description: 'Coleira ajustável de alta qualidade com plaquinha de identificação personalizada. Feita com materiais duráveis e confortáveis, garantindo segurança e estilo para seu pet.',
    price: 49.90,
    category: 'pet',
    subcategory: 'acessorios',
    images: ['/images/categories/produtos_para_pets.jpg'],
    stock: 25,
    featured: false,
    features: [
      'Material resistente e lavável',
      'Ajustável para diferentes tamanhos',
      'Plaquinha de identificação personalizada',
      'Fecho seguro de engate rápido',
      'Disponível em várias cores'
    ]
  },
  {
    id: 'shampoo-natural-pet',
    name: 'Shampoo Natural para Pets',
    description: 'Shampoo 100% natural e hipoalergênico para cães e gatos. Formulado com ingredientes botânicos que limpam suavemente, hidratam e acalmam a pele sensível, deixando o pelo macio e brilhante.',
    price: 39.90,
    category: 'pet',
    subcategory: 'higiene',
    images: ['/images/categories/produtos_para_pets.jpg'],
    stock: 18,
    featured: false,
    features: [
      'Fórmula natural sem parabenos ou sulfatos',
      'pH balanceado para pets',
      'Hipoalergênico',
      'Fragrância suave',
      'Conteúdo: 300ml'
    ]
  },
  {
    id: 'fonte-agua-pet',
    name: 'Fonte de Água para Pets',
    description: 'Fonte de água com filtro para pets, que mantém a água sempre fresca e em movimento, estimulando seu pet a beber mais água. O sistema de filtragem remove pelos, detritos e impurezas.',
    price: 119.90,
    originalPrice: 149.90,
    category: 'pet',
    subcategory: 'acessorios',
    images: ['/images/categories/produtos_para_pets.jpg'],
    stock: 10,
    featured: false,
    features: [
      'Capacidade: 2 litros',
      'Sistema de filtragem de carvão ativado',
      'Bomba silenciosa',
      'Fácil de desmontar e limpar',
      'Indicador de nível de água'
    ]
  }
];

// Adicionar produtos relacionados SEM criar referências circulares
healthProducts.forEach(product => {
  product.relatedProducts = healthProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);
});

petProducts.forEach(product => {
  product.relatedProducts = petProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);
});

// Funções de produtos
export const getAllProducts = (): Product[] => {
  return [...healthProducts, ...petProducts];
};

export const getFeaturedProducts = (): Product[] => {
  return getAllProducts().filter(product => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find(product => product.id === id);
};

// Funções do carrinho
const CART_STORAGE_KEY = 'cart';

const calculateCartTotals = (items: CartItem[]): Omit<Cart, 'items'> => {
  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + (item.product.price * item.quantity),
    0
  );
  const shipping = subtotal > 0 ? (subtotal >= 150 ? 0 : 15) : 0;
  const total = subtotal + shipping;

  return { subtotal, shipping, total };
};

// CORREÇÃO: Não recarregar produtos para evitar referências circulares
export const loadCartFromStorage = (): Cart => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Usar produtos já salvos SEM recarregar com getProductById
        const items = parsedCart.items || [];
        return { ...calculateCartTotals(items), items };
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }
  return { items: [], subtotal: 0, shipping: 0, total: 0 };
};

// CORREÇÃO: Remover relatedProducts antes de salvar
export const saveCart = (cart: Cart): void => {
  if (typeof window !== 'undefined') {
    try {
      // Criar carrinho limpo SEM referências circulares
      const cleanCart = {
        items: cart.items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            originalPrice: item.product.originalPrice,
            category: item.product.category,
            subcategory: item.product.subcategory,
            images: item.product.images,
            stock: item.product.stock,
            featured: item.product.featured,
            features: item.product.features
            // NÃO incluir relatedProducts
          },
          quantity: item.quantity
        })),
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total
      };
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanCart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }
};

export const addToCart = (product: Product, quantity: number): void => {
  let currentCart = loadCartFromStorage();
  const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

  if (existingItemIndex >= 0) {
    currentCart.items[existingItemIndex].quantity += quantity;
  } else {
    // Adicionar produto SEM relatedProducts
    const cleanProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      stock: product.stock,
      featured: product.featured,
      features: product.features
      // NÃO incluir relatedProducts
    } as Product;
    
    currentCart.items.push({ product: cleanProduct, quantity });
  }
  saveCart({ ...currentCart, ...calculateCartTotals(currentCart.items) });
};

export const updateCartItemQuantity = (productId: string, change: number): void => {
  let currentCart = loadCartFromStorage();
  const itemIndex = currentCart.items.findIndex(item => item.product.id === productId);

  if (itemIndex >= 0) {
    const newQuantity = currentCart.items[itemIndex].quantity + change;
    if (newQuantity <= 0) {
      currentCart.items.splice(itemIndex, 1);
    } else {
      currentCart.items[itemIndex].quantity = newQuantity;
    }
    saveCart({ ...currentCart, ...calculateCartTotals(currentCart.items) });
  }
};

export const removeFromCart = (productId: string): void => {
  let currentCart = loadCartFromStorage();
  currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
  saveCart({ ...currentCart, ...calculateCartTotals(currentCart.items) });
};

export const clearCart = (): void => {
  const emptyCart: Cart = { items: [], subtotal: 0, shipping: 0, total: 0 };
  saveCart(emptyCart);
};

export const getCart = (): Cart => {
  return loadCartFromStorage();
};
