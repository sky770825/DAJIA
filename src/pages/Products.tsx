import { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { products, categories } from '@/data/products';
import { cn } from '@/lib/utils';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.oneLiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              全系列商品
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              探索 12 款大甲鎮瀾宮官方聯名小物
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-10 md:py-16">
          <div className="container">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜尋商品名稱、標籤或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      activeCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground"
              >
                <option value="default">預設排序</option>
                <option value="name">名稱排序</option>
                <option value="price-low">價格：低到高</option>
                <option value="price-high">價格：高到低</option>
              </select>
            </div>

            {/* Results count */}
            <p className="mt-6 text-sm text-muted-foreground">
              {searchQuery && `搜尋「${searchQuery}」的結果：`}
              顯示 {sortedProducts.length} 件商品
            </p>

            {/* Grid */}
            {sortedProducts.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-12 text-center py-12">
                <p className="text-lg text-muted-foreground">找不到符合條件的商品</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  請嘗試調整搜尋關鍵字或篩選條件
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default ProductsPage;
