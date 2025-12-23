'use client'

import Image from 'next/image'
import Logo from '../../../images/download.png'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Car, Menu, X } from 'lucide-react'
import { useState } from 'react'

export const Navbar = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="navbar bg-base-100 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="navbar-start">
          {/* Logo */}
          <Link href="/" className="btn btn-ghost text-xl">
            <Image src={Logo} alt="Fleet logo" width={32} height={32} className="rounded" />
            <span className="font-bold text-base-content">FleetManager</span>
          </Link>
        </div>

        {/* Desktop Menu - Removed navigation links */}
        <div className="navbar-center hidden lg:flex">
          {/* Navigation removed as requested */}
        </div>

        <div className="navbar-end">
          {/* Desktop Authentication */}
          <div className="hidden lg:flex items-center gap-2">
            {status === 'loading' ? (
              <div className="skeleton h-8 w-20"></div>
            ) : session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                      <span className="text-sm text-base-content/70">
                        Welcome, {session.user?.name}
                      </span>
                    </li>
                    <li><hr /></li>
                    <li><a onClick={handleSignOut}>Sign Out</a></li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <Menu className="h-5 w-5" />
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                {session ? (
                  <>
                    <li>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <a onClick={handleSignOut}>Sign Out</a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/auth/login">Sign In</Link>
                    </li>
                    <li>
                      <Link href="/auth/register">Get Started</Link>
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