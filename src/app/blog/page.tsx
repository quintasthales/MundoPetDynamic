import { blogPosts, getAllCategories, getAllTags } from "@/lib/blog";
import Link from "next/link";

export default function BlogPage() {
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog MundoPetZen
          </h1>
          <p className="text-xl text-gray-600">
            Dicas, novidades e tudo sobre o mundo pet
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <Link
            href="/blog"
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700"
          >
            Todos
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?categoria=${encodeURIComponent(category)}`}
              className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 border border-gray-200"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Post */}
            {blogPosts.filter((p) => p.featured)[0] && (
              <div className="mb-8">
                <Link
                  href={`/blog/${blogPosts.filter((p) => p.featured)[0].slug}`}
                  className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white text-6xl">📰</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Destaque
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {blogPosts.filter((p) => p.featured)[0].category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">
                      {blogPosts.filter((p) => p.featured)[0].title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {blogPosts.filter((p) => p.featured)[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          {blogPosts.filter((p) => p.featured)[0].author.name}
                        </span>
                        <span>
                          {blogPosts
                            .filter((p) => p.featured)[0]
                            .readTime.toString()}{" "}
                          min de leitura
                        </span>
                      </div>
                      <span>
                        {new Date(
                          blogPosts.filter((p) => p.featured)[0].publishedAt
                        ).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* All Posts */}
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-6 p-6">
                    <div className="w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-4xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.author.name}</span>
                        <span>{post.readTime} min</span>
                        <span>{post.views} visualizações</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                Receba Nossas Novidades
              </h3>
              <p className="text-sm mb-4 text-blue-100">
                Cadastre-se e receba dicas exclusivas sobre cuidados com pets
              </p>
              <input
                type="email"
                placeholder="Seu email"
                className="w-full px-4 py-2 rounded-md text-gray-900 mb-3"
              />
              <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50">
                Inscrever-se
              </button>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Posts Populares
              </h3>
              <div className="space-y-4">
                {blogPosts
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {post.views} visualizações
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Categorias
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const count = blogPosts.filter(
                    (p) => p.category === category
                  ).length;
                  return (
                    <Link
                      key={category}
                      href={`/blog?categoria=${encodeURIComponent(category)}`}
                      className="flex items-center justify-between py-2 hover:text-blue-600"
                    >
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-xs text-gray-500">
                        {count} {count === 1 ? "post" : "posts"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
