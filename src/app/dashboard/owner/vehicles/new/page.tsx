'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { vehicleSchema } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { vehicleApi } from '@/lib/api'

export default function NewVehiclePage() {
  const router = useRouter()

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      console.log('Form values:', values);
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Auth token:', token ? 'EXISTS' : 'MISSING');
      console.log('User data:', user ? JSON.parse(user) : 'MISSING');
      
      if (!token) {
        toast.error('You must be logged in to add a vehicle. Please log in again.');
        return;
      }
      
      // Enhanced payload with all required fields based on existing vehicle structure
      const payload = {
        make: values.make,
        modelName: values.model,
        year: parseInt(values.year), // Ensure year is a number
        color: values.color,
        licensePlate: values.licensePlate,
        type: values.type,
        pricing: {
          baseRate: parseFloat(values.baseRate), // Ensure baseRate is a number
          rateType: values.rateType,
          currency: 'USD' // Add currency as it seems to be required
        },
        // Add capacity (required field based on existing vehicles)
        capacity: {
          passengers: 5, // Default value
          cargo: 10 // Default value
        },
        // Add location (required field based on existing vehicles)  
        location: {
          type: 'Point',
          coordinates: [0, 0], // Default coordinates
          address: 'TBD', // To be determined
          city: 'TBD',
          state: 'TBD'
        },
        // Add other potentially required fields based on existing data
        features: [],
        images: [],
        availability: true,
        status: 'active'
      }

      console.log('Payload being sent:', payload);
      console.log('API URL will be: http://localhost:5000/api/vehicles');
      
      const response = await vehicleApi.create(payload)
      console.log('API Response:', response);
      
      if (response.data.success) {
        toast.success('Vehicle added successfully!')
        router.push('/dashboard/owner/vehicles')
      }
    } catch (error: any) {
      console.error('Error adding vehicle:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('BACKEND VALIDATION ERRORS:', error.response?.data?.errors)
      console.error('Error response status:', error.response?.status)
      console.error('Error response headers:', error.response?.headers)
      
      // Show specific validation errors if available
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const validationErrors = error.response.data.errors.map((err: any) => `• ${err.message || err}`).join('\n')
        toast.error(`Validation Errors:\n${validationErrors}`)
      } else {
        // More specific error messages
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            error.response?.data?.details ||
                            (typeof error.response?.data === 'string' ? error.response.data : '') ||
                            error.message ||
                            'Failed to add vehicle. Please check all fields and try again.'
        
        toast.error(`Backend Error: ${errorMessage}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['vehicle_owner']}>
      <DashboardLayout role="vehicle_owner">
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <Link href="/dashboard/owner/vehicles">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Button>
            </Link>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Add New Vehicle</h1>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the details to list your vehicle
              </p>
            </div>

            {/* Form */}
            <div className="card">
              <Formik
                initialValues={{
                  make: '',
                  model: '',
                  year: new Date().getFullYear(),
                  color: '',
                  licensePlate: '',
                  type: 'sedan',
                  baseRate: 100,
                  rateType: 'daily',
                }}
                validationSchema={vehicleSchema}
                onSubmit={handleSubmit}
                validate={(values) => {
                  // Additional client-side validation feedback
                  const errors: any = {}
                  if (!values.make?.trim()) errors.make = 'Make is required'
                  if (!values.model?.trim()) errors.model = 'Model is required'
                  if (!values.color?.trim()) errors.color = 'Color is required'
                  if (!values.licensePlate?.trim()) errors.licensePlate = 'License plate is required'
                  if (values.baseRate <= 0) errors.baseRate = 'Base rate must be greater than 0'
                  return errors
                }}
              >                
                {({ isSubmitting, values, errors, touched }) => (
                  <Form className="space-y-6">
                    {/* Validation Error Summary */}
                    {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {Object.entries(errors).map(([field, error]) => (
                            touched[field as keyof typeof touched] && (
                              <li key={field}>• {error as string}</li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                            Make *
                          </label>
                          <Field name="make">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                                placeholder="Tesla"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="make" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                            Model *
                          </label>
                          <Field name="model">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                                placeholder="Model 3"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="model" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                            Year *
                          </label>
                          <Field name="year">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                type="number"
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="year" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                            Color *
                          </label>
                          <Field name="color">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                                placeholder="Pearl White"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="color" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Type *
                          </label>
                          <Field name="type">
                            {({ field, meta }: any) => (
                              <select
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                              >
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="truck">Truck</option>
                                <option value="van">Van</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="bus">Bus</option>
                              </select>
                            )}
                          </Field>
                          <ErrorMessage name="type" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                            License Plate *
                          </label>
                          <Field name="licensePlate">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                                placeholder="ABC-1234"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="licensePlate" component="div" className="form-error" />
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700 mb-1">
                            Base Rate ($) *
                          </label>
                          <Field name="baseRate">
                            {({ field, meta }: any) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                              />
                            )}
                          </Field>
                          <ErrorMessage name="baseRate" component="div" className="form-error" />
                        </div>

                        <div>
                          <label htmlFor="rateType" className="block text-sm font-medium text-gray-700 mb-1">
                            Rate Type *
                          </label>
                          <Field name="rateType">
                            {({ field, meta }: any) => (
                              <select
                                {...field}
                                className={meta.touched && meta.error ? 'form-input-error' : 'form-input'}
                              >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                              </select>
                            )}
                          </Field>
                          <ErrorMessage name="rateType" component="div" className="form-error" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        Add Vehicle
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}