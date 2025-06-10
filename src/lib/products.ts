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
    images: ['/images/difusor.jpg', '/images/difusor-2.jpg'],
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
    images: ['/images/oleo-lavanda.jpg'],
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
    images: ['/images/tapete-yoga.jpg', '/images/tapete-yoga-2.jpg'],
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
    images: ['/images/almofada-meditacao.jpg'],
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
    images: ['/images/suporte-notebook.jpg'],
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
    images: ['/images/brinquedo-interativo.jpg', '/images/brinquedo-interativo-2.jpg'],
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
    images: ['/images/cama-pet.jpg'],
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
    images: ['/images/coleira-pet.jpg'],
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
    images: ['/images/shampoo-pet.jpg'],
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
    images: ['/images/fonte-pet.jpg'],
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

// Adicionar produtos relacionados
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

// Carrinho global - será inicializado apenas no cliente
let cart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0
};

// Função para carregar o carrinho do localStorage
const loadCartFromStorage = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }
  
  try {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) {
      return { items: [], subtotal: 0, shipping: 0, total: 0 };
    }
    
    const parsedCart = JSON.parse(savedCart);
    
    // Reconstruir objetos de produto completos
    const items = parsedCart.items.map((item: any) => {
      const product = getProductById(item.product.id);
      return product ? { product, quantity: item.quantity } : null;
    }).filter(Boolean);
    
    // Recalcular valores
    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 
      0
    );
    const shipping = subtotal > 0 ? 15.90 : 0;
    const total = subtotal + shipping;
    
    return { items, subtotal, shipping, total };
  } catch (e) {
    console.error('Erro ao carregar carrinho:', e);
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }
};

// Salvar carrinho no localStorage
const saveCart = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      // Disparar evento para notificar que o carrinho foi atualizado
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
  }
};

// Inicializar carrinho - deve ser chamado em componentes do cliente
export const initCart = () => {
  if (typeof window !== 'undefined') {
    cart = loadCartFromStorage();
    return cart;
  }
  return { items: [], subtotal: 0, shipping: 0, total: 0 };
};

// Obter carrinho
export const getCart = (): Cart => {
  if (typeof window !== 'undefined') {
    // Se estamos no cliente, sempre carregar a versão mais recente do localStorage
    cart = loadCartFromStorage();
  }
  return {...cart};
};

// Adicionar ao carrinho
export const addToCart = (product: Product, quantity: number): void => {
  if (typeof window === 'undefined') return;
  
  // Garantir que o carrinho está inicializado com dados do localStorage
  cart = loadCartFromStorage();
  
  const existingItemIndex = cart.items.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Atualizar quantidade se o produto já estiver no carrinho
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Adicionar novo item ao carrinho
    cart.items.push({ product, quantity });
  }
  
  // Recalcular valores
  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  cart.shipping = cart.subtotal > 0 ? 15.90 : 0;
  cart.total = cart.subtotal + cart.shipping;
  
  saveCart();
  
  // Log para debug
  console.log('Produto adicionado ao carrinho:', product.name);
  console.log('Carrinho atual:', cart);
};

// Atualizar quantidade de item no carrinho
export const updateCartItemQuantity = (productId: string, change: number): void => {
  if (typeof window === 'undefined') return;
  
  // Garantir que o carrinho está inicializado com dados do localStorage
  cart = loadCartFromStorage();
  
  const itemIndex = cart.items.findIndex(item => item.product.id === productId);
  
  if (itemIndex >= 0) {
    const newQuantity = cart.items[itemIndex].quantity + change;
    
    if (newQuantity <= 0) {
      // Remover item se a quantidade for zero ou negativa
      cart.items.splice(itemIndex, 1);
    } else {
      // Atualizar quantidade
      cart.items[itemIndex].quantity = newQuantity;
    }
    
    // Recalcular valores
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    cart.shipping = cart.subtotal > 0 ? 15.90 : 0;
    cart.total = cart.subtotal + cart.shipping;
    
    saveCart();
  }
};

// Remover do carrinho
export const removeFromCart = (productId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Garantir que o carrinho está inicializado com dados do localStorage
  cart = loadCartFromStorage();
  
  cart.items = cart.items.filter(item => item.product.id !== productId);
  
  // Recalcular valores
  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  cart.shipping = cart.subtotal > 0 ? 15.90 : 0;
  cart.total = cart.subtotal + cart.shipping;
  
  saveCart();
};

// Limpar carrinho
export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  
  cart = {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
  };
  
  saveCart();
};

// Inicializar carrinho quando este módulo for carregado no cliente
if (typeof window !== 'undefined') {
  // Executar em um setTimeout para garantir que seja executado após a hidratação
  setTimeout(() => {
    initCart();
    console.log('Carrinho inicializado:', cart);
  }, 0);
}
