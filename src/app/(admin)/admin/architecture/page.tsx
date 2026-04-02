import { Monitor, Cpu, Database, Cloud } from "lucide-react";

export default function ArchitecturePage() {
    const techStack = [
        { name: 'React', category: 'Frontend', icon: Monitor },
        { name: 'Next.js 15', category: 'Framework', icon: Cpu },
        { name: 'Tailwind CSS 4', category: 'Design', icon: Cloud },
        { name: 'TypeScript', category: 'Logic', icon: Cpu },
        { name: 'Node.js', category: 'Backend', icon: Database },
        { name: 'PostgreSQL', category: 'Data', icon: Database },
        { name: 'Prisma', category: 'ORM', icon: Database },
        { name: 'OpenAI', category: 'Intelligence', icon: Cpu },
    ];

    return (
        <div className="space-y-10 animate-fade-up">
            <header className="flex flex-col pt-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Infrastructure</h2>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Architecture & Engineering Standards</p>
            </header>

            <div className="glass-panel p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Current Tech Stack</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Engineering Core</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {techStack.map((tech) => (
                        <div key={tech.name} className="group p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-orange-200 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
                                    <tech.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Active</span>
                            </div>
                            <p className="font-bold text-slate-800 text-lg mb-1">{tech.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{tech.category}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <h4 className="text-xl font-black text-white mb-4">Infrastructure Roadmap</h4>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium">
                        JANTRA Technical Infrastructure is scaling. Full distributed system management, cluster diagnostics, and edge publication controls are currently under development. 
                        Engineering architects are finalizing the next-gen orchestration layer for high-density delivery.
                    </p>
                </div>
            </div>
        </div>
    );
}
