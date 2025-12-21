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
    <section className="py-20 bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage your fleet
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need 
            to efficiently manage vehicles, drivers, and customer bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="p-6 rounded-lg border border-transparent bg-white hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-white ring-1 ring-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}