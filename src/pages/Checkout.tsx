import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'credit-card',
  });

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground">購物車是空的</h1>
            <p className="mt-2 text-muted-foreground">請先選購商品</p>
            <Button asChild className="mt-6">
              <Link to="/products">前往選購</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast({
        title: '請填寫完整資訊',
        description: '請確認所有必填欄位都已填寫',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Generate order number
    const orderNumber = `DJ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = {
      order_number: orderNumber,
      items: cartItems,
      total: getTotalPrice() + 100,
      shipping: 100,
      form_data: formData,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // 如果有 Supabase 配置，保存到数据库并生成验证码
    if (supabase) {
      try {
        // 保存订单
        const { error: orderError } = await supabase
          .from('PRIVATE.orders')
          .insert([order]);

        if (orderError) throw orderError;

        // 为每个商品生成验证码
        const verificationCodes = cartItems.flatMap((item) => {
          // 每个商品生成一个验证码
          const codes = [];
          for (let i = 0; i < item.quantity; i++) {
            const code = `DJ-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${i + 1}`;
            codes.push({
              code,
              product_id: item.product.id,
              product_name: item.product.name,
              order_number: orderNumber,
              status: 'active',
              created_at: new Date().toISOString(),
            });
          }
          return codes;
        });

        // 批量插入验证码
        if (verificationCodes.length > 0) {
          const { error: codeError } = await supabase
            .from('PRIVATE.verification_codes')
            .insert(verificationCodes);

          if (codeError) {
            console.error('生成验证码失败:', codeError);
            // 验证码生成失败不影响订单创建
          }
        }
      } catch (error: any) {
        console.error('保存订单失败:', error);
        // 即使数据库保存失败，也继续保存到 localStorage
      }
    }

    // 同时保存到 localStorage 作为备份
    const orders = JSON.parse(localStorage.getItem('dajia-mazu-orders') || '[]');
    orders.push({
      orderNumber,
      items: cartItems,
      total: getTotalPrice() + 100,
      shipping: 100,
      formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('dajia-mazu-orders', JSON.stringify(orders));

    // Clear cart
    clearCart();

    toast({
      title: '訂單已建立',
      description: `訂單編號：${orderNumber}`,
    });

    // Navigate to order confirmation
    navigate(`/order/${orderNumber}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回購物車
              </Link>
            </Button>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              結帳
            </h1>
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="py-8 md:py-12">
            <div className="container">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Form */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Shipping Info */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Truck className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-xl font-bold text-foreground">
                        收貨資訊
                      </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">姓名 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="請輸入姓名"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">電話 *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          placeholder="0912-345-678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">電子郵件 *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="example@email.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">地址 *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                          placeholder="請輸入完整地址"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">縣市</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="台中市"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">郵遞區號</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="437"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">備註</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="如有特殊需求請在此註明"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-xl font-bold text-foreground">
                        付款方式
                      </h2>
                    </div>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">信用卡</span>
                              <Badge variant="outline">推薦</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">支援 Visa、MasterCard、JCB</p>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                          <RadioGroupItem value="line-pay" id="line-pay" />
                          <Label htmlFor="line-pay" className="flex-1 cursor-pointer">
                            <span className="font-medium">LINE Pay</span>
                            <p className="text-sm text-muted-foreground">使用 LINE Pay 快速付款</p>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <span className="font-medium">貨到付款</span>
                            <p className="text-sm text-muted-foreground">商品送達時付款</p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                    <h2 className="font-serif text-xl font-bold text-foreground mb-6">
                      訂單摘要
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="flex gap-3 text-sm">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground line-clamp-2">
                              {item.product.name}
                            </p>
                            <p className="text-muted-foreground">
                              {item.quantity} × NT$ {item.product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">商品小計</span>
                        <span className="font-medium text-foreground">
                          NT$ {getTotalPrice().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">運費</span>
                        <span className="font-medium text-foreground">NT$ 100</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-foreground">總計</span>
                          <span className="text-2xl font-bold text-foreground">
                            NT$ {(getTotalPrice() + 100).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="mt-6 w-full btn-gold text-primary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          處理中...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          確認訂單
                        </>
                      )}
                    </Button>

                    <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <p>
                        所有商品皆為官方授權正品，附有防偽序號可驗證。
                        訂單成立後將發送確認信至您的電子郵件。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default CheckoutPage;
