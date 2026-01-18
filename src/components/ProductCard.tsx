import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';
import { Product } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock || product.stock === 0) {
      toast({
        title: '商品缺貨',
        description: '此商品目前缺貨中，請稍後再試',
        variant: 'destructive',
      });
      return;
    }

    addToCart(product, 1);
    toast({
      title: '已加入購物車',
      description: `${product.name} 已加入購物車`,
    });
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 card-hover',
        className
      )}
      style={style}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="destructive" className="text-sm">缺貨中</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-xs text-primary"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Name */}
        <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
          {product.name}
        </h3>

        {/* One-liner */}
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {product.oneLiner}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">NT$ {product.price.toLocaleString()}</span>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-500">僅剩 {product.stock} 件</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to={`/p/${product.slug}`}>
              看詳情
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock || product.stock === 0}
            className="btn-gold text-primary-foreground"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
