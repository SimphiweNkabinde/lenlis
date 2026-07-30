'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner' // Replace with your toast package

export default function ToastListener() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const message = searchParams.get('message')
        const type = searchParams.get('type')

        if (message) {
            // Trigger toast based on type
            if (type === 'success') toast.success(message, { position: "top-center" })
            else toast.error(message, { position: "top-center" })

            // Clean up URL without triggering a page reload
            const params = new URLSearchParams(searchParams.toString())
            params.delete('message')
            params.delete('type')

            const query = params.toString() ? `?${params.toString()}` : ''
            router.replace(`${pathname}${query}`, { scroll: false })
        }
    }, [searchParams, pathname, router])

    return null
}
