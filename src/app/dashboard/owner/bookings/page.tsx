'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock, MapPin, User, Calendar, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { bookingApi, userApi } from '@/lib/api'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
}

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  refunded: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800'
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [driversLoading, setDriversLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBookings()
    fetchDrivers()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingApi.getOwnerBookings()
      console.log('Owner bookings:', response.data)
      setBookings(response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const fetchDrivers = async () => {
    try {
      setDriversLoading(true)
      const response = await userApi.getDrivers()
      console.log('Available drivers:', response.data)
      setDrivers(response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching drivers:', error)
      toast.error('Failed to load drivers')
    } finally {
      setDriversLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const firstName = booking.customer?.profile?.firstName || ''
    const lastName = booking.customer?.profile?.lastName || ''
    const customerName = (firstName + ' ' + lastName).trim()
    const year = booking.vehicle?.year || ''
    const make = booking.vehicle?.make || ''
    const modelName = booking.vehicle?.modelName || ''
    const vehicleName = (year + ' ' + make + ' ' + modelName).trim()
    
    const matchesSearch = 
      booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const handleAccept = async (bookingId: string) => {
    try {
      await bookingApi.update(bookingId, { status: 'confirmed' })
      toast.success('Booking accepted')
      fetchBookings()
    } catch (error: any) {
      console.error('Error accepting booking:', error)
      toast.error(error.response?.data?.message || 'Failed to accept booking')
    }
  }

  const handleReject = async (bookingId: string) => {
    if (confirm('Are you sure you want to reject this booking?')) {
      try {
        await bookingApi.update(bookingId, { status: 'cancelled' })
        toast.success('Booking rejected')
        fetchBookings()
      } catch (error: any) {
        console.error('Error rejecting booking:', error)
        toast.error(error.response?.data?.message || 'Failed to reject booking')
      }
    }
  }

  const handleAssignDriver = async (bookingId: string, driverId: string) => {
    try {
      await bookingApi.update(bookingId, { driver: driverId })
      const driver = drivers.find(d => d._id === driverId)
      const firstName = driver?.profile?.firstName || ''
      const lastName = driver?.profile?.lastName || ''
      const driverName = (firstName + ' ' + lastName).trim() || 'Driver'
      toast.success(driverName + ' assigned successfully')
      fetchBookings()
    } catch (error: any) {
      console.error('Error assigning driver:', error)
      toast.error(error.response?.data?.message || 'Failed to assign driver')
    }
  }

  const getStatusCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length
    }
  }

  const counts = getStatusCounts()

  return (
    <ProtectedRoute allowedRoles={['vehicle_owner']}>
      <DashboardLayout role="vehicle_owner">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage bookings for your vehicles
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-gray-900">{counts.all}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
                <div className="card text-center">
                <div className="text-2xl font-bold text-red-600">{counts.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600">{counts.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-gray-600">{counts.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input pl-10"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {loading ? (
                <div className="card text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading bookings...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Clock className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Bookings will appear here when customers book your vehicles'}
                  </p>
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const firstName = booking.customer?.profile?.firstName || ''
                  const lastName = booking.customer?.profile?.lastName || ''
                  const customerName = (firstName + ' ' + lastName).trim() || 'Unknown Customer'
                  
                  const year = booking.vehicle?.year || ''
                  const make = booking.vehicle?.make || ''
                  const modelName = booking.vehicle?.modelName || ''
                  const vehicleName = (year + ' ' + make + ' ' + modelName).trim()
                  
                  const driverFirstName = booking.driver?.profile?.firstName || ''
                  const driverLastName = booking.driver?.profile?.lastName || ''
                  const driverName = booking.driver ? (driverFirstName + ' ' + driverLastName).trim() : null
                  
                  const statusColor = statusColors[booking.status] || 'bg-gray-100 text-gray-800'
                  const paymentColor = paymentStatusColors[booking.payment?.status || 'pending'] || 'bg-gray-100 text-gray-800'
                  
                  return (
                  <div key={booking._id} className="card hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Booking #{booking._id.slice(-6).toUpperCase()}</h3>
                            <p className="text-sm text-gray-600">{vehicleName}</p>
                            <p className="text-xs text-gray-500">{booking.vehicle?.licensePlate}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={'px-2 py-1 text-xs font-medium rounded-full ' + statusColor}>
                              {booking.status}
                            </span>
                            <span className={'px-2 py-1 text-xs font-medium rounded-full ' + paymentColor}>
                              {booking.payment?.status || 'pending'}
                            </span>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-gray-900">{customerName}</span>
                          </div>
                          {booking.customer?.email && (
                            <div className="text-xs">{booking.customer.email}</div>
                          )}
                          {booking.customer?.profile?.phone && (
                            <div className="text-xs">{booking.customer.profile.phone}</div>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.scheduledDate?.start).toLocaleDateString()}</span>
                            <span>→</span>
                            <span>{new Date(booking.scheduledDate?.end).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Locations */}
                        <div className="space-y-1 text-sm">
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 text-green-600" />
                            <div>
                              <span className="font-medium text-gray-700">Pickup: </span>
                              {booking.pickupLocation?.address || 'Not specified'}
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 mt-0.5 text-red-600" />
                            <div>
                              <span className="font-medium text-gray-700">Dropoff: </span>
                              {booking.dropoffLocation?.address || 'Not specified'}
                            </div>
                          </div>
                        </div>

                        {/* Customer Notes */}
                        {booking.customerNotes && (
                          <div className="text-sm bg-red-50 p-2 rounded">
                            <span className="font-medium text-gray-700">Note: </span>
                            <span className="text-gray-600">{booking.customerNotes}</span>
                          </div>
                        )}

                        {/* Driver Assignment */}
                        {booking.status === 'confirmed' && driverName && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Driver:</span>
                            <span className="font-medium text-gray-900">{driverName}</span>
                          </div>
                        )}

                        {/* Amount */}
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            ${booking.pricing?.totalAmount?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-sm text-gray-600">
                            (Base: ${booking.pricing?.baseAmount?.toFixed(2) || '0.00'})
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-48 space-y-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              className="w-full"
                              onClick={() => handleAccept(booking._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full text-red-600 hover:text-red-700"
                              onClick={() => handleReject(booking._id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        {booking.status === 'confirmed' && !booking.driver && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Assign Driver
                            </label>
                            <select
                              className="form-input text-sm"
                              onChange={(e) => handleAssignDriver(booking._id, e.target.value)}
                              defaultValue=""
                              disabled={driversLoading || drivers.length === 0}
                            >
                              <option value="" disabled>
                                {driversLoading ? 'Loading drivers...' : drivers.length === 0 ? 'No drivers available' : 'Select driver'}
                              </option>
                              {drivers.map((driver) => {
                                const driverFirstName = driver.profile?.firstName || ''
                                const driverLastName = driver.profile?.lastName || ''
                                const driverName = (driverFirstName + ' ' + driverLastName).trim() || driver.email
                                const phone = driver.profile?.phone
                                return (
                                  <option key={driver._id} value={driver._id}>
                                    {driverName}{phone ? ' - ' + phone : ''}
                                  </option>
                                )
                              })}
                            </select>
                            {drivers.length === 0 && !driversLoading && (
                              <p className="text-xs text-red-600">No drivers have signed up yet</p>
                            )}
                          </div>
                        )}

                        {(booking.status === 'in_progress' || booking.status === 'completed') && (
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