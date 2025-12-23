import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Shield, Clock, Users, Star } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="hero bg-gradient-to-br from-primary/10 to-base-100 min-h-screen py-12">
      <div className="hero-content max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <div className="lg:pr-8">
          <div className="badge badge-primary badge-outline mb-6">
            Trusted by 10k+ fleets
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-base-content leading-tight mb-6">
            The Future of Fleet
            <span className="block text-primary">Management Starts Here</span>
          </h1>

          <p className="text-lg text-base-content/70 mb-8 max-w-xl">
            Connect vehicle owners, drivers, and customers on one modern platform —
            book vehicles, manage trips, and track performance with realtime insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/vehicles">
              <Button variant="outline" size="lg">
                Browse Vehicles
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg border border-base-300 rounded-lg">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <div className="stat-title">Security</div>
              <div className="stat-value text-primary">100%</div>
              <div className="stat-desc">Fully encrypted</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <Clock className="h-8 w-8" />
              </div>
              <div className="stat-title">Support</div>
              <div className="stat-value text-secondary">24/7</div>
              <div className="stat-desc">Always available</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <Users className="h-8 w-8" />
              </div>
              <div className="stat-title">Users</div>
              <div className="stat-value text-accent">10K+</div>
              <div className="stat-desc">Active daily users</div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="mockup-window bg-base-300 border">
            <div className="bg-base-200 flex justify-center px-4 py-16">
              <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm opacity-60">Total Trips</div>
                      <div className="text-2xl font-bold">127</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-60">Uptime</div>
                      <div className="text-2xl font-bold">94%</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-60">Earnings</div>
                      <div className="text-2xl font-bold">$12.5K</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="card bg-primary/10 p-3">
                      <div className="text-xs opacity-60">Active</div>
                      <div className="text-lg font-semibold">54</div>
                    </div>
                    <div className="card bg-secondary/10 p-3">
                      <div className="text-xs opacity-60">Idle</div>
                      <div className="text-lg font-semibold">12</div>
                    </div>
                    <div className="card bg-warning/10 p-3">
                      <div className="text-xs opacity-60">Alerts</div>
                      <div className="text-lg font-semibold">3</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="alert alert-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Trip #987 completed!</span>
                    </div>
                    
                    <div className="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 stroke-current shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Booking #1024 in progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="badge badge-accent absolute top-4 left-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            Live
          </div>
        </div>
      </div>
    </section>
  )
}