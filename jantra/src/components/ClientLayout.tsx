'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

const WHATSAPP_LINK = 'https://wa.me/8801625027956'

export default function ClientLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')

    return (
        <>
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && (
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600"
                >
                    <span className="text-base leading-none">💬</span>
                    WhatsApp
                </a>
            )}
        </>
    )
}
