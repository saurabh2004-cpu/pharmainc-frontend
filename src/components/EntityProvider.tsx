'use client'

import { useEffect } from 'react'
import { useEntityStore } from '@/store/entityStore'

export function EntityProvider() {
    const { initialize } = useEntityStore()

    useEffect(() => {
        initialize()
    }, [initialize])

    return null
}
