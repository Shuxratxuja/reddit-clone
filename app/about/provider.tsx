import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProviders({ children }: AuthProviderProps) {
  return <SessionProvider>
    {children}
  </SessionProvider>
}