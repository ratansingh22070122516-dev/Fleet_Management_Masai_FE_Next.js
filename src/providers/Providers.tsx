'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="light"
          toastOptions={{
            duration: 4000,
            style: {
              padding: '12px 16px',
            },
          }}
        />
      </QueryClientProvider>
  )
}