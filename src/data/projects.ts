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

export const projects: Project[] = [];

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
