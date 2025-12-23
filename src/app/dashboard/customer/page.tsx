'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useEffect, useState } from 'react'
import { Calendar, Car, Clock, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { bookingApi } from '@/lib/api'
import { toast } from 'sonner'

export default function CustomerDashboard() {
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedTrips: 0,
    upcomingBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [currentBooking, setCurrentBooking] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await bookingApi.getMyBookings()
      const bookings = response.data.data || []

      const active = bookings.filter((b: any) => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      )
      const completed = bookings.filter((b: any) => b.status === 'completed')
      const upcoming = bookings.filter((b: any) => 
        b.status === 'confirmed' && new Date(b.scheduledDate.start) > new Date()
      )

      setStats({
        activeBookings: active.length,
        completedTrips: completed.length,
        upcomingBookings: upcoming.length,
      })

      // Set current booking (first in_progress or confirmed booking)
      const current = bookings.find((b: any) => b.status === 'in_progress' || b.status === 'confirmed')
      setCurrentBooking(current)
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['customer']}>
        <DashboardLayout role="customer">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <DashboardLayout role="customer">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Book vehicles and manage your trips.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/dashboard/customer/vehicles">
                <div className="card hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Browse</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">Find Vehicles</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Search className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>
              </Link>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{stats.activeBookings} Booking{stats.activeBookings !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{stats.upcomingBookings} Trip{stats.upcomingBookings !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Booking */}
            {currentBooking && (
              <div className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Booking</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    currentBooking.status === 'in_progress' ? 'text-green-800 bg-green-100' :
                    currentBooking.status === 'confirmed' ? 'text-primary-800 bg-primary-100' :
                    'text-yellow-800 bg-yellow-100'
                  }`}>
                    {currentBooking.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {currentBooking.vehicle?.year} {currentBooking.vehicle?.make} {currentBooking.vehicle?.modelName}
                      </h4>
                      <p className="text-sm text-gray-600">Booking #{currentBooking._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${currentBooking.pricing?.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {Math.ceil((new Date(currentBooking.scheduledDate.end).getTime() - new Date(currentBooking.scheduledDate.start).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600 mb-1">Pickup</p>
                      <p className="font-medium text-gray-900">
                        {new Date(currentBooking.scheduledDate.start).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-gray-600 text-xs">{currentBooking.pickupLocation?.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Return</p>
                      <p className="font-medium text-gray-900">
                        {new Date(currentBooking.scheduledDate.end).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-gray-600 text-xs">{currentBooking.dropoffLocation?.address || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/dashboard/customer/bookings/${currentBooking._id}`} className="flex-1">
                      <Button size="sm" className="w-full">View Details</Button>
                    </Link>
                    <Link href="/dashboard/customer/bookings" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">All Bookings</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}