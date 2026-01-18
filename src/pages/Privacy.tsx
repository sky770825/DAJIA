import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { contactInfo } from '@/data/contact';

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              隱私權政策
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              我們重視您的隱私權益
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="prose prose-invert mx-auto max-w-3xl">
              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">一、個人資料蒐集</h2>
                  <p className="mt-3 leading-relaxed">
                    本網站在您自願提供的情況下，蒐集以下個人資料：姓名、聯絡電話、電子郵件、
                    感興趣商品及其他您主動提供的資訊。這些資料僅用於提供您所請求的服務、
                    寄送商品資訊及行銷活動通知。
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">二、資料使用目的</h2>
                  <p className="mt-3 leading-relaxed">
                    您所提供的個人資料將用於以下目的：
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>處理您的商品詢問與登記</li>
                    <li>通知商品上市、促銷活動等相關資訊</li>
                    <li>提供客戶服務與售後支援</li>
                    <li>改善我們的產品與服務</li>
                    <li>依法律規定或主管機關要求提供</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">三、資料保護措施</h2>
                  <p className="mt-3 leading-relaxed">
                    我們採取適當的技術與組織措施保護您的個人資料，防止未經授權的存取、
                    使用或洩露。所有資料傳輸均使用加密技術保護。
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">四、您的權利</h2>
                  <p className="mt-3 leading-relaxed">
                    依據個人資料保護法，您享有以下權利：
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>查詢或請求閱覽您的個人資料</li>
                    <li>請求製給複製本</li>
                    <li>請求補充或更正</li>
                    <li>請求停止蒐集、處理或利用</li>
                    <li>請求刪除</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">五、Cookie 使用</h2>
                  <p className="mt-3 leading-relaxed">
                    本網站使用 Cookie 技術以提供更好的使用體驗，包括記住您的偏好設定、
                    分析網站流量等。您可透過瀏覽器設定管理 Cookie。
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">六、政策更新</h2>
                  <p className="mt-3 leading-relaxed">
                    本隱私權政策可能因應法規變更或服務調整而更新，更新後將於本頁面公告。
                    建議您定期查閱以了解最新內容。
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl font-semibold text-foreground">七、聯絡我們</h2>
                  <p className="mt-3 leading-relaxed">
                    如您對本隱私權政策有任何疑問，或欲行使上述權利，
                    請透過以下方式與我們聯繫：
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6">
                    <li>電子郵件：{contactInfo.email}</li>
                    <li>LINE 官方帳號：{contactInfo.line.id}</li>
                    <li>地址：{contactInfo.address.full}</li>
                  </ul>
                </section>

                <p className="mt-8 text-sm">
                  最後更新日期：2024年1月
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
