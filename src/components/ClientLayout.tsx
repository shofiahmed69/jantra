'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isStandalonePortal = pathname?.startsWith('/report')

    return (
        <>
            {!isAdmin && !isStandalonePortal && <Navbar />}
            {children}
            {!isAdmin && !isStandalonePortal && <Footer />}
        </>
    )
}
