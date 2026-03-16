import type { PricingTier } from "@/content/site";

interface PricingCardProps {
  tier: PricingTier;
}

export default function PricingCard({ tier }: PricingCardProps) {
  const cardClassName = tier.featured
    ? "glass-panel p-8 shadow-[0_8px_32px_0_rgba(251,146,60,0.15)] border border-orange-200/50 rounded-[2rem] relative transform md:-translate-y-4"
    : "glass-panel p-8 shadow-[0_8px_32px_0_rgba(251,146,60,0.05)] rounded-[2rem]";
  const headingClassName = tier.featured ? "text-lg md:text-xl font-bold text-orange-600 mb-2" : "text-lg md:text-xl font-bold text-slate-900 mb-2";
  const dividerClassName = tier.featured ? "mb-8 border-b border-orange-200/30 pb-6" : "mb-8 border-b border-white/30 pb-6";
  const buttonClassName = tier.featured
    ? "w-full py-3 md:py-4 rounded-xl md:rounded-2xl shimmer-orange text-white font-bold transition-all shadow-lg hover:shadow-orange-300"
    : "w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/40 border border-white/60 text-slate-800 hover:bg-white/60 font-semibold transition-all";

  return (
    <div className={cardClassName}>
      {tier.featured ? (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-lg">
          Most Popular
        </div>
      ) : null}
      <h3 className={headingClassName}>{tier.name}</h3>
      <p className="text-sm text-slate-500 mb-6 h-10">{tier.description}</p>
      <div className={dividerClassName}>
        <span className="text-3xl md:text-4xl font-bold text-slate-900">{tier.price}</span>
        <span className="text-slate-400 text-xs ml-1">{tier.suffix}</span>
      </div>
      <button className={buttonClassName}>{tier.ctaLabel}</button>
    </div>
  );
}
