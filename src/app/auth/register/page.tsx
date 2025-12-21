'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { registerSchema } from '@/lib/validations'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Car, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const roleOptions = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Browse and book vehicles for your trips',
    icon: User,
  },
  {
    value: 'driver',
    label: 'Driver',
    description: 'Drive vehicles and earn money',
    icon: Car,
  },
  {
    value: 'vehicle_owner',
    label: 'Vehicle Owner',
    description: 'List your vehicles and manage bookings',
    icon: CheckCircle2,
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setApiError('')
      
      const payload = {
        email: values.email,
        password: values.password,
        role: values.role,
        profile: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
          },
        },
      }

      const response = await authApi.register(payload)
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        
        toast.success('Registration successful!')
        
        // Redirect based on role
        const role = response.data.data.user.role
        if (role === 'vehicle_owner') {
          router.push('/dashboard/owner')
        } else if (role === 'driver') {
          router.push('/dashboard/driver')
        } else if (role === 'customer') {
          router.push('/dashboard/customer')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      setApiError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Car className="h-12 w-12 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">FleetManager</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Account</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Profile</span>
              </div>
            </div>
          </div>

          {apiError && (
            <div className="mb-6 bg-primary-50 border border-primary-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary-800">{apiError}</p>
            </div>
          )}

          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              role: 'customer',
              firstName: '',
              lastName: '',
              phone: '',
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'US',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue, errors, touched, validateForm, setTouched }) => (
              <Form className="space-y-6">
                {/* Step 1: Account Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        I want to join as a
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        {roleOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <label
                              key={option.value}
                              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-colors ${
                                values.role === option.value
                                  ? 'border-primary-600 bg-primary-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <Field
                                type="radio"
                                name="role"
                                value={option.value}
                                className="sr-only"
                              />
                              <Icon className={`h-6 w-6 mr-3 flex-shrink-0 ${
                                values.role === option.value ? 'text-primary-600' : 'text-gray-400'
                              }`} />
                              <div className="flex-1">
                                <span className="block text-sm font-medium text-gray-900">
                                  {option.label}
                                </span>
                                <span className="block text-sm text-gray-600">
                                  {option.description}
                                </span>
                              </div>
                              {values.role === option.value && (
                                <CheckCircle2 className="h-5 w-5 text-primary-600" />
                              )}
                            </label>
                          )
                        })}
                      </div>
                      <ErrorMessage name="role" component="div" className="form-error" />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className="form-input pl-10"
                          placeholder="you@example.com"
                        />
                      </div>
                      <ErrorMessage name="email" component="div" className="form-error" />
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Field name="password">
                              {({ field }: any) => (
                                <>
                                  <input
                                    {...field}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input pl-10"
                                    placeholder="••••••••"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </>
                              )}
                            </Field>
                          </div>
                        <ErrorMessage name="password" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Field name="confirmPassword">
                            {({ field }: any) => (
                              <>
                                <input
                                  {...field}
                                  id="confirmPassword"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  className="form-input pl-10"
                                  placeholder="••••••••"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword((s) => !s)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                              </>
                            )}
                          </Field>
                        </div>
                        <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={async () => {
                        // Validate step 1 fields
                        const step1Fields = {
                          role: true,
                          email: true,
                          password: true,
                          confirmPassword: true
                        }
                        
                        // Mark fields as touched to show errors
                        setTouched({
                          role: true,
                          email: true,
                          password: true,
                          confirmPassword: true
                        })
                        
                        // Validate the form
                        const formErrors = await validateForm()
                        
                        // Check if any step 1 field has errors
                        const step1HasErrors = Object.keys(step1Fields).some(field => formErrors[field])
                        
                        if (!step1HasErrors) {
                          setStep(2)
                        } else {
                          toast.error('Please fix all errors before continuing')
                        }
                      }}
                      className="w-full"
                      size="lg"
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 2: Profile Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          className="form-input"
                          placeholder="John"
                        />
                        <ErrorMessage name="firstName" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          className="form-input"
                          placeholder="Doe"
                        />
                        <ErrorMessage name="lastName" component="div" className="form-error" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Field
                          id="phone"
                          name="phone"
                          type="tel"
                          className="form-input pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <ErrorMessage name="phone" component="div" className="form-error" />
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Field
                          id="street"
                          name="street"
                          type="text"
                          className="form-input pl-10"
                          placeholder="123 Main St"
                        />
                      </div>
                      <ErrorMessage name="street" component="div" className="form-error" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Field
                          id="city"
                          name="city"
                          type="text"
                          className="form-input"
                          placeholder="San Francisco"
                        />
                        <ErrorMessage name="city" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <Field
                          id="state"
                          name="state"
                          type="text"
                          className="form-input"
                          placeholder="CA"
                        />
                        <ErrorMessage name="state" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <Field
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          className="form-input"
                          placeholder="94102"
                        />
                        <ErrorMessage name="zipCode" component="div" className="form-error" />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="font-medium text-primary-600 hover:text-primary-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-primary-600 hover:text-primary-500">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}