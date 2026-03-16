
import PricingCard from "@/components/marketing/PricingCard";
import { pricingTiers } from "@/content/site";

export default function CheckoutPage() {
    return (
        <main className="relative w-full min-h-screen overflow-hidden pt-24 md:pt-0">

            {/* Pricing Interface */}
            <section className="relative mx-auto px-4 sm:px-6 z-20 w-full max-w-6xl mt-12 lg:mt-32 mb-24">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">Simple, predictable pricing.</h1>
                    <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">Scale your operations with our transparent engagement models.</p>
                </header>

                {/* Toggle Button UI */}
                <div className="flex justify-center mb-12">
                    <div className="glass-panel p-1 rounded-full flex gap-1">
                        <button className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-medium text-sm transition-all shadow-md">
                            Project
                        </button>
                        <button className="px-6 py-2.5 rounded-full text-slate-600 hover:text-slate-900 font-medium text-sm transition-all">
                            Monthly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {pricingTiers.map((tier) => (
                        <PricingCard key={tier.name} tier={tier} />
                    ))}
                </div>
            </section>
        </main>
    );
}
