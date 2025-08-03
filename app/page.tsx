import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Clock, Users, Star, ArrowRight, Zap, Award, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  const services = [
    {
      title: "Direct Posting",
      description: "Get posted directly to your preferred state and location with guaranteed approval",
      features: ["State of choice", "Location preference", "Fast processing", "24/7 support", "Guaranteed approval"],
      popular: true,
      icon: "🎯",
      href: "/services/direct-posting",
    },
    {
      title: "Relocation",
      description: "Seamlessly relocate to a different state during your service year",
      features: [
        "Any state relocation",
        "Medical/family reasons accepted",
        "Quick approval process",
        "Document assistance",
        "Status tracking",
      ],
      popular: false,
      icon: "🚀",
      href: "/services/relocation",
    },
    {
      title: "PPA Change",
      description: "Change your Place of Primary Assignment to match your career goals and professional development",
      features: ["Better workplace", "Skill alignment", "Location change", "Professional growth", "Career guidance"],
      popular: false,
      icon: "💼",
      href: "/services/change-ppa",
    },
  ]

  const stats = [
    { label: "Happy Clients", value: "5,000+", icon: Users, color: "text-blue-600" },
    { label: "Success Rate", value: "80%", icon: CheckCircle, color: "text-green-600" },
    { label: "Processing Time", value: "24hrs", icon: Clock, color: "text-orange-600" },
    { label: "Secure Platform", value: "100%", icon: Shield, color: "text-purple-600" },
  ]

  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Corps Member",
      content: "Got my direct posting to Lagos in just 2 days! The process was seamless and professional.",
      rating: 5,
      initials: "AJ",
    },
    {
      name: "Fatima Mohammed",
      role: "Corps Member",
      content: "Relocated from Kano to Abuja without any stress. Highly recommend their services!",
      rating: 5,
      initials: "FM",
    },
    {
      name: "Chinedu Okafor",
      role: "Corps Member",
      content: "Changed my PPA to a tech company. Now I'm gaining relevant experience in my field.",
      rating: 5,
      initials: "CO",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 px-4 py-2 text-sm font-medium">
                ⭐ Trusted by 5,000+ Corps Members
              </Badge>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your Gateway to
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                Seamless NYSC Services
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Professional assistance for direct posting, relocation, and PPA changes.
              <span className="font-semibold text-green-600">Fast, secure, and reliable</span> service with 80% success
              rate.
            </p>

            <div className="flex justify-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="#services" className="flex items-center gap-2">
                  View Services <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Licensed & Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 group-hover:shadow-lg transition-shadow duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose Your Path to Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional NYSC services designed to make your service year smooth, stress-free, and aligned with your
              goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Link key={index} href={service.href} className="block">
                <Card
                  className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 cursor-pointer h-full ${service.popular ? "ring-2 ring-green-500 shadow-xl scale-105" : "shadow-lg"}`}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <CardTitle className="text-2xl font-bold mb-4">{service.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied corps members who have successfully achieved their NYSC goals with our help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your NYSC Experience?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied corps members who trust our platform for their NYSC needs. Get started today!
          </p>
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              <Link href="#services" className="flex items-center gap-2">
                Choose Service <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                CorpsAssist
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted partner for all NYSC services and requirements. We make your service year journey smooth
                and successful.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Direct Posting</li>
                <li className="hover:text-white transition-colors cursor-pointer">Relocation</li>
                <li className="hover:text-white transition-colors cursor-pointer">PPA Change</li>
                <li className="hover:text-white transition-colors cursor-pointer">Document Processing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@corpsassist.shop</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 CorpsAssist. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
