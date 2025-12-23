'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Car,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  ChevronDown
} from 'lucide-react'
import { authApi } from '@/lib/api'

interface DashboardLayoutProps {
  children: React.ReactNode
  role: 'vehicle_owner' | 'driver' | 'customer'
}

const navigationByRole = {
  vehicle_owner: [
    { name: 'Dashboard', href: '/dashboard/owner', icon: LayoutDashboard },
    { name: 'My Vehicles', href: '/dashboard/owner/vehicles', icon: Car },
    { name: 'Bookings', href: '/dashboard/owner/bookings', icon: Calendar },
  ],
  driver: [
    { name: 'Dashboard', href: '/dashboard/driver', icon: LayoutDashboard },
    { name: 'My Trips', href: '/dashboard/driver/trips', icon: Calendar },
    { name: 'Vehicles', href: '/dashboard/driver/vehicles', icon: Car },
  ],
  customer: [
    { name: 'Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
    { name: 'Browse Vehicles', href: '/dashboard/customer/vehicles', icon: Car },
    { name: 'My Bookings', href: '/dashboard/customer/bookings', icon: Calendar },
  ],
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const navigation = navigationByRole[role]

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session/cache
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage and redirect to landing page
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-purple-900 text-white border-r border-purple-700">
          {/* Logo */}
          <Link href="/" className="flex items-center ps-2.5 mb-5">
            <Car className="h-8 w-8 text-purple-300" />
            <span className="self-center text-lg font-semibold whitespace-nowrap ml-3 text-white">
              UltimteFleet
            </span>
          </Link>

          {/* User Info */}
          <div className="flex items-center ps-2.5 mb-5 p-3 bg-purple-800 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-xs text-purple-300 capitalize">
                {role.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg group transition-colors ${isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={`w-5 h-5 transition duration-75 ${isActive ? 'text-white' : 'text-purple-300 group-hover:text-white'
                      }`} />
                    <span className="ms-3">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-purple-800 border-b border-purple-700 sm:ml-64 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="text-white bg-transparent border border-transparent hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm p-2 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Right side - Profile and Logout */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications */}
              <button className="text-purple-200 hover:text-white p-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </p>
                  <p className="text-xs text-purple-300 capitalize">
                    {role.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-purple-600 hover:border-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-16 p-4 sm:ml-64">
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  )
}