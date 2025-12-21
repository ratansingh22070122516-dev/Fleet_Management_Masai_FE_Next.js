'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { Plus, Search, Filter, MapPin, Star, Users, Package, Edit, Trash2, Eye, Car } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { vehicleApi } from '@/lib/api'

const statusColors = {
  available: 'bg-green-100 text-green-800',
  on_trip: 'bg-primary-100 text-primary-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800'
}

const typeLabels: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  truck: 'Truck',
  van: 'Van',
  motorcycle: 'Motorcycle',
  bus: 'Bus'
}

export default function OwnerVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchVehicles()
    
    // Refetch when page becomes visible (e.g., after navigation)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchVehicles()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await vehicleApi.getMyVehicles()
      if (response.data.success) {
        setVehicles(response.data.data || [])
      } else {
        console.error('API returned success: false', response.data)
        toast.error(response.data.message || 'Failed to load vehicles')
      }
    } catch (error: any) {
      console.error('Error fetching vehicles:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load vehicles'
      toast.error(errorMsg)
      // Set empty array on error so UI doesn't break
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleApi.delete(id)
        toast.success('Vehicle deleted successfully')
        fetchVehicles()
      } catch (error) {
        toast.error('Failed to delete vehicle')
      }
    }
  }

  return (
    <ProtectedRoute allowedRoles={['vehicle_owner']}>
      <DashboardLayout role="vehicle_owner">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your fleet and vehicle listings
                </p>
              </div>
              <Link href="/dashboard/owner/vehicles/new">
                <Button className="mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-input pl-10"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="on_trip">On Trip</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="form-input pl-10"
                  >
                    <option value="all">All Types</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicles Grid */}
            {loading ? (
              <div className="card text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vehicles...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Package className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first vehicle'}
                </p>
                {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                  <Link href="/dashboard/owner/vehicles/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="card group hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.make} ${vehicle.modelName}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <Car className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      {/* Title & Status */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.modelName}
                          </h3>
                          <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[vehicle.status as keyof typeof statusColors]}`}>
                          {vehicle.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{vehicle.capacity?.passengers || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{vehicle.capacity?.cargo || 0} cu ft</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{vehicle.rating?.average || 0}</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location?.city}, {vehicle.location?.state}</span>
                      </div>

                      {/* Pricing */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">${vehicle.pricing?.baseRate}</span>
                            <span className="text-sm text-gray-600">/{vehicle.pricing?.rateType}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{vehicle.totalTrips || 0} trips</div>
                            <div className="text-xs text-gray-600">{typeLabels[vehicle.type]}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          <Link href={`/dashboard/owner/vehicles/${vehicle._id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/owner/vehicles/${vehicle._id}/edit`}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-primary-600 hover:text-primary-700 hover:border-primary-300"
                            onClick={() => handleDelete(vehicle._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}