import { useState } from 'react';
import { Award, Shield, Sparkles } from 'lucide-react';
import { TrustBadge } from '@/components/TrustBadge';
import { ProductCard } from '@/components/ProductCard';
import { HeroSection } from '@/components/HeroSection';
import { StorySection } from '@/components/StorySection';
import { LeadForm } from '@/components/LeadForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { products, categories } from '@/data/products';
import { cn } from '@/lib/utils';

const trustBadges = [
  {
    icon: Award,
    title: '官方聯名授權',
    description: '大甲鎮瀾宮唯一官方授權聯名，每件商品皆有授權編號可查。',
  },
  {
    icon: Shield,
    title: '防偽序號驗證',
    description: '獨家防偽序號系統，掃描即可驗證真偽，杜絕仿冒。',
  },
  {
    icon: Sparkles,
    title: '開光加持工藝',
    description: '由鎮瀾宮主殿開光加持，結合現代精密工藝製作。',
  },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Trust Badges */}
        <section className="border-y border-border bg-card py-12 md:py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-3">
              {trustBadges.map((badge) => (
                <TrustBadge
                  key={badge.title}
                  icon={badge.icon}
                  title={badge.title}
                  description={badge.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                12款官方聯名小物
              </h2>
              <p className="mt-3 text-muted-foreground">
                從隨身護符到居家擺飾，總有一款守護您
              </p>
            </div>

            {/* Category Filter */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'rounded-full px-5 py-2 text-sm font-medium transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <StorySection />

        {/* Lead Form */}
        <section id="lead-form" className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                  立即登記
                </h2>
                <p className="mt-3 text-muted-foreground">
                  留下資料，搶先獲得新品上市通知與專屬優惠
                </p>
              </div>
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default Index;
