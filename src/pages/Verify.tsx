import { useState } from 'react';
import { Search, CheckCircle2, XCircle, HelpCircle, MessageCircle, Package, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { contactInfo } from '@/data/contact';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'fail';

interface VerificationResult {
  code: string;
  product_name?: string;
  order_number?: string;
  created_at: string;
  verified_count: number;
}

const VerifyPage = () => {
  const [serial, setSerial] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!serial.trim()) return;
    
    setStatus('loading');
    setResult(null);

    try {
      // 如果有 Supabase 配置，从数据库查询
      if (supabase) {
        const code = serial.trim().toUpperCase();
        
        // 查询验证码
        const { data, error } = await supabase
          .from('PRIVATE.verification_codes')
          .select('*')
          .eq('code', code)
          .single();

        if (error || !data) {
          setStatus('fail');
          return;
        }

        // 检查状态
        if (data.status !== 'active') {
          setStatus('fail');
          toast({
            title: '驗證碼已失效',
            description: '此驗證碼已被使用或已撤銷',
            variant: 'destructive',
          });
          return;
        }

        // 更新验证次数和验证时间
        const { error: updateError } = await supabase
          .from('PRIVATE.verification_codes')
          .update({
            verified_count: (data.verified_count || 0) + 1,
            verified_at: new Date().toISOString(),
          })
          .eq('code', code);

        if (updateError) {
          console.error('更新验证记录失败:', updateError);
        }

        setResult({
          code: data.code,
          product_name: data.product_name,
          order_number: data.order_number,
          created_at: data.created_at,
          verified_count: (data.verified_count || 0) + 1,
        });
        setStatus('success');
      } else {
        // 如果没有 Supabase，使用模拟验证
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        if (serial.toUpperCase().startsWith('DJ')) {
          setStatus('success');
          setResult({
            code: serial.toUpperCase(),
            created_at: new Date().toISOString(),
            verified_count: 1,
          });
        } else {
          setStatus('fail');
        }
      }
    } catch (error: unknown) {
      console.error('验证失败:', error);
      setStatus('fail');
      const errorMessage = error instanceof Error ? error.message : '無法連接到驗證服務，請稍後再試';
      toast({
        title: '驗證失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setSerial('');
    setStatus('idle');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              真偽驗證
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              輸入商品序號，確認您的商品為官方正品
            </p>
          </div>
        </section>

        {/* Verify Form */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-lg">
              {/* Input */}
              <div className="flex gap-3">
                <Input
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="請輸入防偽序號（如：DJ-2024-XXXXXX）"
                  className="flex-1"
                  disabled={status === 'loading'}
                />
                <Button
                  onClick={handleVerify}
                  disabled={!serial.trim() || status === 'loading'}
                  className="btn-gold text-primary-foreground"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      查詢中
                    </span>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      查詢
                    </>
                  )}
                </Button>
              </div>

              {/* Result Card */}
              <div className="mt-8">
                {status === 'idle' && (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <HelpCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                      尚未查詢
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      請輸入商品包裝上的防偽序號進行查詢
                    </p>
                  </div>
                )}

                {status === 'success' && result && (
                  <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-green-400">
                      驗證成功！
                    </h3>
                    <p className="mt-2 text-sm text-green-300/80">
                      此序號為正品官方聯名商品
                    </p>
                    <div className="mt-6 rounded-lg bg-background/50 p-6 text-left space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          驗證碼
                        </p>
                        <p className="font-mono text-lg font-bold text-foreground mt-1">
                          {result.code}
                        </p>
                      </div>
                      {result.product_name && (
                        <div>
                          <p className="text-xs text-muted-foreground">商品名稱</p>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {result.product_name}
                          </p>
                        </div>
                      )}
                      {result.order_number && (
                        <div>
                          <p className="text-xs text-muted-foreground">訂單編號</p>
                          <p className="text-sm font-mono text-foreground mt-1">
                            {result.order_number}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            驗證時間
                          </p>
                          <p className="text-sm text-foreground mt-1">
                            {new Date().toLocaleString('zh-TW')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">驗證次數</p>
                          <Badge variant="outline" className="mt-1">
                            {result.verified_count} 次
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="mt-6"
                    >
                      查詢其他序號
                    </Button>
                  </div>
                )}

                {status === 'fail' && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-red-400">
                      查無此序號
                    </h3>
                    <p className="mt-2 text-sm text-red-300/80">
                      此序號不在我們的資料庫中，可能為偽品或輸入錯誤
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      如有疑問，請聯繫官方客服確認
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                      >
                        重新查詢
                      </Button>
                      <Button
                        className="bg-line text-white hover:bg-line/90"
                        asChild
                      >
                        <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          聯繫客服
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mt-12 rounded-xl border border-border bg-card/50 p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  如何找到防偽序號？
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      1
                    </span>
                    <span>查看商品包裝盒內側或商品本體</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      2
                    </span>
                    <span>找到以「DJ-」開頭的序號標籤</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      3
                    </span>
                    <span>輸入完整序號或掃描 QR Code 進行驗證</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-card/50 py-12">
          <div className="container text-center">
            <p className="text-muted-foreground">
              還沒有商品？立即加入官方 LINE 了解更多
            </p>
            <Button
              className="mt-4 bg-line text-white hover:bg-line/90"
              asChild
            >
              <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                加入官方 LINE
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingLineButton />
    </div>
  );
};

export default VerifyPage;
