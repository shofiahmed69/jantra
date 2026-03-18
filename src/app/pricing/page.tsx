import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingPage() {
    const tiers = [
        {
            name: "Starter",
            price: "$5,000 USD",
            desc: "Perfect for MVPs and early-stage startups needing robust technical foundations.",
            features: [
                "UI/UX Design & Prototyping",
                "Frontend Web/Mobile App",
                "Basic Backend Architecture",
                "Standard 3rd-party Integrations",
                "1 Month Post-Launch Support"
            ],
            highlighted: false
        },
        {
            name: "Growth",
            price: "$15,000 USD",
            desc: "For scaling businesses requiring advanced functionality, AI, and complex infrastructure.",
            features: [
                "Complex Multi-platform App",
                "AI Agent / LLM Integration",
                "Microservices Architecture",
                "Advanced Security Implementations",
                "Complex Data Pipelines",
                "3 Months Post-Launch SLA"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "$30,000 USD",
            desc: "Mission-critical systems designed for massive scale and compliance.",
            features: [
                "Full-stack Enterprise Rebuilds",
                "Custom LLM Fine-tuning",
                "High-Frequency Trading Infra",
                "Agentic Autonomous Workflows",
                "Dedicated Engineering Team",
                "24/7 Priority Support SLA"
            ],
            highlighted: false
        }
    ];

    const faqs = [
        { q: "How do you estimate software costs?", a: "We conduct a deep-dive discovery phase to outline requirements, architectures, and timelines. The complexity and hours required dictate the final fixed-price or time-and-materials contract." },
        { q: "Do you offer monthly retainers?", a: "Yes, beyond project-based work, we offer dedicated engineering retainers for continuous development and maintenance, starting at $2,500 USD/month." },
        { q: "What is your payment structure?", a: "Typically, we divide payments into milestones: 30% upfront, and the remainder distributed across designated delivery phases." },
    ];

    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-4 block">Investment</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        Transparent pricing for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">premium engineering.</span>
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
                        We don't build cheap templates. We architect scalable, mission-critical technology.
                        Every project scope is custom, falling into three general tiers.
                    </p>
                </header>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-32">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`relative rounded-[2.5rem] p-8 md:p-10 ${tier.highlighted
                            ? "bg-slate-900 text-white shadow-2xl transform lg:-translate-y-4 border border-slate-700"
                            : "bg-white border border-slate-200 text-slate-900 shadow-sm"
                            }`}>
                            {tier.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    Most Common
                                </div>
                            )}

                            <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                            <p className={`text-sm mb-8 min-h-[40px] ${tier.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{tier.desc}</p>

                            <div className="mb-8 pb-8 border-b border-slate-200/20">
                                <span className="text-4xl md:text-5xl font-black tracking-tight">{tier.price}</span>
                                <span className={`text-sm font-medium ml-2 ${tier.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>starting from</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {tier.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${tier.highlighted ? 'text-orange-400' : 'text-orange-500'}`} />
                                        <span className={`text-sm font-medium ${tier.highlighted ? 'text-slate-300' : 'text-slate-700'}`}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/contact" className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold transition-all ${tier.highlighted
                                ? "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)]"
                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                }`}>
                                Get a Quote <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <section className="max-w-4xl mx-auto mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.q}</h3>
                                <p className="text-slate-600 leading-relaxed disabled">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="text-center">
                    <p className="text-slate-500 font-medium mb-4">Need a dedicated team instead of a fixed project?</p>
                    <Link href="/contact" className="text-orange-600 font-bold hover:underline underline-offset-4">
                        Ask about our Team Augmentation plans.
                    </Link>
                </div>

            </div>
        </main>
    );
}
