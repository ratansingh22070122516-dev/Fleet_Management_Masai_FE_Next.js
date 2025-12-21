'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { MapPin, Navigation, CheckCircle, Clock, Package, User, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { bookingApi, tripApi } from '@/lib/api'

const statusColors: Record<string, string> = {
  confirmed: 'bg-primary-100 text-primary-800',
  active: 'bg-green-100 text-green-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-primary-100 text-primary-800'
}

export default function DriverTripsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingApi.getDriverBookings()
      console.log('Driver bookings:', response.data)
      setBookings(response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    statusFilter === 'all' || booking.status === statusFilter
  )

  const handleStartTrip = async (bookingId: string) => {
    try {
      await bookingApi.startTrip(bookingId)
      toast.success('Trip started')
      fetchBookings()
    } catch (error: any) {
      console.error('Error starting trip:', error)
      toast.error(error.response?.data?.message || 'Failed to start trip')
    }
  }

  const handleCompleteTrip = async (bookingId: string) => {
    try {
      await bookingApi.completeTrip(bookingId)
      toast.success('Trip completed')
      fetchBookings()
    } catch (error: any) {
      console.error('Error completing trip:', error)
      toast.error(error.response?.data?.message || 'Failed to complete trip')
    }
  }

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress')
  const todayEarnings = bookings
    .filter(b => b.status === 'completed' && new Date(b.updatedAt).toDateString() === new Date().toDateString())
    .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0)

  return (
    <ProtectedRoute allowedRoles={['driver']}>
      <DashboardLayout role="driver">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your assigned trips
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Trips</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{activeBookings.length}</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Navigation className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">${todayEarnings.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Trips</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="card mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  All Trips
                </Button>
                <Button
                  variant={statusFilter === 'confirmed' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('confirmed')}
                >
                  Assigned
                </Button>
                <Button
                  variant={statusFilter === 'in_progress' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('in_progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'primary' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed
                </Button>
              </div>
            </div>

            {/* Trips List */}
            <div className="space-y-4">
              {loading ? (
                <div className="card text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading trips...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Navigation className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                  <p className="text-gray-600">
                    {statusFilter !== 'all' 
                      ? 'Try adjusting your filter' 
                      : 'New trips will appear here when assigned to you'}
                  </p>
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const customerName = `${booking.customer?.profile?.firstName || ''} ${booking.customer?.profile?.lastName || ''}`.trim() || 'Customer'
                  const vehicleName = `${booking.vehicle?.year || ''} ${booking.vehicle?.make || ''} ${booking.vehicle?.modelName || ''}`.trim()
                  const statusColor = statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                  
                  return (
                    <div key={booking._id} className="card hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Content */}
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">Booking #{booking._id.slice(-6).toUpperCase()}</h3>
                              <p className="text-sm text-gray-600">{vehicleName}</p>
                              <p className="text-xs text-gray-500">{booking.vehicle?.licensePlate}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                              {booking.status}
                            </span>
                          </div>

                          {/* Customer Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{customerName}</span>
                            </div>
                            {booking.customer?.profile?.phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${booking.customer.profile.phone}`} className="hover:text-primary-600">
                                  {booking.customer.profile.phone}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.scheduledDate?.start).toLocaleDateString()} - {new Date(booking.scheduledDate?.end).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Locations */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <MapPin className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Pickup</p>
                                <p className="text-sm text-gray-900">{booking.pickupLocation?.address || 'Not specified'}</p>
                              </div>
                            </div>
                            <div className="ml-2 border-l-2 border-dashed border-gray-300 h-6"></div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <MapPin className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Dropoff</p>
                                <p className="text-sm text-gray-900">{booking.dropoffLocation?.address || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Customer Notes */}
                          {booking.customerNotes && (
                            <div className="bg-primary-50 border-l-4 border-primary-500 p-3">
                              <p className="text-xs font-medium text-primary-900 uppercase mb-1">Customer Note</p>
                              <p className="text-sm text-primary-800">{booking.customerNotes}</p>
                            </div>
                          )}

                          {/* Earnings */}
                          <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                            <div>
                              <p className="text-xs text-gray-500">Earnings</p>
                              <p className="text-sm font-semibold text-green-600">${booking.pricing?.totalAmount?.toFixed(2) || '0.00'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:w-48 flex flex-col gap-3">
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                className="w-full"
                                onClick={() => handleStartTrip(booking._id)}
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                Start Trip
                              </Button>
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </>
                          )}

                          {booking.status === 'in_progress' && (
                            <>
                              <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleCompleteTrip(booking._id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Trip
                              </Button>
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </>
                          )}

                          {booking.status === 'completed' && (
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}