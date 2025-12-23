'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function FlyonuiScript() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Function to safely initialize after all scripts are loaded
    const initializeScripts = () => {
      if (typeof window !== 'undefined' && window.$ && window.jQuery) {
        try {
          console.log('Initializing FlyonUI and plugins')
          
          // Initialize FlyonUI components if available
          if (window.FlyonUI && typeof window.FlyonUI.init === 'function') {
            window.FlyonUI.init()
          }
          
          // Initialize HSStaticMethods if available
          if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
            window.HSStaticMethods.autoInit()
          }
          
          setScriptsLoaded(true)
        } catch (error) {
          console.warn('Error initializing scripts:', error)
        }
      }
    }

    // Check if jQuery is already loaded, if so initialize
    if (window.$ && window.jQuery) {
      initializeScripts()
    } else {
      // Wait for jQuery to load
      const checkJQuery = setInterval(() => {
        if (window.$ && window.jQuery) {
          clearInterval(checkJQuery)
          initializeScripts()
        }
      }, 100)

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkJQuery), 5000)
    }
  }, [])

  return (
    <>
      {/* jQuery - Must load first */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('jQuery loaded')}
      />

      {/* Lodash */}
      <Script
        src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
        strategy="afterInteractive"
      />

      {/* DataTables */}
      <Script
        src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"
        strategy="afterInteractive"
      />

      {/* nouislider */}
      <Script
        src="https://cdn.jsdelivr.net/npm/nouislider@15.7.1/dist/nouislider.min.js"
        strategy="afterInteractive"
      />

      {/* FlyonUI JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/flyonui@2.4.1/dist/js/flyonui.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('FlyonUI loaded')}
      />
    </>
  )
}