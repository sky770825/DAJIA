import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  // Load order from localStorage
  const orders = JSON.parse(localStorage.getItem('dajia-mazu-orders') || '[]');
  const order = orders.find((o: any) => o.orderNumber === orderNumber);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">找不到訂單</h1>
            <p className="mt-2 text-muted-foreground">訂單編號不存在或已過期</p>
            <Button asChild className="mt-6">
              <Link to="/">返回首頁</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Success Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="mt-6 font-serif text-3xl font-bold text-foreground md:text-4xl">
                訂單已確認！
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                感謝您的購買，我們已收到您的訂單
              </p>
              <div className="mt-6 rounded-xl border border-border bg-card/50 p-4">
                <p className="text-sm text-muted-foreground">訂單編號</p>
                <p className="mt-1 font-mono text-xl font-bold text-foreground">
                  {order.orderNumber}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-8">
              {/* Order Items */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    訂單明細
                  </h2>
                </div>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.product.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          數量：{item.quantity} × NT$ {item.product.price.toLocaleString()}
                        </p>
                        <p className="text-lg font-bold text-foreground mt-2">
                          NT$ {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-foreground">總計</span>
                    <span className="text-2xl font-bold text-foreground">
                      NT$ {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    收貨資訊
                  </h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-foreground w-20">姓名：</span>
                    <span className="text-foreground">{order.formData.name}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground w-20">電話：</span>
                    <span className="text-foreground">{order.formData.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground w-20">Email：</span>
                    <span className="text-foreground">{order.formData.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground w-20">地址：</span>
                    <span className="text-foreground">
                      {order.formData.city && `${order.formData.city} `}
                      {order.formData.address}
                      {order.formData.postalCode && ` (${order.formData.postalCode})`}
                    </span>
                  </div>
                  {order.formData.notes && (
                    <div className="flex items-start gap-3">
                      <span className="text-muted-foreground w-20">備註：</span>
                      <span className="text-foreground">{order.formData.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                  付款資訊
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">付款方式</span>
                  <Badge variant="outline">
                    {order.formData.paymentMethod === 'credit-card' && '信用卡'}
                    {order.formData.paymentMethod === 'line-pay' && 'LINE Pay'}
                    {order.formData.paymentMethod === 'cod' && '貨到付款'}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-muted-foreground">訂單狀態</span>
                  <Badge className="bg-yellow-500/20 text-yellow-600">
                    {order.status === 'pending' && '處理中'}
                    {order.status === 'confirmed' && '已確認'}
                    {order.status === 'shipped' && '已出貨'}
                    {order.status === 'delivered' && '已送達'}
                  </Badge>
                </div>
              </div>

              {/* Next Steps */}
              <div className="rounded-xl border border-border bg-muted/30 p-6">
                <h3 className="font-semibold text-foreground mb-3">接下來會發生什麼？</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. 我們將在 1-2 個工作天內處理您的訂單</li>
                  <li>2. 訂單確認後，我們會發送確認信至您的電子郵件</li>
                  <li>3. 商品出貨時，您將收到出貨通知</li>
                  <li>4. 每件商品都附有防偽序號，可至官網驗證</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/orders">查看所有訂單</Link>
                </Button>
                <Button asChild className="flex-1 btn-gold text-primary-foreground">
                  <Link to="/products">
                    繼續購物
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
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

export default OrderConfirmationPage;
