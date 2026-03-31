import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="relative w-full min-h-screen pt-32 pb-24 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <header className="mb-16">
                    <span className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-4 block">Legal</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 text-sm">Last Updated: October 2024</p>
                </header>

                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-orange-600">
                    <p className="lead text-xl text-slate-600 mb-10">
                        At JANTRA ("we", "us", "our"), we respect your privacy and are committed to protecting the personal data of our users and enterprise partners.
                    </p>

                    <h2>1. Data Collection Practices</h2>
                    <p>
                        We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
                    </p>
                    <ul>
                        <li><strong>Contact Forms:</strong> Name, email address, company details, budgetary metrics, and project requirements.</li>
                        <li><strong>Analytics:</strong> General demographic data, browser type, and interaction metrics used exclusively to improve the platform experience.</li>
                        <li><strong>Telemetry Data:</strong> For enterprise SaaS clients, we monitor system load, concurrent connections, and API latency to ensure SLA compliance.</li>
                    </ul>

                    <h2>2. Cookie Usage</h2>
                    <p>
                        We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                    </p>
                    <p>
                        <strong>Essential Cookies:</strong> Required for the website to function securely. <br />
                        <strong>Analytics Cookies:</strong> Utilized anonymously to measure traffic sources and session length.
                    </p>

                    <h2>3. GDPR Compliance & User Rights</h2>
                    <p>
                        If you are a resident of the European Economic Area (EEA) or United Kingdom (UK), you have certain data protection rights under the General Data Protection Regulation (GDPR).
                        JANTRA strictly abides by these frameworks regarding the collection, transmission, and deletion of your data.
                    </p>
                    <ul>
                        <li>The right to access, update or to delete the information we have on you.</li>
                        <li>The right of rectification.</li>
                        <li>The right to object.</li>
                        <li>The right of restriction.</li>
                        <li>The right to data portability.</li>
                        <li>The right to withdraw consent.</li>
                    </ul>

                    <h2>4. How to Contact Us</h2>
                    <p>
                        If you have questions or comments about this notice, you may email us at <a href="mailto:privacy@jantra.agency">privacy@jantra.agency</a> or by post to our registered office in Dhaka, Bangladesh.
                    </p>
                </article>

            </div>
        </main>
    );
}
