import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { contactInfo } from '@/data/contact';

const navItems = [
  { label: '首頁', href: '/' },
  { label: '全系列商品', href: '/products' },
  { label: '關於我們', href: '/about' },
  { label: '真偽驗證', href: '/verify' },
  { label: '聯絡我們', href: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10">
            <span className="font-serif text-lg font-bold text-primary">鎮</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-serif text-sm font-semibold leading-tight text-foreground">大甲鎮瀾宮</p>
            <p className="text-xs text-muted-foreground">官方聯名系列</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors hover:text-primary',
                location.pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="hidden bg-line text-white hover:bg-line/90 sm:inline-flex"
            asChild
          >
            <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
              加入官方LINE
            </a>
          </Button>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-3 text-sm font-medium transition-colors hover:bg-muted',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2 px-4">
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  購物車 {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
              </Button>
              <Button
                variant="default"
                className="w-full bg-line text-white hover:bg-line/90"
                asChild
              >
                <a href={contactInfo.line.url} target="_blank" rel="noopener noreferrer">
                  加入官方LINE
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
