'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useEffect, useState } from 'react'
import { Car, DollarSign, Calendar, TrendingUp, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { vehicleApi, bookingApi } from '@/lib/api'
import { toast } from 'sonner'

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const [vehiclesRes, bookingsRes] = await Promise.all([
        vehicleApi.getMyVehicles(),
        bookingApi.getOwnerBookings()
      ])

      const vehicles = vehiclesRes.data.data || []
      const bookings = bookingsRes.data.data || []

      const activeBookings = bookings.filter((b: any) => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length

      const completedBookings = bookings.filter((b: any) => b.status === 'completed')
      const totalRevenue = completedBookings.reduce((sum: number, b: any) => 
        sum + (b.pricing?.totalAmount || 0), 0
      )

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = completedBookings
        .filter((b: any) => {
          const bookingDate = new Date(b.updatedAt)
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
        })
        .reduce((sum: number, b: any) => sum + (b.pricing?.totalAmount || 0), 0)

      setStats({
        totalVehicles: vehicles.length,
        activeBookings,
        totalRevenue,
        monthlyRevenue,
      })
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['vehicle_owner']}>
        <DashboardLayout role="vehicle_owner">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['vehicle_owner']}>
      <DashboardLayout role="vehicle_owner">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Welcome back! Here's what's happening with your fleet today.
                </p>
              </div>
              <Link href="/dashboard/owner/vehicles/new">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate mb-1">Total Vehicles</dt>
                      <dd className="text-2xl font-bold text-gray-900 leading-tight">{stats.totalVehicles}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate mb-1">Active Bookings</dt>
                      <dd className="text-2xl font-bold text-gray-900 leading-tight">{stats.activeBookings}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate mb-1">Total Revenue</dt>
                      <dd className="text-2xl font-bold text-gray-900 leading-tight">${stats.totalRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate mb-1">This Month</dt>
                      <dd className="text-2xl font-bold text-gray-900 leading-tight">${stats.monthlyRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Bookings */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                  <Link href="/dashboard/owner/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">2023 Tesla Model 3</p>
                        <p className="text-xs text-gray-500">John Doe • 3 days</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Performance */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Vehicles</h3>
                  <Link href="/dashboard/owner/analytics" className="text-sm text-primary-600 hover:text-primary-700">
                    View analytics
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    { name: '2023 Tesla Model 3', bookings: 45, revenue: 12500 },
                    { name: '2022 BMW X5', bookings: 38, revenue: 10200 },
                    { name: '2021 Mercedes C-Class', bookings: 32, revenue: 8900 },
                  ].map((vehicle, i) => (
                    <div key={i} className="py-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{vehicle.name}</p>
                        <p className="text-sm font-semibold text-gray-900">${vehicle.revenue.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-gray-500">{vehicle.bookings} bookings</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}