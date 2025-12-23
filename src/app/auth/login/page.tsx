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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-base-100 flex items-center justify-center py-16 px-6 sm:px-8">
      <div className="max-w-lg w-full space-y-10">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Car className="h-12 w-12 text-primary" />
            <span className="text-2xl font-bold text-base-content">FleetManager</span>
          </Link>
          <h2 className="text-3xl font-bold text-base-content">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-primary hover:text-primary-focus">
              Sign up
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-8">
            {apiError && (
              <div className="alert alert-error mb-6">
                <AlertCircle className="h-5 w-5" />
                <span>{apiError}</span>
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
                <Form className="space-y-8">
                  {/* Email Field */}
                  <div className="form-control">
                    <label htmlFor="email" className="label">
                      <span className="label-text font-medium text-base">Email Address</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="input input-bordered input-lg w-full pl-12 text-base"
                        placeholder="you@example.com"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="form-error mt-2" />
                  </div>

                  {/* Password Field */}
                  <div className="form-control">
                    <label htmlFor="password" className="label">
                      <span className="label-text font-medium text-base">Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                      <Field name="password">
                        {({ field }: any) => (
                          <>
                            <input
                              {...field}
                              id="password"
                              autoComplete="current-password"
                              type={showPassword ? 'text' : 'password'}
                              className="input input-bordered input-lg w-full pl-12 pr-12 text-base"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content focus:outline-none"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </>
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="password" component="div" className="form-error mt-2" />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between py-4">
                    <label className="label cursor-pointer gap-3">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text text-base">Remember me</span>
                    </label>

                    <Link href="/auth/forgot-password" className="link link-primary text-base">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <div className="card-actions pt-4">
                    <Button
                      type="submit"
                      className="btn-primary w-full btn-lg text-base"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Footer Links */}
        <p className="text-center text-sm text-base-content/70">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="link link-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="link link-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}