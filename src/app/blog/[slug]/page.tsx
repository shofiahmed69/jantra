import Link from "next/link";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin, Github } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // In a real app, this would fetch data based on slug.
    const post = {
        title: "The Future of Agentic Workflows in Enterprise Architecture",
        category: "Engineering",
        readTime: "8 min read",
        author: {
            name: "Alex Mercer",
            role: "Principal AI Architect",
            bio: "Alex leads the AI automation division at JANTRA. He previously spent 6 years at Google building large-scale distributed systems."
        },
        date: "Oct 24, 2024",
        imgColor: "bg-slate-800"
    };

    return (
        <main className="relative w-full min-h-screen pt-24 pb-24 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md">
                            {post.category}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">{post.date}</span>
                        <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                            <Clock className="w-4 h-4" /> {post.readTime}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-10">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-slate-200 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                {post.author.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{post.author.name}</p>
                                <p className="text-sm text-slate-500">{post.author.role}</p>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold hidden md:inline-block">Share</span>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Image */}
                <div className={`w-full aspect-[21/9] ${post.imgColor} rounded-3xl mb-16 flex items-center justify-center relative overflow-hidden shadow-md`}>
                    <div className="text-6xl text-white/5 font-black uppercase tracking-tighter">COVER IMAGE</div>
                </div>

                {/* Grid Layout (TOC + Article) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                    {/* Table of Contents (Sticky) */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32">
                            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-4">Contents</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#intro" className="text-orange-600 font-medium transition-colors border-l-2 border-orange-500 pl-3 block">Introduction</a></li>
                                <li><a href="#pipelines" className="text-slate-500 hover:text-slate-900 transition-colors border-l-2 border-transparent hover:border-slate-300 pl-3 block">The Death of Linear Pipelines</a></li>
                                <li><a href="#agents" className="text-slate-500 hover:text-slate-900 transition-colors border-l-2 border-transparent hover:border-slate-300 pl-3 block">Enter the Autonomous Agent</a></li>
                                <li><a href="#implementation" className="text-slate-500 hover:text-slate-900 transition-colors border-l-2 border-transparent hover:border-slate-300 pl-3 block">Implementation Challenges</a></li>
                                <li><a href="#conclusion" className="text-slate-500 hover:text-slate-900 transition-colors border-l-2 border-transparent hover:border-slate-300 pl-3 block">Conclusion</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Article Content */}
                    <article className="lg:col-span-3 prose prose-slate prose-lg lg:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-2xl">
                        <div id="intro">
                            <p className="lead text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-8">
                                For the last decade, enterprise automation has been defined by rigid, linear pipelines. You receive input A, execute script B, and output C. If anything deviates from the expected schema, the pipeline shatters.
                            </p>
                            <p>
                                This deterministic approach works perfectly for highly structured data and predictable environments. But modern business operates in chaos. Unstructured emails, nuanced customer requests, rapidly changing market data—these inputs require contextual understanding, not just regex parsing.
                            </p>
                        </div>

                        <h2 id="pipelines">The Death of Linear Pipelines</h2>
                        <p>
                            Traditional RPA (Robotic Process Automation) is showing its age. Teams spend more time maintaining fragile selectors and updating business rules than they do building new automations. Scaling these systems results in an unmanageable mesh of interconnected fragility.
                        </p>
                        <blockquote className="border-l-4 border-orange-500 bg-orange-50/50 p-6 rounded-r-xl not-italic italic text-slate-700">
                            "When an automation breaks because a vendor changed the font size on an invoice, you don't have an intelligent system. You have a liability."
                        </blockquote>

                        <h2 id="agents">Enter the Autonomous Agent</h2>
                        <p>
                            Agentic workflows flip the paradigm. Instead of defining the *process*, you define the *goal* and equip the agent with tools (APIs, databases, web search). The LLM-backed agent reasons through the problem, decides which tools to invoke, parses the unstructured data, and iterates until the goal is achieved.
                        </p>

                        {/* Mock Code Block */}
                        <pre className="bg-slate-900 text-slate-300 p-6 rounded-2xl text-sm overflow-x-auto shadow-sm">
                            <code>{`// A traditional declarative pipeline
function processInvoice(file) {
  const data = OCR(file);
  const amount = extractNumber(data, /Amount:\\s*\\$([0-9,.]+)/); // Fragile
  saveToDB({ amount });
}

// An agentic workflow implementation (Pseudo-code)
const agent = new Agent({
  goal: "Extract total amount due and vendor info from this file, then log it.",
  tools: [OCRTool, DateParserTool, DatabaseWriterTool],
  llm: GPT4Object
});
await agent.execute(invoiceFile); // Resilient to layout changes`}</code>
                        </pre>

                        <h2 id="implementation">Implementation Challenges</h2>
                        <p>
                            Transitioning to agentic workflows isn't without hurdles. Hallucinations, latency, and unpredictable API costs are the primary barriers to enterprise adoption. We mitigate these at JANTRA by utilizing strict zero-shot prompting techniques combined with deterministic fallback mechanisms for critical operations.
                        </p>

                        <h2 id="conclusion">Conclusion</h2>
                        <p>
                            The transition from deterministic pipelines to probabilistic, goal-oriented agents represents a paradigm shift in how software interacts with the real world. Organizations that master this transition will move faster and adapt better than those stuck repairing broken XML parsers.
                        </p>
                    </article>
                </div>

                {/* Author Bio Footer */}
                <div className="mt-20 border-t border-slate-200 pt-16">
                    <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-slate-100">
                        <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center font-bold text-3xl text-slate-600 shrink-0">
                            {post.author.name.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-900">{post.author.name}</h3>
                            <p className="text-orange-600 font-medium text-sm mb-4">{post.author.role}</p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                {post.author.bio}
                            </p>
                            <div className="flex justify-center md:justify-start gap-3">
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                                <a href="#" className="text-slate-400 hover:text-orange-600 transition-colors"><Github className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inline CTA */}
                <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-center shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to implement agentic automation?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Speak with our engineering team to discover how LLM-backed workflows can eliminate your operational bottlenecks.
                    </p>
                    <Link href="/contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg active:scale-95">
                        Consult with an Architect
                    </Link>
                </div>

                {/* Return Nav */}
                <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                    <Link href="/blog" className="text-orange-600 font-bold hover:underline underline-offset-4 transition-all">
                        ← Explore more articles
                    </Link>
                </div>

            </div>
        </main>
    );
}
