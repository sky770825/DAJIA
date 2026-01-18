import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contactInfo } from '@/data/contact';

export function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-pattern-temple py-16 md:py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-pattern-wave" />
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary">官方授權聯名</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            大甲鎮瀾宮
            <br />
            <span className="text-gradient-gold">官方聯名小物系列</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            可驗證 · 防偽序號 · 祈願儀式感
          </p>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            傳承三百年媽祖信仰，結合現代工藝設計。每一件商品皆經開光加持，
            讓信仰融入日常，守護您的每一天。
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-line text-white hover:bg-line/90 sm:w-auto"
              asChild
            >
              <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                加入官方 LINE
              </a>
            </Button>
            <Button
              size="lg"
              onClick={scrollToForm}
              className="w-full btn-gold text-primary-foreground sm:w-auto"
            >
              立即登記
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>12款官方聯名</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>開光加持</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>防偽可查</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
