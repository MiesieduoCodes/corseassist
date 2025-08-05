"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, FileText, X } from "lucide-react"
import Link from "next/link"

export default function ChangePPAPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    stateCode: "",
    callUpNumber: "",
    currentPPA: "",
    currentPPAAddress: "",
    desiredPPA: "",
    desiredPPAAddress: "",
    reason: "",
    email: "",
  })

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image (JPG, PNG) or PDF file",
          variant: "destructive",
        })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded`,
      })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedFile) {
      toast({
        title: "Letter of request required",
        description: "Please upload your letter of request before proceeding",
        variant: "destructive",
      })
      return
    }

    const serviceData = {
      service: "PPA Change",
      amount: 30000,
      price: "₦",
      formData,
      uploadedFile: {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      },
    }

    localStorage.setItem("pendingService", JSON.stringify(serviceData))
    router.push("/payment")
  }

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

            <h1 className="text-3xl font-bold text-gray-900 mb-2">PPA Change Application</h1>
            <p className="text-gray-600">Apply to change your Place of Primary Assignment</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>PPA Change Form</CardTitle>
              <CardDescription>Fill out the form below and upload your letter of request</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="currentPPA">Current PPA</Label>
                  <Input
                    id="currentPPA"
                    placeholder="Enter your current PPA name"
                    value={formData.currentPPA}
                    onChange={(e) => handleChange("currentPPA", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPPAAddress">Current PPA Address</Label>
                  <Textarea
                    id="currentPPAAddress"
                    placeholder="Enter your current PPA full address"
                    value={formData.currentPPAAddress}
                    onChange={(e) => handleChange("currentPPAAddress", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredPPA">Desired PPA</Label>
                  <Input
                    id="desiredPPA"
                    placeholder="Enter your desired PPA name"
                    value={formData.desiredPPA}
                    onChange={(e) => handleChange("desiredPPA", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredPPAAddress">Desired PPA Address</Label>
                  <Textarea
                    id="desiredPPAAddress"
                    placeholder="Enter your desired PPA full address"
                    value={formData.desiredPPAAddress}
                    onChange={(e) => handleChange("desiredPPAAddress", e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for PPA Change</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain why you need to change your PPA (skill alignment, location, etc.)"
                    value={formData.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <Label>Letter of Request *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    {uploadedFile ? (
                      <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload Letter of Request</p>
                        <p className="text-gray-600 mb-4">
                          Upload your official letter requesting PPA change (PDF, JPG, PNG)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Service Fee</h3>
                  <p className="text-blue-800 text-xl font-bold">₦30,000</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Payment will be processed securely before form submission
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
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
