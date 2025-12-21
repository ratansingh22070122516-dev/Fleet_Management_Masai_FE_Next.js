'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { loginSchema } from '@/lib/validations'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Car, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setApiError('')
      const response = await authApi.login(values)

      // Backend may return 200 with success: false and a message
      if (!response.data?.success) {
        const message = response.data?.message || 'Login failed. Please check your credentials.'
        setApiError(message)
        toast.error(message)
        return
      }

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        
        toast.success('Login successful!')
        
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
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      setApiError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Car className="h-12 w-12 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">FleetManager</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          {apiError && (
            <div className="mb-4 bg-primary-50 border border-primary-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-primary-800">{apiError}</p>
            </div>
          )}

          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Email Field */}
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
                      autoComplete="email"
                      className="form-input pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>

                {/* Password Field */}
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
                            autoComplete="current-password"
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer Links */}
        <p className="text-center text-sm text-gray-600">
          By signing in, you agree to our{' '}
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