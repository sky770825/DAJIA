import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { Package, Truck, RotateCcw, Shield, Clock, MessageCircle } from 'lucide-react';
import { contactInfo } from '@/data/contact';
import { Link } from 'react-router-dom';

const ShippingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              配送與退換貨政策
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              了解我們的配送方式與退換貨流程
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl space-y-12">
              {/* Shipping Info */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    配送資訊
                  </h2>
                </div>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">配送方式</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>宅配到府：使用黑貓宅急便或新竹物流配送</li>
                      <li>超商取貨：7-ELEVEN、全家、萊爾富、OK 超商</li>
                      <li>門市自取：可至大甲鎮瀾宮指定地點自取（需提前預約）</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">配送時間</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>一般地區：下單後 3-5 個工作天出貨</li>
                      <li>偏遠地區：下單後 5-7 個工作天出貨</li>
                      <li>特殊節日（如媽祖遶境期間）可能延遲 1-2 個工作天</li>
                      <li>出貨後將發送簡訊通知，可追蹤物流狀態</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">運費說明</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>單筆訂單滿 NT$ 1,500 免運費</li>
                      <li>未滿額運費：NT$ 100（宅配）或 NT$ 60（超商取貨）</li>
                      <li>門市自取免運費</li>
                      <li>離島地區運費另計，請聯繫客服</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">配送注意事項</p>
                        <p className="mt-2 text-sm">
                          商品皆為開光加持物品，請保持恭敬心態。收到商品後請檢查包裝是否完整，
                          如有破損請立即拍照並聯繫客服處理。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Policy */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    退換貨政策
                  </h2>
                </div>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">退換貨期限</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>收到商品後 7 天內可申請退換貨</li>
                      <li>需保持商品原狀、包裝完整、未使用、未開封</li>
                      <li>防偽序號標籤需完整無損</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">可退換貨情況</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>商品有瑕疵或損壞</li>
                      <li>商品與訂單不符</li>
                      <li>配送過程中包裝破損導致商品受損</li>
                      <li>非人為因素造成的品質問題</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">不可退換貨情況</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>已開封使用或破壞包裝完整性</li>
                      <li>防偽序號標籤已撕除或損壞</li>
                      <li>人為因素造成的損壞（如摔落、碰撞等）</li>
                      <li>超過 7 天退換貨期限</li>
                      <li>個人主觀不喜歡（商品本身無瑕疵）</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">退換貨流程</h3>
                    <ol className="space-y-2 list-decimal pl-6">
                      <li>聯繫客服（LINE 或 Email）說明退換貨原因</li>
                      <li>提供訂單編號、商品照片及問題說明</li>
                      <li>客服確認後提供退貨地址或換貨指示</li>
                      <li>將商品包裝完整寄回（運費由我們負擔）</li>
                      <li>收到商品後 3-5 個工作天內完成退款或換貨</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">退款說明</p>
                        <p className="mt-2 text-sm">
                          退款將退回原付款方式。信用卡退款約 7-14 個工作天入帳，
                          貨到付款退款將以匯款方式處理。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warranty */}
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    保固與售後服務
                  </h2>
                </div>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">保固期限</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>所有商品提供一年非人為損壞保固</li>
                      <li>保固範圍：材質瑕疵、工藝缺陷、電鍍脫落（非人為刮傷）</li>
                      <li>需保留購買證明（訂單編號）及防偽序號</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">售後服務</h3>
                    <ul className="space-y-2 list-disc pl-6">
                      <li>商品使用問題諮詢</li>
                      <li>開光儀式相關問題解答</li>
                      <li>商品保養建議</li>
                      <li>定期回廟過香爐提醒服務（可加入 LINE 接收通知）</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">需要協助？</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  如有任何配送或退換貨相關問題，歡迎聯繫我們
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={contactInfo.line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-line px-4 py-2 text-sm font-medium text-white hover:bg-line/90"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    聯繫客服
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    查看聯絡方式
                  </Link>
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

export default ShippingPage;
