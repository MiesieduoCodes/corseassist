"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            NYSC Platform
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Services
            </Link>
            <Link href="/#testimonials" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Reviews
            </Link>
            <Link href="/#contact" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
            >
              <Link href="/#services">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/#services" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                Services
              </Link>
              <Link href="/#testimonials" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                Reviews
              </Link>
              <Link href="/#contact" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                Contact
              </Link>
              <div className="pt-4 border-t">
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full"
                >
                  <Link href="/#services">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
