"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Shield, CheckCircle, ArrowLeft, Lock, Smartphone } from "lucide-react"
import Link from "next/link"
import { processFlutterwavePayment, saveServiceRequest } from "@/lib/firebase"

interface PlanData {
  service: string
  price?: string
  amount: number
}

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "ussd">("card")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
  })

  useEffect(() => {
    const data = localStorage.getItem("selectedPlan") || localStorage.getItem("pendingService")
    if (data) {
      try {
        const parsedData = JSON.parse(data)

        // Ensure we have the required fields with proper defaults
        const serviceData = {
          service: parsedData.service || "Unknown Service",
          price: parsedData.price || "₦0",
          amount: parsedData.amount || 0,
          formData: parsedData.formData || {},
        }

        setPlanData(serviceData)
      } catch (error) {
        console.error("Error parsing service data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePayment = async () => {
    if (!planData || !planData.amount) {
      toast({
        title: "Invalid service data",
        description: "Please select a service first",
        variant: "destructive",
      })
      return
    }

    if (!formData.phone || !formData.fullName || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Initialize Flutterwave payment
      const paymentResult = await processFlutterwavePayment({
        amount: planData.amount,
        email: formData.email,
        phone: formData.phone,
        name: formData.fullName,
        service: planData.service,
        userId: `guest_${Date.now()}`,
      })

      if (paymentResult.success) {
        // Save service request to database
        await saveServiceRequest({
          userId: `guest_${Date.now()}`,
          service: planData.service,
          amount: planData.amount,
          formData: formData,
          paymentId: paymentResult.transactionId,
          status: "pending",
          paymentMethod,
        })

        // Clear stored plan data
        localStorage.removeItem("selectedPlan")
        localStorage.removeItem("pendingService")

        toast({
          title: "Payment Successful! 🎉",
          description: "Your service request has been submitted successfully",
        })

        router.push("/success")
      } else {
        throw new Error(paymentResult.message || "Payment failed")
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!planData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  const paymentMethods = [
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: Shield,
      popular: false,
    }
  ]

  const displayPrice = planData?.price || `₦${(planData?.amount || 0).toLocaleString()}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 hover:bg-green-50 hover:text-green-600">
            <Link href="/select-plan" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Plan Selection
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Payment</h1>
            <p className="text-xl text-gray-600">Secure payment processing powered by Flutterwave</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>Your details for payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 800 123 4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment option</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        paymentMethod === method.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod(method.id as any)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === method.id ? "border-green-500 bg-green-500" : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <method.icon className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{method.name}</span>
                            {method.popular && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8">
              <Card className="shadow-2xl border-0 bg-white">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
                  <CardDescription>Review your purchase details</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Service Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{planData.service}</span>
                      <span className="font-bold text-gray-900">{displayPrice}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span className="text-green-600">{displayPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={loading || !formData.phone || !formData.fullName || !formData.email}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Pay {displayPrice} Securely
                      </div>
                    )}
                  </Button>

                  {/* Security Features */}
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">Secure Payment</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your payment is protected by Flutterwave's bank-level security and 256-bit SSL encryption.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>PCI Compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="text-center pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">98% success rate guarantee</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Professional service with dedicated support throughout the process.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
