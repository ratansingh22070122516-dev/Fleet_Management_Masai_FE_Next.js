import { Car, Users, BarChart3, Shield, Clock, MapPin } from 'lucide-react'

const features = [
  {
    icon: Car,
    title: 'Vehicle Management',
    description: 'Complete vehicle lifecycle management with maintenance tracking, documentation, and performance analytics.'
  },
  {
    icon: Users,
    title: 'Multi-Role Support',
    description: 'Seamless experience for vehicle owners, drivers, and customers with role-based dashboards and permissions.'
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Comprehensive insights into fleet performance, revenue tracking, and operational efficiency metrics.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with data encryption, secure payments, and reliable 24/7 uptime.'
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Live GPS tracking, trip monitoring, and instant notifications for all stakeholders.'
  },
  {
    icon: MapPin,
    title: 'Location-based Services',
    description: 'Intelligent matching based on location, optimized routing, and proximity-based recommendations.'
  }
]

export const Features = () => {
  return (
    <section className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
            Everything you need to manage your fleet
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to efficiently manage vehicles, drivers, and customer bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-base-300 h-full"
              >
                <div className="card-body">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="card-title text-xl text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content max-w-4xl mx-auto">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl lg:text-3xl mb-4">
                Ready to revolutionize your fleet management?
              </h2>
              <p className="mb-6 text-primary-content/90 max-w-2xl">
                Join thousands of fleet managers who are already using our platform to streamline operations and increase profitability.
              </p>
              <div className="card-actions justify-center">
                <button className="btn btn-accent btn-lg">Start Free Trial</button>
                <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}