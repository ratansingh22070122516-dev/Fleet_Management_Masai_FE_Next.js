'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { vehicleApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await vehicleApi.getAll({ 
        status: 'active',
        availability: true 
      })
      setVehicles(response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching vehicles:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load vehicles'
      toast.error(errorMsg)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || vehicle.type === selectedType
    
    return matchesSearch && matchesType
  })

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <DashboardLayout role="customer">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Browse Vehicles</h1>
              <p className="mt-1 text-sm text-gray-600">
                Find the perfect vehicle for your next trip
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by make, model, or location..."
                    className="form-input pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <select
                        className="form-input"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="truck">Truck</option>
                        <option value="van">Van</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select className="form-input">
                        <option>Any Price</option>
                        <option>Under $100</option>
                        <option>$100 - $200</option>
                        <option>Over $200</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passengers
                      </label>
                      <select className="form-input">
                        <option>Any</option>
                        <option>2+</option>
                        <option>5+</option>
                        <option>7+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="City or ZIP"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="card hover:shadow-lg transition-shadow">
                  {/* Vehicle Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-6xl">🚗</div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">{vehicle.type}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.rating?.average || 4.5}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {vehicle.location?.address || vehicle.location?.city || 'Location not specified'}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {vehicle.capacity?.passengers || 0} passengers
                      </div>
                      <div className="flex items-center font-semibold text-gray-900">
                        <DollarSign className="h-4 w-4" />
                        {vehicle.pricing?.baseRate || 0}/{vehicle.pricing?.rateType === 'daily' ? 'day' : 'hr'}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/dashboard/customer/vehicles/${vehicle._id}`}>
                    <Button className="w-full" variant={vehicle.availability ? 'primary' : 'secondary'}>
                      {vehicle.availability ? 'Book Now' : 'View Details'}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            )}

            {/* Empty State */}
            {!loading && filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}