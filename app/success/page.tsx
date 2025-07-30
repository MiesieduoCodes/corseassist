import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your NYSC service request has been submitted successfully. We'll process your application within 24-48
            hours.
          </p>

          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
              <CardDescription>Here's what you can expect from our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Application Review</h3>
                  <p className="text-gray-600 text-sm">
                    Our team will review your application and documents within 2-4 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Processing</h3>
                  <p className="text-gray-600 text-sm">We'll begin processing your request with NYSC officials</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Updates</h3>
                  <p className="text-gray-600 text-sm">
                    You'll receive SMS and email updates on your application status
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Completion</h3>
                  <p className="text-gray-600 text-sm">Your request will be completed within 24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Phone className="w-4 h-4" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800">
                <Mail className="w-4 h-4" />
                <span>support@nyscplatform.com</span>
              </div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            <Link href="/" className="flex items-center gap-2">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
