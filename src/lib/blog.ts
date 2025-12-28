// Blog System

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  tags: string[];
  image: string;
  publishedAt: Date;
  readTime: number;
  views: number;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Dicas Essenciais para Cuidar do Seu Pet no Verão",
    slug: "dicas-cuidar-pet-verao",
    excerpt:
      "O verão chegou e é importante redobrar os cuidados com seu pet. Confira nossas dicas para manter seu amigo saudável e feliz durante os dias quentes.",
    content: `
# 10 Dicas Essenciais para Cuidar do Seu Pet no Verão

O verão é uma época maravilhosa, mas também exige cuidados especiais com nossos pets. As altas temperaturas podem ser perigosas para cães e gatos, por isso é fundamental estar atento.

## 1. Hidratação Constante

Mantenha sempre água fresca e limpa disponível. Troque a água várias vezes ao dia e considere ter múltiplos pontos de água pela casa.

## 2. Evite Passeios nos Horários Mais Quentes

Prefira passear nas primeiras horas da manhã ou no final da tarde. O asfalto quente pode queimar as patinhas do seu pet.

## 3. Nunca Deixe Seu Pet no Carro

Mesmo com as janelas abertas, a temperatura dentro do carro pode subir rapidamente e ser fatal.

## 4. Ofereça Locais Frescos

Garanta que seu pet tenha acesso a áreas com sombra e ventilação. Considere usar ventiladores ou ar-condicionado.

## 5. Banhos Refrescantes

Banhos com água fresca (não gelada) podem ajudar a regular a temperatura corporal.

## 6. Atenção à Alimentação

Pets podem comer menos no calor. Ofereça refeições menores e mais frequentes.

## 7. Proteção Solar

Pets de pelagem clara ou com pele exposta podem precisar de protetor solar específico.

## 8. Exercícios Moderados

Reduza a intensidade dos exercícios durante o verão para evitar exaustão.

## 9. Sinais de Alerta

Fique atento a sinais de insolação: respiração ofegante excessiva, letargia, vômitos.

## 10. Consultas Veterinárias

Mantenha as consultas em dia e não hesite em procurar ajuda se notar algo errado.

Seguindo essas dicas, você garante que seu pet aproveite o verão com segurança e conforto!
    `,
    author: {
      name: "Dr. Carlos Mendes",
      bio: "Veterinário com 15 anos de experiência",
    },
    category: "Saúde",
    tags: ["verão", "cuidados", "saúde", "dicas"],
    image: "/images/blog/verao-pets.jpg",
    publishedAt: new Date("2024-12-15"),
    readTime: 5,
    views: 1234,
    featured: true,
  },
  {
    id: "2",
    title: "Como Escolher a Ração Ideal para Seu Cachorro",
    slug: "escolher-racao-ideal-cachorro",
    excerpt:
      "Escolher a ração certa é fundamental para a saúde do seu cachorro. Aprenda a identificar os melhores ingredientes e tipos de ração.",
    content: `
# Como Escolher a Ração Ideal para Seu Cachorro

A alimentação é um dos pilares mais importantes para a saúde do seu cachorro. Vamos te ajudar a fazer a melhor escolha.

## Tipos de Ração

### Ração Seca (Kibble)
- Mais econômica
- Ajuda na saúde dental
- Longa validade

### Ração Úmida
- Mais palatável
- Maior hidratação
- Ideal para cães com problemas dentários

### Ração Natural
- Ingredientes frescos
- Sem conservantes artificiais
- Mais cara mas muito nutritiva

## O Que Observar no Rótulo

1. **Proteína**: Deve ser o primeiro ingrediente
2. **Grãos**: Evite excesso de milho e trigo
3. **Conservantes**: Prefira naturais
4. **Idade**: Escolha específica para filhote, adulto ou sênior

## Necessidades Especiais

- Cães com alergias
- Problemas renais
- Obesidade
- Gestação

Sempre consulte um veterinário antes de mudar a alimentação do seu pet!
    `,
    author: {
      name: "Dra. Ana Paula",
      bio: "Nutricionista Veterinária",
    },
    category: "Alimentação",
    tags: ["ração", "alimentação", "nutrição", "saúde"],
    image: "/images/blog/racao-cachorro.jpg",
    publishedAt: new Date("2024-12-10"),
    readTime: 7,
    views: 987,
    featured: true,
  },
  {
    id: "3",
    title: "Adestramento Positivo: O Que É e Como Funciona",
    slug: "adestramento-positivo",
    excerpt:
      "Entenda os princípios do adestramento positivo e como aplicá-los para educar seu pet de forma respeitosa e eficaz.",
    content: `
# Adestramento Positivo: O Que É e Como Funciona

O adestramento positivo é uma abordagem moderna e eficaz para educar seu pet, baseada em reforço positivo e respeito.

## Princípios Básicos

- Recompense comportamentos desejados
- Ignore comportamentos indesejados
- Nunca use punição física
- Seja consistente
- Tenha paciência

## Técnicas Principais

### Clicker Training
Use um clicker para marcar o comportamento correto e recompense imediatamente.

### Reforço com Petiscos
Petiscos são ótimos motivadores, mas use com moderação.

### Elogios e Carinho
Muitos cães respondem bem a elogios verbais e carinho.

## Comandos Básicos

1. Senta
2. Fica
3. Vem
4. Deita
5. Junto (para passeios)

## Quando Começar

Quanto mais cedo, melhor! Filhotes podem começar o treinamento básico a partir de 8 semanas.

Lembre-se: cada pet é único e aprende no seu próprio ritmo. Celebre cada pequena conquista!
    `,
    author: {
      name: "João Silva",
      bio: "Adestrador Profissional",
    },
    category: "Comportamento",
    tags: ["adestramento", "comportamento", "treinamento", "educação"],
    image: "/images/blog/adestramento.jpg",
    publishedAt: new Date("2024-12-05"),
    readTime: 6,
    views: 756,
    featured: false,
  },
  {
    id: "4",
    title: "Os Benefícios da Aromaterapia para Pets",
    slug: "aromaterapia-para-pets",
    excerpt:
      "Descubra como a aromaterapia pode ajudar a acalmar e relaxar seu pet, melhorando sua qualidade de vida.",
    content: `
# Os Benefícios da Aromaterapia para Pets

A aromaterapia não é apenas para humanos! Seu pet também pode se beneficiar dessa prática milenar.

## O Que É Aromaterapia

Uso de óleos essenciais naturais para promover bem-estar físico e emocional.

## Benefícios para Pets

- Redução de ansiedade
- Melhora do sono
- Alívio de estresse
- Repelente natural de insetos
- Melhora do humor

## Óleos Seguros para Pets

### Para Cães
- Lavanda (calmante)
- Camomila (relaxante)
- Cedro (repelente)

### Para Gatos
- Valeriana (calmante)
- Hortelã (estimulante suave)

⚠️ **Atenção**: Nunca aplique óleos essenciais diretamente na pele do pet. Use sempre diluído e em difusores.

## Como Usar

1. Difusor ultrassônico
2. Spray ambiente
3. Coleira aromática

## Quando Evitar

- Pets grávidas
- Filhotes muito jovens
- Animais com problemas respiratórios

Consulte sempre um veterinário antes de usar aromaterapia com seu pet!
    `,
    author: {
      name: "Dra. Mariana Costa",
      bio: "Veterinária Holística",
    },
    category: "Bem-Estar",
    tags: ["aromaterapia", "bem-estar", "saúde natural", "óleos essenciais"],
    image: "/images/blog/aromaterapia.jpg",
    publishedAt: new Date("2024-12-01"),
    readTime: 5,
    views: 543,
    featured: true,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured).slice(0, 3);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter((post) => post.id !== currentPost.id)
    .filter(
      (post) =>
        post.category === currentPost.category ||
        post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map((post) => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(blogPosts.flatMap((post) => post.tags)));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
