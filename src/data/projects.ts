export interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    category: string[];
    tags: string[];
    description: string;
    challenge: string;
    approach: string;
    features: string[];
    techStack: string[];
    results: string;
    duration: string;
    featured: boolean;
    published: boolean;
    order: number;
}

export const projects: Project[] = [
    {
        id: "1",
        title: "NexaFlow CRM",
        slug: "nexaflow-crm",
        client: "NexaFlow Inc",
        category: ["Web", "SaaS"],
        tags: ["React", "Node.js", "PostgreSQL"],
        description: "A workflow-heavy CRM that unified pipeline tracking, reporting, and AI-assisted follow-up.",
        challenge: "The client needed a unified system to track their entire sales pipeline with AI-powered follow-up suggestions.",
        approach: "We built a real-time CRM using React and Node.js with WebSocket updates and an integrated AI module for smart suggestions.",
        features: [
            "Real-time pipeline tracking",
            "AI-assisted follow-up",
            "Custom reporting dashboard",
            "Team collaboration tools",
            "Email integration"
        ],
        techStack: ["React", "Node.js", "PostgreSQL", "WebSockets", "OpenAI"],
        results: "50% increase in sales team efficiency and 30% faster deal closure rate.",
        duration: "3 Months",
        featured: true,
        published: true,
        order: 1
    },
    {
        id: "2",
        title: "PulseAI Assistant",
        slug: "pulseai-assistant",
        client: "PulseAI",
        category: ["AI", "Automation"],
        tags: ["OpenAI", "Python", "FastAPI"],
        description: "An internal assistant that reduced response time and automated team knowledge retrieval.",
        challenge: "The team spent hours searching through documentation and past tickets for answers.",
        approach: "Built a RAG-based AI assistant using OpenAI embeddings and a custom knowledge base with FastAPI backend.",
        features: [
            "Natural language knowledge search",
            "Auto-response suggestions",
            "Slack integration",
            "Document ingestion pipeline",
            "Usage analytics"
        ],
        techStack: ["OpenAI", "Python", "FastAPI", "PostgreSQL", "Slack API"],
        results: "60% reduction in support response time and 40% fewer repeated questions.",
        duration: "2 Months",
        featured: true,
        published: true,
        order: 2
    },
    {
        id: "3",
        title: "AutomateX Platform",
        slug: "automatex-platform",
        client: "AutomateX",
        category: ["Automation", "SaaS"],
        tags: ["PostgreSQL", "AWS", "Node.js"],
        description: "A process orchestration product connecting approvals, notifications, and business data sources.",
        challenge: "Complex multi-step approval workflows were handled manually causing delays and errors.",
        approach: "Built a drag-and-drop workflow builder with Node.js backend and AWS Lambda for scalable execution.",
        features: [
            "Visual workflow builder",
            "Multi-step approvals",
            "Real-time notifications",
            "Third-party integrations",
            "Audit trail logging"
        ],
        techStack: ["Node.js", "PostgreSQL", "AWS Lambda", "React", "Redis"],
        results: "80% reduction in manual process time and zero missed approvals.",
        duration: "4 Months",
        featured: true,
        published: true,
        order: 3
    }
]

export const projectGradients = [
    "from-orange-400 via-red-400 to-pink-500",
    "from-blue-500 via-indigo-500 to-purple-600",
    "from-emerald-400 via-teal-500 to-cyan-600",
    "from-violet-500 via-purple-500 to-pink-600",
    "from-amber-400 via-orange-500 to-red-500",
    "from-cyan-400 via-blue-500 to-indigo-600",
]

export const getProjectGradient = (index: number) =>
    projectGradients[index % projectGradients.length]

export const getProjectBySlug = (slug: string) =>
    projects.find(p => p.slug === slug)

export const getFeaturedProjects = () =>
    projects.filter(p => p.featured)

export const getAllProjects = () =>
    projects.filter(p => p.published)
