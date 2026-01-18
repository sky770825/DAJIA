import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function TrustBadge({ icon: Icon, title, description, className }: TrustBadgeProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30',
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
      
      <div className="relative">
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
