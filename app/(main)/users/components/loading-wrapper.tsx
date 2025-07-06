"use client"

import { useState, useEffect, type ReactNode } from "react"

interface LoadingWrapperProps {
  children: ReactNode
  loadingTime?: number
}

export function LoadingWrapper({ children, loadingTime = 1000 }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadingTime)

    return () => clearTimeout(timer)
  }, [loadingTime])

  if (isLoading) {
    return null // The parent will render the skeleton
  }

  return <>{children}</>
}
