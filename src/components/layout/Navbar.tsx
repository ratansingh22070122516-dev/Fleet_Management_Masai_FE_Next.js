'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Car, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Navbar = () => {
  const [session, setSession] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for user session from localStorage only on client side
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          setSession({ user: JSON.parse(userStr) })
        }
      } catch (error) {
        console.error('Error reading user session:', error)
      }
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setSession(null)
        window.location.href = '/'
      } catch (error) {
        console.error('Error during sign out:', error)
      }
    }
  }
  if (!mounted) {
    return (
      <div className="navbar bg-purple-800 shadow-lg border-b border-purple-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="navbar-start">
            <Link href="/" className="btn btn-ghost text-xl hover:bg-purple-700">
              <Car className="h-8 w-8 text-purple-300" />
              <span className="font-bold text-white">UltimteFleet</span>
            </Link>
          </div>
          <div className="navbar-end">
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:bg-purple-700">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-purple-800 shadow-lg border-b border-purple-700 sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-purple-700 transition-colors">
            <Car className="h-8 w-8 text-purple-300" />
            <span className="font-bold text-white text-lg">UltimteFleet</span>
          </Link>

          {/* Desktop Menu - Removed navigation links */}
          <div className="hidden lg:flex">
            {/* Navigation removed as requested */}
          </div>

          {/* Desktop Authentication */}
          <div className="hidden lg:flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-purple-700 h-9 px-3 text-sm">Dashboard</Button>
                </Link>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-purple-700 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {(session?.user?.firstName || session?.user?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-lg z-[1] mt-2 w-48 p-2 shadow-lg border">
                    <li className="px-3 py-2">
                      <span className="text-sm text-gray-600 font-medium">
                        Welcome, {session?.user?.firstName || session?.user?.name || 'User'}
                      </span>
                    </li>
                    <li><hr className="my-1" /></li>
                    <li>
                      <a onClick={handleSignOut} className="px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded cursor-pointer">Sign Out</a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:bg-purple-700 h-9 px-3 text-sm">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700 h-9 px-4 text-sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-purple-700 cursor-pointer transition-colors">
                <Menu className="h-5 w-5 text-white" />
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-lg z-[1] mt-2 w-48 p-2 shadow-lg border">
                {session ? (
                  <>
                    <li>
                      <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded">Dashboard</Link>
                    </li>
                    <li>
                      <a onClick={handleSignOut} className="px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded cursor-pointer">Sign Out</a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/auth/login" className="px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded">Sign In</Link>
                    </li>
                    <li>
                      <Link href="/auth/register" className="px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded">Get Started</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}