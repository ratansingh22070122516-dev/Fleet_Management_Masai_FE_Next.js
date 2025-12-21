'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useEffect, useState } from 'react'
import { Car, MapPin, Clock, DollarSign, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { bookingApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function DriverDashboard() {
  const [stats, setStats] = useState({
    activeTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
    todayEarnings: 0,
  })
  const [assignedBookings, setAssignedBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignedBookings()
  }, [])

  const fetchAssignedBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingApi.getDriverBookings()
      console.log('Driver bookings:', response.data)
      const bookings = response.data.data || []
      setAssignedBookings(bookings)
      
      // Update stats
      const confirmed = bookings.filter((b: any) => b.status === 'confirmed').length
      const inProgress = bookings.filter((b: any) => b.status === 'in_progress').length
      const completed = bookings.filter((b: any) => b.status === 'completed').length
      
      setStats({
        activeTrips: confirmed + inProgress,
        completedTrips: completed,
        totalEarnings: 0, // TODO: Calculate from completed bookings
        todayEarnings: 0,
      })
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load assigned bookings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['driver']}>
      <DashboardLayout role="driver">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your trips and track your earnings.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Active Trips</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.activeTrips}</dd>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.completedTrips}</dd>
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
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
                    <dd className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</dd>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Today</dt>
                    <dd className="text-2xl font-bold text-gray-900">${stats.todayEarnings}</dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Trips */}
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assigned Bookings</h3>
                <Link href="/dashboard/driver/trips">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              ) : assignedBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No bookings assigned yet</p>
                  <p className="text-sm text-gray-500 mt-1">Vehicle owners will assign bookings to you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedBookings.slice(0, 3).map((booking) => {
                    const customerName = `${booking.customer?.profile?.firstName || ''} ${booking.customer?.profile?.lastName || ''}`.trim() || 'Customer'
                    const vehicleName = `${booking.vehicle?.year || ''} ${booking.vehicle?.make || ''} ${booking.vehicle?.modelName || ''}`.trim()
                    
                    return (
                      <div key={booking._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{vehicleName}</h4>
                            <p className="text-sm text-gray-600">{booking.vehicle?.licensePlate}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                            booking.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>Customer: {customerName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(booking.scheduledDate?.start).toLocaleDateString()} - {new Date(booking.scheduledDate?.end).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-start text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                            <span>{booking.pickupLocation?.address || 'Pickup location'}</span>
                          </div>
                          <div className="flex items-start text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary-600" />
                            <span>{booking.dropoffLocation?.address || 'Dropoff location'}</span>
                          </div>
                        </div>

                        {booking.customerNotes && (
                          <div className="mt-3 p-2 bg-primary-50 rounded text-sm">
                            <span className="font-medium">Note: </span>
                            <span className="text-gray-600">{booking.customerNotes}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}