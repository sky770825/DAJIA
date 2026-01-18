import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <section className="border-b border-border bg-card py-12 md:py-16">
            <div className="container text-center">
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                購物車
              </h1>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">
                  購物車是空的
                </h2>
                <p className="mt-3 text-muted-foreground">
                  還沒有加入任何商品，快去選購吧！
                </p>
                <Button asChild className="mt-8 btn-gold text-primary-foreground">
                  <Link to="/products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    前往選購
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <FloatingLineButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                購物車
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                清空購物車
              </Button>
            </div>
            <p className="mt-2 text-muted-foreground">
              共 {getTotalItems()} 件商品
            </p>
          </div>
        </section>

        {/* Cart Items */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Items List */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 rounded-xl border border-border bg-card p-4 md:p-6"
                    >
                      {/* Image */}
                      <Link
                        to={`/p/${item.product.slug}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted md:h-32 md:w-32"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/p/${item.product.slug}`}
                              className="font-serif text-lg font-semibold text-foreground hover:text-primary"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.product.oneLiner}
                            </p>
                            <p className="mt-2 text-lg font-bold text-foreground">
                              NT$ {item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Control */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">數量：</span>
                            <div className="flex items-center gap-2 rounded-lg border border-border">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            {item.quantity >= item.product.stock && (
                              <Badge variant="outline" className="text-xs">
                                已達庫存上限
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">小計</p>
                            <p className="text-xl font-bold text-foreground">
                              NT$ {(item.product.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    訂單摘要
                  </h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">商品數量</span>
                      <span className="font-medium text-foreground">{getTotalItems()} 件</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">小計</span>
                      <span className="font-medium text-foreground">
                        NT$ {getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">運費</span>
                      <span className="font-medium text-foreground">NT$ 100</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">總計</span>
                        <span className="text-2xl font-bold text-foreground">
                          NT$ {(getTotalPrice() + 100).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="mt-6 w-full btn-gold text-primary-foreground"
                  >
                    <Link to="/checkout">
                      前往結帳
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Link>
                  </Button>

                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      所有商品皆為官方授權正品，附有防偽序號可驗證。
                      如有任何問題，歡迎聯繫客服。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default CartPage;
