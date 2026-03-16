import LottiePlayer from "@/components/LottiePlayer";
import Link from "next/link";
import {
    Code, Smartphone, Bot, MessageSquare, Workflow,
    Cloud, Network, BarChart, Layout, Server, CheckCircle
} from "lucide-react";

const services = [
    {
        title: "Custom Software Development",
        slug: "custom-software-development",
        description: "End-to-end bespoke software solutions built for scale and performance.",
        icon: Code,
        lottieSrc: "/lottie/cloud.json",
        bgGradient: "bg-gradient-to-br from-orange-100 to-orange-200",
        features: ["Full-stack development", "Scalable architecture design", "Comprehensive QA & testing"],
        industries: ["Finance", "Healthcare", "E-commerce"]
    },
    {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "High-performance native and cross-platform mobile applications that users love.",
        icon: Smartphone,
        lottieSrc: "/lottie/app-development.json",
        bgGradient: "bg-gradient-to-tr from-slate-200 to-slate-300",
        features: ["iOS & Android platforms", "React Native & Flutter", "Intuitive UI/UX implementation"],
        industries: ["Retail", "Social Apps", "Tech"]
    },
    {
        title: "AI Agent Development",
        slug: "ai-agent-development",
        description: "Deploy autonomous AI agents that think, act, and execute complex business tasks 24/7.",
        icon: Bot,
        lottieSrc: "/lottie/assistant-bot.json",
        bgGradient: "bg-gradient-to-br from-orange-100 to-orange-200",
        features: ["Autonomous execution", "LLM integration", "Custom decision capabilities"],
        industries: ["Finance", "Operations", "Logistics"]
    },
    {
        title: "AI Chatbots & Virtual Assistants",
        slug: "ai-chatbots-virtual-assistants",
        description: "Intelligent conversational interfaces that support customers and drive sales.",
        icon: MessageSquare,
        lottieSrc: "/lottie/live-chatbot.json",
        bgGradient: "bg-gradient-to-tr from-slate-200 to-slate-300",
        features: ["Advanced NLP processing", "24/7 automated support", "Multi-channel integration"],
        industries: ["Customer Service", "Retail", "Healthcare"]
    },
    {
        title: "Agentic Workflow Automation",
        slug: "agentic-workflow-automation",
        description: "Eliminate manual operational bottlenecks with intelligent, end-to-end automated workflows.",
        icon: Workflow,
        lottieSrc: "/lottie/automatic.json",
        bgGradient: "bg-gradient-to-br from-orange-100 to-orange-200",
        features: ["Process mapping", "AI orchestration", "Third-party systems integration"],
        industries: ["Enterprise", "Logistics", "Manufacturing"]
    },
    {
        title: "SaaS Product Development",
        slug: "saas-product-development",
        description: "From architecture to deployment, we build scalable Software-as-a-Service platforms.",
        icon: Cloud,
        lottieSrc: "/lottie/saas.json",
        bgGradient: "bg-gradient-to-tr from-slate-200 to-slate-300",
        features: ["Multi-tenant architecture", "Subscription management", "Scalable database design"],
        industries: ["B2B Tech", "Education", "Marketing"]
    },
    {
        title: "API & Microservices Development",
        slug: "api-microservices-development",
        description: "Robust backend systems and APIs to connect and power your digital ecosystem.",
        icon: Network,
        lottieSrc: "/lottie/3d-web.json",
        bgGradient: "bg-gradient-to-br from-orange-100 to-orange-200",
        features: ["REST & GraphQL APIs", "Microservices architecture", "Advanced API security"],
        industries: ["Fintech", "Enterprise", "Media"]
    },
    {
        title: "Business Intelligence Dashboards",
        slug: "business-intelligence-dashboards",
        description: "Actionable insights through beautiful, real-time data visualization platforms.",
        icon: BarChart,
        lottieSrc: "/lottie/bpo-3d.json",
        bgGradient: "bg-gradient-to-tr from-slate-200 to-slate-300",
        features: ["Real-time analytics", "Custom reporting metrics", "Interactive visualizations"],
        industries: ["Finance", "Marketing", "Sales"]
    },
    {
        title: "UI/UX Design & Product Design",
        slug: "ui-ux-design",
        description: "User-centric design that creates intuitive and engaging digital experiences.",
        icon: Layout,
        lottieSrc: "/lottie/uxui-d.json",
        bgGradient: "bg-gradient-to-br from-orange-100 to-orange-200",
        features: ["Wireframing & journey mapping", "High-fidelity prototyping", "Usability testing"],
        industries: ["Consumer Tech", "E-commerce", "SaaS"]
    },
    {
        title: "Cloud Migration & Management",
        slug: "cloud-migration-management",
        description: "Secure, efficient transition to cloud infrastructure with ongoing optimization.",
        icon: Server,
        lottieSrc: "/lottie/cloud-animation.json",
        bgGradient: "bg-gradient-to-tr from-slate-200 to-slate-300",
        features: ["AWS/Azure/GCP expertise", "Comprehensive security audits", "Infrastructure cost optimization"],
        industries: ["IT", "Healthcare", "Government"]
    }
];

export default function ServicesPage() {
    return (
        <main className="relative w-full overflow-x-hidden">
            {/* Hero Section */}
            <header className="pt-32 md:pt-48 pb-10 md:pb-16 text-center px-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-slate-900 mb-4 md:mb-6">
                    Elevating Reality
                </h1>
                <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto">
                    JANTRA delivers spatial computing solutions that bridge the gap between physical and digital dimensions.
                </p>
            </header>

            {/* Services List */}
            {services.map((service, index) => {
                const isEven = index % 2 === 0;

                return (
                    <section key={service.slug} className="relative w-full py-16 md:py-24 lg:min-h-[550px] xl:min-h-[600px]" id={`service-${index + 1}`}>
                        <div className="container mx-auto px-6 relative">
                            {/* Mobile: stacked layout, Desktop: side-by-side flex layout */}
                            <div className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'} items-center gap-6 lg:gap-10 relative`}>
                                <div className={`w-full lg:w-[45%] h-[200px] sm:h-[250px] lg:h-[350px] xl:h-[400px] z-10 rounded-[2rem] ${service.bgGradient} overflow-hidden flex items-center justify-center shadow-lg relative shrink-0`}>
                                    <LottiePlayer src={service.lottieSrc} className="w-[85%] h-[85%]" />
                                </div>

                                {/* Glass Content Card */}
                                <div className={`w-full lg:w-[55%] z-20 glass-panel bg-white/70 lg:bg-white/60 backdrop-blur-xl border border-white/50 p-6 sm:p-7 lg:p-8 xl:p-10 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]`}>
                                    <div className="flex items-center gap-3 mb-4 lg:mb-5">
                                        <div className="p-2.5 bg-white shadow-sm text-orange-600 rounded-xl">
                                            <service.icon className="w-5 h-5 lg:w-6 h-6" />
                                        </div>
                                        <span className="text-orange-600 font-bold tracking-widest text-[10px] md:text-xs uppercase bg-orange-100/50 px-3 py-1.5 rounded-full inline-block">
                                            Core Service {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-slate-900 leading-tight">
                                        {service.title}
                                    </h2>

                                    <p className="text-slate-600 leading-relaxed mb-6 text-sm lg:text-base">
                                        {service.description}
                                    </p>

                                    {/* Feature list */}
                                    <div className="mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Key Capabilities</h4>
                                        <ul className="space-y-2">
                                            {service.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                                                    <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                                    <span className="font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Industry tags */}
                                    <div className="mb-6 lg:mb-8">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">Industries</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {service.industries.map((industry, iIdx) => (
                                                <span key={iIdx} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full font-medium shadow-sm">
                                                    {industry}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 border-dashed">
                                        <Link href={`/services/${service.slug}`} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full hover:shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] transition-all font-bold text-sm active:scale-95 group">
                                            <span>Explore Case Studies</span>
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}

        </main>
    );
}
