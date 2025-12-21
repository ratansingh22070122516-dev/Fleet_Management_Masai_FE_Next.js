'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Calendar, MapPin, DollarSign, Clock, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { bookingApi } from '@/lib/api'

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
type FilterType = 'all' | 'active' | 'completed' | 'cancelled'

interface Booking {
  _id: string
  vehicle: {
    _id: string
    make: string
    modelName: string
    year: number
    licensePlate: string
  }
  status: BookingStatus
  scheduledDate: {
    start: string
    end: string
  }
  pickupLocation: {
    address: string
  }
  dropoffLocation: {
    address: string
  }
  pricing: {
    totalAmount: number
  }
  payment: {
    status: string
  }
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [filter, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingApi.getMyBookings()
      setBookings(response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]
    
    switch (filter) {
      case 'active':
        // Active bookings: pending, confirmed, in_progress
        filtered = bookings.filter(b => 
          ['pending', 'confirmed', 'in_progress'].includes(b.status)
        )
        break
      case 'completed':
        filtered = bookings.filter(b => b.status === 'completed')
        break
      case 'cancelled':
        filtered = bookings.filter(b => b.status === 'cancelled')
        break
      case 'all':
      default:
        filtered = bookings
        break
    }
    
    setFilteredBookings(filtered)
  }

  const handleCancelBooking = async (id: string) => {
    const reason = prompt('Please provide a reason for cancellation (optional):')
    
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingApi.cancel(id, reason || undefined)
        toast.success('Booking cancelled successfully')
        fetchBookings()
      } catch (error: any) {
        console.error('Error cancelling booking:', error)
        toast.error(error.response?.data?.message || 'Failed to cancel booking')
      }
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-primary-100 text-primary-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-primary-100 text-primary-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: BookingStatus) => {
    return status.replace('_', ' ')
  }

  const canCancelBooking = (status: BookingStatus) => {
    return ['pending', 'confirmed'].includes(status)
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your vehicle bookings and trips
                </p>
              </div>
              <Link href="/dashboard/customer/vehicles">
                <Button>Book New Vehicle</Button>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-6">
              <div className="flex gap-2 overflow-x-auto">
                {['all', 'active', 'completed', 'cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                      filter === f
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="card text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === 'all' ? 'No bookings found' : `No ${filter} bookings`}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filter === 'all' 
                      ? 'Start exploring vehicles to make your first booking'
                      : `You don't have any ${filter} bookings`
                    }
                  </p>
                  {filter === 'all' && (
                    <Link href="/dashboard/customer/vehicles">
                      <Button>Browse Vehicles</Button>
                    </Link>
                  )}
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div key={booking._id} className="card hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Side - Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.modelName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Booking #{booking._id.slice(-8).toUpperCase()} • {booking.vehicle.licensePlate}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {/* Pickup */}
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              Pickup
                            </div>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.scheduledDate.start).toLocaleString()}
                            </p>
                            <div className="flex items-start text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{booking.pickupLocation.address}</span>
                            </div>
                          </div>

                          {/* Return */}
                          <div>
                            <div className="flex items-center text-gray-600 mb-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              Return
                            </div>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.scheduledDate.end).toLocaleString()}
                            </p>
                            <div className="flex items-start text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{booking.dropoffLocation.address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <div className="flex items-center text-gray-600 text-sm">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-semibold text-gray-900">${booking.pricing.totalAmount.toFixed(2)}</span>
                            <span className="mx-2">•</span>
                            <span className={`capitalize ${
                              booking.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              Payment {booking.payment.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex lg:flex-col gap-2 lg:w-40">
                        <Link href={`/dashboard/customer/bookings/${booking._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {canCancelBooking(booking.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-primary-600 hover:bg-primary-50 border-primary-200"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}