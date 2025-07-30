"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

const premiumStates = ["Lagos", "FCT"]

export default function RelocationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    stateCode: "",
    callUpNumber: "",
    currentState: "",
    currentLGA: "",
    desiredState: "",
    desiredLGA: "",
    reason: "",
    email: "",
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculatePrice = () => {
    if (!formData.desiredState) return { amount: 0, price: "₦0" }

    const isPremium = premiumStates.includes(formData.desiredState)
    const amount = isPremium ? 150000 : 70000
    const price = `₦${amount.toLocaleString()}`

    return { amount, price }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.desiredState) {
      toast({
        title: "Please select a state",
        description: "You must select your desired state to continue",
        variant: "destructive",
      })
      return
    }

    const { amount, price } = calculatePrice()

    const serviceData = {
      service: "Relocation",
      amount,
      price,
      formData,
    }

    localStorage.setItem("pendingService", JSON.stringify(serviceData))
    router.push("/payment")
  }

  const { amount, price } = calculatePrice()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Link>
            </Button>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Relocation Application</h1>
            <p className="text-gray-600">Apply to relocate to a different state during your service year</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relocation Form</CardTitle>
              <CardDescription>Fill out the form below to apply for relocation service</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateCode">State Code</Label>
                    <Input
                      id="stateCode"
                      placeholder="e.g., NY/22A/1234"
                      value={formData.stateCode}
                      onChange={(e) => handleChange("stateCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="callUpNumber">Call-up Number</Label>
                    <Input
                      id="callUpNumber"
                      placeholder="Enter your call-up number"
                      value={formData.callUpNumber}
                      onChange={(e) => handleChange("callUpNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentState">Current State</Label>
                    <Select onValueChange={(value) => handleChange("currentState", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentLGA">Current LGA</Label>
                    <Input
                      id="currentLGA"
                      placeholder="Enter current LGA"
                      value={formData.currentLGA}
                      onChange={(e) => handleChange("currentLGA", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="desiredState">Desired State *</Label>
                    <Select onValueChange={(value) => handleChange("desiredState", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select desired state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            <div className="flex items-center justify-between w-full">
                              <span>{state}</span>
                              {premiumStates.includes(state) && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  Premium
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desiredLGA">Desired LGA</Label>
                    <Input
                      id="desiredLGA"
                      placeholder="Enter desired LGA"
                      value={formData.desiredLGA}
                      onChange={(e) => handleChange("desiredLGA", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Relocation</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why you need to relocate (medical, family, etc.)"
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Dynamic Pricing Display */}
                {formData.desiredState && (
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      premiumStates.includes(formData.desiredState)
                        ? "bg-orange-50 border-orange-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin
                        className={`w-5 h-5 ${
                          premiumStates.includes(formData.desiredState) ? "text-orange-600" : "text-blue-600"
                        }`}
                      />
                      <h3
                        className={`font-semibold ${
                          premiumStates.includes(formData.desiredState) ? "text-orange-900" : "text-blue-900"
                        }`}
                      >
                        Service Fee for {formData.desiredState}
                      </h3>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        premiumStates.includes(formData.desiredState) ? "text-orange-800" : "text-blue-800"
                      }`}
                    >
                      {price}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        premiumStates.includes(formData.desiredState) ? "text-orange-700" : "text-blue-700"
                      }`}
                    >
                      {premiumStates.includes(formData.desiredState)
                        ? "Premium location - Lagos/Abuja pricing"
                        : "Standard location pricing"}
                    </p>
                  </div>
                )}

                {/* Pricing Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Pricing Information</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Lagos & FCT (Abuja):</span>
                      <span className="font-semibold">₦150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other States:</span>
                      <span className="font-semibold">₦70,000</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !formData.desiredState}>
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
