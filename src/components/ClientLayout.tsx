'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

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
        </>
    )
}
