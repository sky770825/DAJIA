import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { contactInfo } from '@/data/contact';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
                <span className="font-serif text-lg font-bold text-primary">鎮</span>
              </div>
              <div>
                <p className="font-serif font-semibold text-foreground">大甲鎮瀾宮</p>
                <p className="text-xs text-muted-foreground">官方聯名系列</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              傳承三百年媽祖信仰，結合現代工藝設計，每一件商品皆經開光加持，
              讓信仰融入日常生活。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold text-foreground">快速連結</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground transition-colors hover:text-primary">
                  全系列商品
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  關於我們
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-muted-foreground transition-colors hover:text-primary">
                  真偽驗證
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground transition-colors hover:text-primary">
                  配送與退換貨
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  隱私權政策
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-serif text-sm font-semibold text-foreground">聯絡方式</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-line" />
                <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {contactInfo.line.id}
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{contactInfo.address.full}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <p>© 2024 大甲鎮瀾宮官方聯名系列。保留所有權利。</p>
            <p>本網站商品皆為官方授權，請認明防偽序號。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
