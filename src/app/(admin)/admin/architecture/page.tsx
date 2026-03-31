export default function ArchitecturePage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Architecture & Tech Stack
            </h1>

            {/* Tech Stack Grid */}
            <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Tech Stack
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['React', 'Node.js', 'PostgreSQL', 'Prisma',
                        'TypeScript', 'Tailwind', 'OpenAI', 'Flutter'
                    ].map(tech => (
                        <div key={tech}
                            className="border rounded-xl p-4 text-center
              hover:border-orange-300 cursor-pointer transition-all">
                            <p className="font-medium text-sm text-slate-700">{tech}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming soon note */}
            <div className="bg-orange-50 rounded-2xl p-6">
                <p className="text-orange-600 font-medium">
                    Full architecture management coming soon.
                    For now manage tech stack from here.
                </p>
            </div>
        </div>
    )
}
