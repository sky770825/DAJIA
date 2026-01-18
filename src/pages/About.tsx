import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Shield, Award, Heart, Sparkles, History, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              關於我們
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              傳承三百年媽祖信仰，結合現代工藝設計
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-12">
              {/* Brand Story */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <History className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    品牌故事
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    大甲鎮瀾宮，創建於清雍正十年（1732年），至今已有近三百年的歷史，
                    是台灣最負盛名的媽祖廟之一。每年農曆三月的大甲媽祖遶境進香活動，
                    更是被譽為「世界三大宗教活動」之一，吸引數百萬信眾參與。
                  </p>
                  <p>
                    為了讓更多信眾能夠將媽祖的庇佑融入日常生活，我們與大甲鎮瀾宮合作，
                    推出官方授權聯名系列商品。每一件商品都經過嚴格的設計審核與開光加持，
                    確保傳承傳統信仰的同時，也能符合現代人的生活需求。
                  </p>
                  <p>
                    我們相信，信仰不應該只存在於廟宇之中，更應該成為日常生活的陪伴。
                    無論是隨身攜帶的護身符，還是家中的擺飾，都能讓您在忙碌的生活中，
                    感受到媽祖的守護與祝福。
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
                  我們的理念
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">官方授權</h3>
                    <p className="text-sm text-muted-foreground">
                      大甲鎮瀾宮唯一官方授權，每件商品皆有授權編號可查
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">開光加持</h3>
                    <p className="text-sm text-muted-foreground">
                      由鎮瀾宮主殿開光加持，結合現代精密工藝製作
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Award className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">品質保證</h3>
                    <p className="text-sm text-muted-foreground">
                      嚴選材質，精緻工藝，每件商品都經過嚴格品質檢驗
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    我們的使命
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    我們致力於傳承與推廣媽祖文化，讓傳統信仰能夠以現代的方式延續下去。
                    透過官方授權聯名商品，我們希望：
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>讓更多年輕世代認識並參與媽祖文化</li>
                    <li>提供高品質、有保障的信仰相關商品</li>
                    <li>結合傳統與現代，創造符合當代需求的產品</li>
                    <li>維護正統信仰，杜絕仿冒商品</li>
                    <li>支持大甲鎮瀾宮的文化傳承與公益事業</li>
                  </ul>
                </div>
              </div>

              {/* Commitment */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    我們的承諾
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">防偽保障</h3>
                      <p className="text-sm text-muted-foreground">
                        每件商品都附有獨特的防偽序號，可透過官網驗證真偽，確保您購買的是正品。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">品質保證</h3>
                      <p className="text-sm text-muted-foreground">
                        所有商品皆經過嚴格品質檢驗，提供一年非人為損壞保固。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Heart className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">用心服務</h3>
                      <p className="text-sm text-muted-foreground">
                        提供完善的售後服務，如有任何問題歡迎隨時聯繫我們。
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">持續創新</h3>
                      <p className="text-sm text-muted-foreground">
                        持續推出新產品，結合傳統文化與現代設計，滿足不同需求。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                  加入我們的行列
                </h2>
                <p className="text-muted-foreground mb-6">
                  一起傳承媽祖文化，讓信仰融入日常生活
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="btn-gold text-primary-foreground">
                    <Link to="/products">瀏覽商品</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">聯絡我們</Link>
                  </Button>
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

export default AboutPage;
