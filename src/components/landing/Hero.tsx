import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Shield, Clock, Users, Star } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="lg:pr-8">
            <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full mb-6 text-sm font-medium">
              Trusted by 10k+ fleets
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              The Future of Fleet
              <span className="block text-primary-600">Management Starts Here</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Connect vehicle owners, drivers, and customers on one modern platform —
              book vehicles, manage trips, and track performance with realtime insights.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500">Secure</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">10K+</div>
                  <div className="text-xs text-gray-500">Users</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <div className="rounded-2xl p-6 shadow-2xl" aria-hidden>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white p-6 lg:p-8 w-full max-w-md lg:max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-primary-200">Total Trips</div>
                      <div className="text-2xl font-bold">127</div>
                    </div>
                    <div>
                      <div className="text-sm text-primary-200">Uptime</div>
                      <div className="text-2xl font-bold">94%</div>
                    </div>
                    <div>
                      <div className="text-sm text-primary-200">Earnings</div>
                      <div className="text-2xl font-bold">$12.5K</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/6 rounded-lg p-3">
                      <div className="text-xs text-primary-200">Active</div>
                      <div className="text-lg font-semibold">54</div>
                    </div>
                    <div className="bg-white/6 rounded-lg p-3">
                      <div className="text-xs text-primary-200">Idle</div>
                      <div className="text-lg font-semibold">12</div>
                    </div>
                    <div className="bg-white/6 rounded-lg p-3">
                      <div className="text-xs text-primary-200">Alerts</div>
                      <div className="text-lg font-semibold">3</div>
                    </div>
                  </div>
                  <div className="bg-white/8 rounded-lg h-36 mb-6 p-4">
                    <div className="h-3 bg-primary-600 rounded w-24 mb-4"></div>
                    <div className="h-2 bg-white/30 rounded w-full mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-5/6 mb-2"></div>
                    <div className="h-2 bg-white/10 rounded w-4/6"></div>
                  </div>
                  <div className="space-y-3">
                    {["Booking #1024", "Trip #987", "Maintenance due"].map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/6 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded bg-primary-600/20 flex items-center justify-center text-primary-100 text-sm">•</div>
                          <div>
                            <div className="text-sm font-medium">{t}</div>
                            <div className="text-xs text-primary-200">{idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : 'In 3 days'}</div>
                          </div>
                        </div>
                        <div className="text-sm text-primary-200">{idx === 0 ? 'In Progress' : 'Completed'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -left-3 bg-white rounded-lg shadow p-2 border border-primary-100">
                <div className="text-xs text-gray-700 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary-600 block"/> Live</div>
              </div>

              <div className="absolute -bottom-3 -right-3 bg-white rounded-lg shadow p-2 border border-primary-100">
                <div className="text-xs text-gray-700 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary-600 block"/> Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}