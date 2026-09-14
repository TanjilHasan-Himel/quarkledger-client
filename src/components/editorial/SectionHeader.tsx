import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
  actionText?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  href,
  actionText = 'সব দেখুন →',
}: SectionHeaderProps) {
  return (
    <div className="w-full mb-8 pb-3 border-b-2 border-ledger-border flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-[var(--orange)] rounded-xs inline-block" />
          {badge && (
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--orange)]">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-ledger-ink tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-body text-xs md:text-sm text-ledger-muted mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="font-mono text-xs font-bold text-[var(--orange)] hover:underline underline-offset-4 tracking-wider uppercase shrink-0 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
