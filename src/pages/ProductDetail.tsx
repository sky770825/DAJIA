import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MessageCircle, QrCode, Shield, ShoppingCart, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { LeadForm } from '@/components/LeadForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { products } from '@/data/products';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { contactInfo } from '@/data/contact';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">找不到商品</h1>
            <p className="mt-2 text-muted-foreground">此商品可能已下架或網址錯誤</p>
            <Button asChild className="mt-6">
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回商品列表
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const scrollToForm = () => {
    const formElement = document.getElementById('product-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock || product.stock === 0) {
      toast({
        title: '商品缺貨',
        description: '此商品目前缺貨中，請稍後再試',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, 1);
    toast({
      title: '已加入購物車',
      description: `${product.name} 已加入購物車`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card/50">
          <div className="container py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">首頁</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary">商品</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-10 md:py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Image */}
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Official badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5 text-sm font-medium text-primary-foreground">
                  <Shield className="h-4 w-4" />
                  官方聯名
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="border-primary/20 bg-primary/10 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Name */}
                <h1 className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
                  {product.name}
                </h1>

                {/* One-liner */}
                <p className="mt-3 text-xl text-muted-foreground">
                  {product.oneLiner}
                </p>

                {/* Price & Stock */}
                <div className="mt-6 rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">售價</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">
                        NT$ {product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {product.inStock && product.stock > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground">庫存</p>
                          <p className="mt-1 text-lg font-semibold text-green-600">
                            {product.stock > 10 ? '現貨充足' : `僅剩 ${product.stock} 件`}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">庫存</p>
                          <p className="mt-1 text-lg font-semibold text-red-600">缺貨中</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="mt-6 space-y-3">
                  {product.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stock === 0}
                    className="btn-gold text-primary-foreground"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    加入購物車
                  </Button>
                  <Button
                    size="lg"
                    className="bg-line text-white hover:bg-line/90"
                    asChild
                  >
                    <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      加入 LINE 詢問
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={scrollToForm}
                  >
                    立即登記
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specs & Details */}
        <section className="border-t border-border bg-card/50 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible defaultValue="material">
                <AccordionItem value="material">
                  <AccordionTrigger className="font-serif text-lg font-semibold">
                    材質與工藝
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">材質：</span>
                        {product.specs.material}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">工藝：</span>
                        {product.specs.craft}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">尺寸：</span>
                        {product.specs.size}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Usage Steps */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-serif text-2xl font-bold text-foreground">
                使用方式
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                三步祈願，讓信仰融入日常
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {product.steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl border border-border bg-card p-6 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Verify Section */}
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <QrCode className="h-8 w-8" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">
                防偽驗證
              </h2>
              <p className="mt-3 text-muted-foreground">
                每件商品附有專屬防偽序號，可透過官網或掃描 QR Code 驗證真偽，
                保障您購買的是正品官方聯名商品。
              </p>
              <Button asChild variant="outline" className="mt-6 border-primary/30 text-primary">
                <Link to="/verify">
                  <Shield className="mr-2 h-4 w-4" />
                  前往驗證頁面
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-serif text-2xl font-bold text-foreground">
                常見問題
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                關於此商品的疑問解答
              </p>

              <div className="mt-8">
                <Accordion type="single" collapsible>
                  {product.faq.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="product-form" className="border-t border-border bg-card/50 py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  立即登記
                </h2>
                <p className="mt-2 text-muted-foreground">
                  搶先獲得上市通知與專屬優惠
                </p>
              </div>
              <LeadForm preselectedProduct={product.slug} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default ProductDetailPage;
