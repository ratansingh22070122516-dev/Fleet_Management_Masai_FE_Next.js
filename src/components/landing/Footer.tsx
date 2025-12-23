import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'Browse Vehicles', href: '/vehicles' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Safety', href: '/safety' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ]
}

export const Footer = () => {
  return (
    <footer className="footer bg-base-200 text-base-content p-12 mt-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="footer gap-12">
          <aside className="max-w-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FleetManager</span>
            </div>
            <p className="text-base-content/70 mb-6 leading-relaxed">
              The comprehensive fleet management solution that connects vehicle owners, 
              drivers, and customers seamlessly.
            </p>
            <div className="flex gap-4">
              <a className="link hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a className="link hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a className="link hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </aside>
          
          <nav>
            <h6 className="footer-title">Platform</h6>
            {footerLinks.platform.map((link) => (
              <Link key={link.name} href={link.href} className="link link-hover">
                {link.name}
              </Link>
            ))}
          </nav>
          
          <nav>
            <h6 className="footer-title">Company</h6>
            {footerLinks.company.map((link) => (
              <Link key={link.name} href={link.href} className="link link-hover">
                {link.name}
              </Link>
            ))}
          </nav>
          
          <nav>
            <h6 className="footer-title">Support</h6>
            {footerLinks.support.map((link) => (
              <Link key={link.name} href={link.href} className="link link-hover">
                {link.name}
              </Link>
            ))}
          </nav>

          <nav className="space-y-3">
            <h6 className="footer-title text-lg">Contact Info</h6>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">support@fleetmanager.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
          </nav>
        </div>
        
        <div className="footer footer-center border-t border-base-300 pt-8 mt-12">
          <aside>
            <p className="text-base-content/60">© 2025 FleetManager. All rights reserved.</p>
          </aside>
        </div>
      </div>
    </footer>
  )
}