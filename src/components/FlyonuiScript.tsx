'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Extend Window interface for TypeScript
declare global {
  interface Window {
    FlyonUI: any
  }
}

export default function FlyonuiScript() {
  useEffect(() => {
    // Initialize FlyonUI after component mounts and scripts load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          // Initialize FlyonUI components if available
          if (window.FlyonUI && typeof window.FlyonUI.init === 'function') {
            window.FlyonUI.init()
            console.log('FlyonUI initialized')
          }
          
          // Initialize HSStaticMethods if available
          if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
            window.HSStaticMethods.autoInit()
            console.log('HSStaticMethods initialized')
          }
        } catch (error) {
          console.warn('Error initializing FlyonUI:', error)
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* FlyonUI JS - Main library */}
      <Script
        src="https://cdn.jsdelivr.net/npm/flyonui@2.4.1/dist/js/flyonui.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log('FlyonUI script loaded')}
        onError={(e) => console.error('Failed to load FlyonUI:', e)}
      />
    </>
  )
}