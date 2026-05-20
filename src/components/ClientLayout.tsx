'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [hideNavbarForOverlay, setHideNavbarForOverlay] = useState(false)
    const isAdmin = pathname?.startsWith('/admin')
    const isStandalonePortal = pathname?.startsWith('/report')

    useEffect(() => {
        const handleOverlayState = (event: Event) => {
            const customEvent = event as CustomEvent<{ open?: boolean }>
            setHideNavbarForOverlay(Boolean(customEvent.detail?.open))
        }

        window.addEventListener('jantra:overlay-state', handleOverlayState)
        return () => window.removeEventListener('jantra:overlay-state', handleOverlayState)
    }, [])

    const showNav = !isAdmin && !isStandalonePortal && !hideNavbarForOverlay;

    return (
        <>
            {showNav && <Navbar />}
            <div className="relative z-0">
                {children}
            </div>
            {showNav && <Footer />}
        </>
    )
}

