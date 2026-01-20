// Update products with real data from Brazilian market
import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  stock: number;
  sku: string;
  weight?: number;
  supplier: string;
}

// Real products based on Brazilian market (Petz, Petlove, Cobasi)
const realProducts: Product[] = [
  // RAÇÕES PARA CÃES
  {
    id: 'prod-001',
    name: 'Ração Premier Pet Ambientes Internos Cães Adultos Frango 12kg',
    description: 'Ração completa e balanceada para cães adultos que vivem em ambientes internos. Fórmula com frango, arroz e vegetais. Controla odor das fezes e mantém o peso ideal.',
    price: 189.90,
    compareAtPrice: 249.90,
    category: 'Alimentação',
    subcategory: 'Ração para Cães',
    brand: 'Premier Pet',
    images: [
      '/products/rMQS2RA0DSJx.jpg',
    ],
    specifications: {
      'Peso': '12kg',
      'Sabor': 'Frango',
      'Idade': 'Adulto',
      'Porte': 'Pequeno e Médio',
      'Proteína': '24%',
      'Gordura': '14%',
    },
    tags: ['ração', 'cachorro', 'adulto', 'premier', 'frango', 'ambientes internos'],
    stock: 150,
    sku: 'DOG-PREMIER-001',
    weight: 12000,
    supplier: 'Premier Pet',
  },
  {
    id: 'prod-002',
    name: 'Ração Golden Fórmula Cães Filhotes Frango e Arroz 15kg',
    description: 'Nutrição completa para filhotes. Fórmula especial com DHA e EPA para desenvolvimento cerebral, cálcio para ossos fortes e antioxidantes naturais.',
    price: 179.90,
    compareAtPrice: 229.90,
    category: 'Alimentação',
    subcategory: 'Ração para Cães',
    brand: 'Golden',
    images: [
      '/products/ay3SrhnIaGXe.jpeg',
    ],
    specifications: {
      'Peso': '15kg',
      'Sabor': 'Frango e Arroz',
      'Idade': 'Filhote',
      'Porte': 'Todos',
      'Proteína': '28%',
      'Gordura': '16%',
    },
    tags: ['ração', 'filhote', 'cachorro', 'golden', 'frango'],
    stock: 120,
    sku: 'DOG-GOLDEN-002',
    weight: 15000,
    supplier: 'Golden',
  },
  {
    id: 'prod-003',
    name: 'Ração Royal Canin Mini Adult para Cães Adultos de Raças Pequenas 7.5kg',
    description: 'Alimento completo para cães adultos de raças pequenas (até 10kg). Fórmula exclusiva que atende às necessidades nutricionais específicas.',
    price: 219.90,
    compareAtPrice: 279.90,
    category: 'Alimentação',
    subcategory: 'Ração para Cães',
    brand: 'Royal Canin',
    images: [
      '/products/NQDMQxN41iv1.jpg',
    ],
    specifications: {
      'Peso': '7.5kg',
      'Sabor': 'Mix',
      'Idade': 'Adulto',
      'Porte': 'Pequeno',
      'Proteína': '27%',
      'Gordura': '16%',
    },
    tags: ['ração', 'cachorro', 'adulto', 'royal canin', 'raças pequenas'],
    stock: 100,
    sku: 'DOG-ROYAL-003',
    weight: 7500,
    supplier: 'Royal Canin',
  },
  
  // RAÇÕES PARA GATOS
  {
    id: 'prod-004',
    name: 'Ração Whiskas Adulto Sabor Carne 10.1kg',
    description: 'Ração completa para gatos adultos com sabor irresistível de carne. Auxilia na saúde urinária e controle de bolas de pelo.',
    price: 129.90,
    compareAtPrice: 169.90,
    category: 'Alimentação',
    subcategory: 'Ração para Gatos',
    brand: 'Whiskas',
    images: [
      '/products/rpBF5JSV8zJY.jpg',
    ],
    specifications: {
      'Peso': '10.1kg',
      'Sabor': 'Carne',
      'Idade': 'Adulto',
      'Proteína': '30%',
      'Gordura': '10%',
    },
    tags: ['ração', 'gato', 'adulto', 'whiskas', 'carne'],
    stock: 180,
    sku: 'CAT-WHISKAS-001',
    weight: 10100,
    supplier: 'Whiskas',
  },
  {
    id: 'prod-005',
    name: 'Ração Premier Pet Ambientes Internos Gatos Adultos Frango 7.5kg',
    description: 'Ração premium para gatos que vivem em ambientes internos. Controla odor das fezes e bolas de pelo. Rico em fibras naturais.',
    price: 159.90,
    compareAtPrice: 199.90,
    category: 'Alimentação',
    subcategory: 'Ração para Gatos',
    brand: 'Premier Pet',
    images: [
      '/products/xk9EaR8w5qQK.jpg',
    ],
    specifications: {
      'Peso': '7.5kg',
      'Sabor': 'Frango',
      'Idade': 'Adulto',
      'Proteína': '32%',
      'Gordura': '12%',
    },
    tags: ['ração', 'gato', 'adulto', 'premier', 'ambientes internos'],
    stock: 140,
    sku: 'CAT-PREMIER-002',
    weight: 7500,
    supplier: 'Premier Pet',
  },
  {
    id: 'prod-006',
    name: 'Ração Golden Gatos Adultos Sabor Salmão 10.1kg',
    description: 'Ração super premium com salmão fresco. Promove pelagem brilhante, saúde urinária e digestão saudável.',
    price: 169.90,
    compareAtPrice: 219.90,
    category: 'Alimentação',
    subcategory: 'Ração para Gatos',
    brand: 'Golden',
    images: [
      '/products/2tsXDmBSQLSt.webp',
    ],
    specifications: {
      'Peso': '10.1kg',
      'Sabor': 'Salmão',
      'Idade': 'Adulto',
      'Proteína': '33%',
      'Gordura': '14%',
    },
    tags: ['ração', 'gato', 'adulto', 'golden', 'salmão'],
    stock: 110,
    sku: 'CAT-GOLDEN-003',
    weight: 10100,
    supplier: 'Golden',
  },
  
  // BRINQUEDOS
  {
    id: 'prod-007',
    name: 'Bola Interativa com Dispenser de Petiscos - Chalesco',
    description: 'Bola interativa que estimula o exercício físico e mental do seu pet. Libera petiscos conforme o animal brinca. Material resistente e atóxico.',
    price: 45.90,
    compareAtPrice: 69.90,
    category: 'Brinquedos',
    subcategory: 'Brinquedos Interativos',
    brand: 'Chalesco',
    images: [
      'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800',
    ],
    specifications: {
      'Material': 'Plástico resistente',
      'Tamanho': 'Médio (8cm)',
      'Cor': 'Variadas',
    },
    tags: ['brinquedo', 'interativo', 'cachorro', 'gato', 'chalesco'],
    stock: 200,
    sku: 'TOY-CHALESCO-001',
    weight: 150,
    supplier: 'Chalesco',
  },
  {
    id: 'prod-008',
    name: 'Kit Veterinário Pet com Acessórios - Brinquedo Educativo',
    description: 'Kit completo de veterinário para crianças brincarem de cuidar dos pets. Inclui diversos acessórios e pelúcias.',
    price: 89.90,
    compareAtPrice: 129.90,
    category: 'Brinquedos',
    subcategory: 'Brinquedos Educativos',
    brand: 'Pet Care',
    images: [
      '/products/I3QVhJIlmm8i.jpg',
    ],
    specifications: {
      'Material': 'Plástico',
      'Itens': '15 peças',
      'Idade': '3+ anos',
    },
    tags: ['brinquedo', 'educativo', 'veterinário', 'kit'],
    stock: 85,
    sku: 'TOY-PETCARE-002',
    weight: 800,
    supplier: 'Pet Care',
  },
  {
    id: 'prod-009',
    name: 'Coleção Miniaturas de Cães e Gatos - 12 Peças',
    description: 'Coleção com 12 miniaturas realistas de diferentes raças de cães e gatos. Perfeito para colecionadores e crianças.',
    price: 54.90,
    compareAtPrice: 79.90,
    category: 'Brinquedos',
    subcategory: 'Miniaturas',
    brand: 'Pet Collection',
    images: [
      '/products/bofPgaLxr1Xc.jpg',
    ],
    specifications: {
      'Material': 'PVC',
      'Quantidade': '12 peças',
      'Tamanho': '3-5cm cada',
    },
    tags: ['miniatura', 'coleção', 'cachorro', 'gato'],
    stock: 150,
    sku: 'TOY-COLLECTION-003',
    weight: 200,
    supplier: 'Pet Collection',
  },
  
  // ACESSÓRIOS
  {
    id: 'prod-010',
    name: 'Coleira Ajustável com Guia Chalesco - Tamanho Médio',
    description: 'Coleira confortável com guia de 1.5m. Material resistente e durável com fecho de segurança. Ajustável para cães de 10-25kg.',
    price: 39.90,
    compareAtPrice: 59.90,
    category: 'Acessórios',
    subcategory: 'Coleiras e Guias',
    brand: 'Chalesco',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
    ],
    specifications: {
      'Material': 'Nylon reforçado',
      'Tamanho': 'Médio',
      'Comprimento da guia': '1.5m',
      'Peso suportado': '10-25kg',
    },
    tags: ['coleira', 'guia', 'cachorro', 'passeio', 'chalesco'],
    stock: 180,
    sku: 'ACC-CHALESCO-001',
    weight: 200,
    supplier: 'Chalesco',
  },
];

// Generate more variations
function generateMoreProducts(): Product[] {
  const moreProducts: Product[] = [];
  let idCounter = 11;
  
  // Adicionar mais 40 produtos variados
  const categories = ['Alimentação', 'Brinquedos', 'Acessórios', 'Higiene e Beleza', 'Saúde e Bem-Estar'];
  const brands = ['Premier Pet', 'Golden', 'Royal Canin', 'Whiskas', 'Chalesco', 'Petz', 'Petlove'];
  
  for (let i = 0; i < 40; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const basePrice = 29.90 + (i * 8);
    
    moreProducts.push({
      id: `prod-${String(idCounter).padStart(3, '0')}`,
      name: `${brand} ${category} Premium - Produto ${idCounter}`,
      description: `Produto de alta qualidade ${brand} para seu pet. Desenvolvido com ingredientes selecionados e tecnologia avançada para garantir o melhor para seu animal de estimação.`,
      price: basePrice,
      compareAtPrice: basePrice + 30,
      category,
      subcategory: `${category} Diversos`,
      brand,
      images: [
        `https://images.unsplash.com/photo-${1589924691995 + i}?w=800`,
      ],
      specifications: {
        'Qualidade': 'Premium',
        'Garantia': '90 dias',
        'Marca': brand,
      },
      tags: [category.toLowerCase(), 'premium', 'pet', brand.toLowerCase()],
      stock: 50 + (i * 3),
      sku: `PROD-${brand.substring(0, 3).toUpperCase()}-${String(idCounter).padStart(3, '0')}`,
      weight: 100 + (i * 50),
      supplier: brand,
    });
    
    idCounter++;
  }
  
  return moreProducts;
}

async function updateProductDatabase() {
  console.log('🚀 Atualizando banco de dados com produtos reais...\n');
  
  const allProducts = [...realProducts, ...generateMoreProducts()];
  
  console.log(`✅ Total de produtos: ${allProducts.length}\n`);
  
  // Criar diretório de produtos
  const productsDir = path.join(__dirname, '../src/data/products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  // Salvar produtos
  const productsFile = path.join(productsDir, 'products.json');
  fs.writeFileSync(productsFile, JSON.stringify(allProducts, null, 2));
  console.log(`✅ Produtos salvos em: ${productsFile}\n`);
  
  // Estatísticas
  const categories = new Map<string, number>();
  allProducts.forEach(product => {
    categories.set(product.category, (categories.get(product.category) || 0) + 1);
  });
  
  console.log('📊 Produtos por categoria:');
  categories.forEach((count, category) => {
    console.log(`   ${category}: ${count} produtos`);
  });
  
  const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalStock = allProducts.reduce((sum, p) => sum + p.stock, 0);
  
  console.log(`\n💰 Valor total do estoque: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  console.log(`📦 Total de unidades: ${totalStock.toLocaleString('pt-BR')}\n`);
  
  console.log('✅ Atualização concluída com sucesso!');
  
  return allProducts;
}

if (require.main === module) {
  updateProductDatabase().catch(console.error);
}

export { updateProductDatabase, realProducts };
