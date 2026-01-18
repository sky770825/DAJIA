import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const OrdersPage = () => {
  const [searchOrder, setSearchOrder] = useState('');
  const orders = JSON.parse(localStorage.getItem('dajia-mazu-orders') || '[]');

  const filteredOrders = searchOrder
    ? orders.filter((order: any) =>
        order.orderNumber.toLowerCase().includes(searchOrder.toLowerCase())
      )
    : orders;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-500/20 text-yellow-600', label: '處理中' },
      confirmed: { className: 'bg-blue-500/20 text-blue-600', label: '已確認' },
      shipped: { className: 'bg-purple-500/20 text-purple-600', label: '已出貨' },
      delivered: { className: 'bg-green-500/20 text-green-600', label: '已送達' },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  if (orders.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          <section className="border-b border-border bg-card py-12 md:py-16">
            <div className="container text-center">
              <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                我的訂單
              </h1>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="container">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="mt-6 font-serif text-2xl font-bold text-foreground">
                  尚無訂單記錄
                </h2>
                <p className="mt-3 text-muted-foreground">
                  您還沒有任何訂單記錄
                </p>
                <Button asChild className="mt-8 btn-gold text-primary-foreground">
                  <Link to="/products">前往選購</Link>
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
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              我的訂單
            </h1>
            <p className="mt-2 text-muted-foreground">
              查看您的訂單狀態與詳細資訊
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="py-8">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜尋訂單編號..."
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Orders List */}
        <section className="py-8 md:py-12">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <p className="text-muted-foreground">找不到符合的訂單</p>
                </div>
              ) : (
                filteredOrders
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order: any) => (
                    <Accordion key={order.orderNumber} type="single" collapsible>
                      <AccordionItem value={order.orderNumber} className="rounded-xl border border-border bg-card">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex w-full items-center justify-between pr-4">
                            <div className="text-left">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-foreground">
                                  {order.orderNumber}
                                </h3>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {order.items.length} 件商品
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">
                                NT$ {order.total.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-6 pt-4">
                            {/* Order Items */}
                            <div>
                              <h4 className="mb-4 font-semibold text-foreground">訂單明細</h4>
                              <div className="space-y-3">
                                {order.items.map((item: any) => (
                                  <div key={item.product.id} className="flex gap-3">
                                    <img
                                      src={item.product.image}
                                      alt={item.product.name}
                                      className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground">{item.product.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        數量：{item.quantity} × NT$ {item.product.price.toLocaleString()}
                                      </p>
                                      <p className="text-sm font-semibold text-foreground">
                                        小計：NT$ {(item.product.price * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="rounded-lg border border-border bg-muted/30 p-4">
                              <h4 className="mb-3 font-semibold text-foreground">收貨資訊</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">姓名：</span>
                                  <span className="text-foreground">{order.formData.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-foreground">{order.formData.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-foreground">{order.formData.email}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                  <span className="text-foreground">
                                    {order.formData.city && `${order.formData.city} `}
                                    {order.formData.address}
                                    {order.formData.postalCode && ` (${order.formData.postalCode})`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                              <Button variant="outline" asChild className="flex-1">
                                <Link to={`/order/${order.orderNumber}`}>查看詳情</Link>
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default OrdersPage;
