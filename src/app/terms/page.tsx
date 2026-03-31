import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <header className="mb-16">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-4 block">Legal</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-slate-500 text-sm">Last Updated: October 2024</p>
                </header>

                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-orange-600">
                    <p className="lead text-xl text-slate-600 mb-10">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and JANTRA ("we," "us" or "our").
                    </p>

                    <h2>1. Service Agreements</h2>
                    <p>
                        JANTRA provides cutting-edge software engineering, artificial intelligence integration, and process automation solutions. Specific deliverables, timelines, and costs for enterprise clients are delineated within standalone Master Service Agreements (MSAs) and Statements of Work (SOWs) executed prior to development.
                    </p>

                    <h2>2. Intellectual Property Ownership</h2>
                    <p>
                        Unless otherwise explicitly stated in an SOW, all source code, algorithms, models, and UI/UX assets delivered by JANTRA become the exclusive intellectual property of the Client upon receipt of full payment.
                    </p>
                    <p>
                        JANTRA retains the right to utilize generic, open-source, or foundational libraries and logic patterns across multiple client projects, provided no proprietary or confidential business logic or data of the Client is exposed.
                    </p>

                    <h2>3. Usage Rules & Prohibited Activities</h2>
                    <p>
                        When utilizing our digital presence or beta-testing our platforms, you agree not to:
                    </p>
                    <ul>
                        <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                        <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                        <li>Circumvent, disable, or otherwise interfere with security-related features.</li>
                        <li>Attempt to reverse-engineer our proprietary Lottie animations, 3D assets, or frontend architectures.</li>
                    </ul>

                    <h2>4. Limitation of Liability</h2>
                    <p>
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or our rendered services.
                    </p>

                    <h2>5. Contact Information</h2>
                    <p>
                        To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:legal@jantra.agency">legal@jantra.agency</a>.
                    </p>
                </article>

            </div>
        </main>
    );
}
