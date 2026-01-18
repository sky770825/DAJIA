import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingLineButton } from '@/components/FloatingLineButton';
import { LeadForm } from '@/components/LeadForm';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { contactInfo } from '@/data/contact';

const ContactPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <div className="container text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              聯絡我們
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              有任何問題或合作需求，歡迎與我們聯繫
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  聯絡方式
                </h2>
                <p className="mt-3 text-muted-foreground">
                  我們的客服團隊將盡快回覆您的訊息
                </p>

                <div className="mt-8 space-y-6">
                  <a
                    href={contactInfo.line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-line/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-line/10 text-line">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">LINE 官方帳號</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.line.id}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">電子郵件</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">客服電話</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">服務地址</p>
                      <p className="text-sm text-muted-foreground">
                        {contactInfo.address.full}<br />
                        （大甲鎮瀾宮）
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
                  <h3 className="font-semibold text-foreground">服務時間</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {contactInfo.serviceHours.weekdays}<br />
                    {contactInfo.serviceHours.weekends}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  線上登記
                </h2>
                <p className="mt-3 text-muted-foreground">
                  留下資料，我們將主動與您聯繫
                </p>
                <div className="mt-8">
                  <LeadForm />
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

export default ContactPage;
