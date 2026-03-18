export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceOffering {
  id: string;
  label: string;
  title: string;
  description: string;
  animationSrc: string;
  animationClassName: string;
  reverse?: boolean;
}

export interface PricingTier {
  name: string;
  description: string;
  price: string;
  suffix: string;
  ctaLabel: string;
  featured?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  animationSrc?: string;
  accentClassName?: string;
  eyebrow?: string;
}

export interface PortfolioItem {
  name: string;
  category: string;
  summary: string;
  icon: string;
  slug: string;
  tags: string[];
  thumbnail: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
  company: string;
  rating: number;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const serviceOfferings: ServiceOffering[] = [
  {
    id: "service-1",
    label: "Core Service 01",
    title: "Custom Software Development",
    description: "End-to-end bespoke software solutions built for scale and performance.",
    animationSrc: "/lottie/software-development-green.json",
    animationClassName: "from-orange-100 to-orange-200",
  },
  {
    id: "service-2",
    label: "Core Service 02",
    title: "AI Agent Development",
    description: "Deploy autonomous AI agents that think, act, and execute complex business tasks 24/7.",
    animationSrc: "/lottie/3dweb.json",
    animationClassName: "from-slate-200 to-slate-300",
    reverse: true,
  },
  {
    id: "service-3",
    label: "Core Service 03",
    title: "Agentic Workflow Automation",
    description: "Eliminate manual operational bottlenecks with intelligent, end-to-end automated workflows.",
    animationSrc: "/lottie/live_chatbot.json",
    animationClassName: "from-orange-100 to-orange-200",
  },
  {
    id: "service-4",
    label: "Core Service 04",
    title: "SaaS Product Development",
    description: "From architecture to deployment, we build scalable Software-as-a-Service platforms.",
    animationSrc: "/lottie/saas.json",
    animationClassName: "from-slate-200 to-slate-300",
    reverse: true,
  },
];

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Ideal for MVP and initial phase builds.",
    price: "$5,000",
    suffix: "USD",
    ctaLabel: "Start Small",
  },
  {
    name: "Growth",
    description: "Scaling operations and advanced AI integrations.",
    price: "$15,000",
    suffix: "USD",
    ctaLabel: "Scale Now",
    featured: true,
  },
  {
    name: "Enterprise",
    description: "Complete digital transformation and custom microservices.",
    price: "$30,000",
    suffix: "USD",
    ctaLabel: "Let's Talk",
  },
];

export const contactServiceOptions: SelectOption[] = [
  { value: "software", label: "Custom Software" },
  { value: "ai", label: "AI Agents" },
  { value: "automation", label: "Workflow Automation" },
  { value: "saas", label: "SaaS Development" },
];

export const contactBudgetOptions: SelectOption[] = [
  { value: "5k", label: "$5,000 USD" },
  { value: "15k", label: "$15,000 USD" },
  { value: "30k", label: "$30,000 USD" },
];

export const homeHeroBadges: string[] = [
  "AI-first engineering",
  "Global product delivery",
  "Transparent build cycles",
];

export const homeStats: StatItem[] = [
  { value: "50+", label: "Projects Delivered", icon: "rocket" },
  { value: "12+", label: "Countries Served", icon: "globe" },
  { value: "4.9★", label: "Client Rating", icon: "star" },
  { value: "6-15", label: "Core Team Members", icon: "users" },
];

export const homeServicePreview: FeatureItem[] = [
  {
    title: "Custom Software Development",
    description: "Business systems, internal tools, and client platforms built to scale cleanly.",
    icon: "code",
    animationSrc: "/lottie/software-development-green.json",
    accentClassName: "border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white/80 to-orange-50/70",
    eyebrow: "Software Systems",
  },
  {
    title: "AI Agent Development",
    description: "Autonomous agents that handle workflows, triage requests, and support decision-making.",
    icon: "spark",
    animationSrc: "/lottie/ai-assistant-animation.json",
    accentClassName: "border-sky-200/70 bg-gradient-to-br from-sky-50/80 via-white/80 to-cyan-50/70",
    eyebrow: "Autonomous Agents",
  },
  {
    title: "Workflow Automation",
    description: "End-to-end automations that remove repetitive manual operations across teams.",
    icon: "flow",
    animationSrc: "/lottie/live_chatbot.json",
    accentClassName: "border-orange-200/70 bg-gradient-to-br from-orange-50/80 via-white/80 to-amber-50/70",
    eyebrow: "Smart Workflows",
  },
  {
    title: "SaaS Product Development",
    description: "Multi-tenant platforms with strong architecture, onboarding, billing, and analytics.",
    icon: "stack",
    animationSrc: "/lottie/saas.json",
    accentClassName: "border-violet-200/70 bg-gradient-to-br from-violet-50/80 via-white/80 to-fuchsia-50/70",
    eyebrow: "Scalable SaaS",
  },
  {
    title: "Mobile App Development",
    description: "Cross-platform mobile experiences for customer engagement and field operations.",
    icon: "mobile",
    animationSrc: "/lottie/mobile-app-promo/animations/12345.json",
    accentClassName: "border-blue-200/70 bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-50/70",
    eyebrow: "Mobile Products",
  },
  {
    title: "Cloud & API Systems",
    description: "Reliable backend services, integrations, and cloud infrastructure for modern products.",
    icon: "cloud",
    animationSrc: "/lottie/cloud.json",
    accentClassName: "border-cyan-200/70 bg-gradient-to-br from-cyan-50/80 via-white/80 to-sky-50/70",
    eyebrow: "Cloud Infrastructure",
  },
];

export const homeDifferentiators: FeatureItem[] = [
  {
    title: "AI-first engineering",
    description: "We design systems with automation and intelligence in mind from the first architecture decision.",
    icon: "spark",
  },
  {
    title: "Global delivery speed",
    description: "Lean execution, async communication, and clear milestones keep momentum high across time zones.",
    icon: "rocket",
  },
  {
    title: "Transparent development process",
    description: "Roadmaps, demos, and feedback loops stay visible so clients know what is shipping and why.",
    icon: "eye",
  },
];

export const homeProcess: FeatureItem[] = [
  {
    title: "Discovery",
    description: "We map business goals, technical constraints, and the highest-value release path.",
    icon: "search",
  },
  {
    title: "Design",
    description: "Product flows, system boundaries, and UX direction are defined before build complexity grows.",
    icon: "pen",
  },
  {
    title: "Build",
    description: "We ship in focused iterations with review points, measurable scope, and engineering discipline.",
    icon: "code",
  },
  {
    title: "Launch",
    description: "Deployment, monitoring, training, and next-step recommendations turn delivery into adoption.",
    icon: "rocket",
  },
];



export const homeTestimonials: TestimonialItem[] = [
  {
    quote: "JANTRA felt like an embedded product team. They moved fast, documented decisions well, and delivered without drama.",
    author: "Amina Rahman",
    role: "Operations Director, Fintech Client",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    company: "Northstar Fintech",
    rating: 5,
  },
  {
    quote: "The difference was clarity. We always knew what was being built, what it solved, and what came next.",
    author: "Daniel Kim",
    role: "Founder, SaaS Startup",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    company: "OrbitOps",
    rating: 5,
  },
  {
    quote: "They helped us turn a messy workflow into a system our team actually trusts and uses daily.",
    author: "Nadia Sultana",
    role: "Head of Delivery, Services Firm",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    company: "Axis Advisory",
    rating: 5,
  },
];

export const homeTechStack: string[] = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "AWS",
  "OpenAI",
  "Flutter",
  "PostgreSQL",
  "TypeScript",
  "Docker",
];
