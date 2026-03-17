export interface Project {
    id: number;
    title: string;
    slug: string;
    client: string;
    thumbnail: string;
    category: string[];
    tags: string[];
    description: string;
    challenge: string;
    approach: string;
    features: string[];
    techStack: string[];
    results: string;
    featured: boolean;
    published: boolean;
}

export const projects: Project[] = [
    {
        id: 1,
        title: "NexaFlow CRM",
        slug: "nexaflow-crm",
        client: "NexaFlow",
        thumbnail: "/projects/nexaflow.jpg",
        category: ["Web", "SaaS"],
        tags: ["React", "Node.js"],
        description: "A workflow-heavy CRM that unified pipeline tracking, reporting, and AI-assisted follow-up.",
        challenge: "Client needed unified pipeline tracking",
        approach: "Built with React and Node.js",
        features: ["Pipeline tracking", "AI follow-up", "Reporting dashboard"],
        techStack: ["React", "Node.js", "PostgreSQL"],
        results: "50% increase in sales efficiency",
        featured: true,
        published: true
    },
    {
        id: 2,
        title: "PulseAI Assistant",
        slug: "pulseai-assistant",
        client: "PulseAI",
        thumbnail: "/projects/pulseai.jpg",
        category: ["AI", "Automation"],
        tags: ["OpenAI", "Python"],
        description: "An internal assistant that reduced response time and automated team knowledge retrieval.",
        challenge: "Team needed faster knowledge retrieval",
        approach: "Built with OpenAI and Python",
        features: ["Knowledge retrieval", "Auto-response", "Team integration"],
        techStack: ["OpenAI", "Python", "FastAPI"],
        results: "60% reduction in response time",
        featured: true,
        published: true
    },
    {
        id: 3,
        title: "AutomateX Platform",
        slug: "automatex-platform",
        client: "AutomateX",
        thumbnail: "/projects/automatex.jpg",
        category: ["Automation", "SaaS"],
        tags: ["PostgreSQL", "AWS"],
        description: "A process orchestration product connecting approvals, notifications, and business data sources.",
        challenge: "Complex approval workflows needed",
        approach: "Built with PostgreSQL and AWS",
        features: ["Process orchestration", "Notifications", "Data integration"],
        techStack: ["PostgreSQL", "AWS", "Node.js"],
        results: "80% reduction in manual processes",
        featured: true,
        published: true
    }
]

export const getFeaturedProjects = () =>
    projects.filter(p => p.featured).slice(0, 3)

export const getAllProjects = () =>
    projects.filter(p => p.published)
