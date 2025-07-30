"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, ArrowLeft, Receipt, AlertCircle } from "lucide-react"
import Link from "next/link"
import { saveServiceRequest } from "@/lib/firebase"

interface TransferData {
  service: string
  price: string
  amount: number
  customerInfo: {
    fullName: string
    email: string
  }
  formData?: any
}

export default function TransactionIdPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [transferData, setTransferData] = useState<TransferData | null>(null)
  const [loading, setLoading] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("transferData")
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        setTransferData(parsedData)
      } catch (error) {
        console.error("Error parsing transfer data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  const handleSubmitTransaction = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter your transaction ID or reference number",
        variant: "destructive",
      })
      return
    }

    if (!transferData) {
      toast({
        title: "Invalid data",
        description: "Transfer data not found",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Save service request to database
      await saveServiceRequest({
        userId: `guest_${Date.now()}`,
        service: transferData.service,
        amount: transferData.amount,
        formData: {
          ...transferData.formData,
          customerInfo: transferData.customerInfo,
          transactionId: transactionId.trim(),
        },
        paymentId: transactionId.trim(),
        status: "pending_verification",
        paymentMethod: "bank_transfer",
      })

      // Clear stored data
      localStorage.removeItem("transferData")
      localStorage.removeItem("pendingService")
      localStorage.removeItem("selectedPlan")

      toast({
        title: "Transaction Submitted Successfully! 🎉",
        description: "We'll verify your payment and process your request within 24 hours",
      })

      router.push("/success")
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!transferData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 hover:bg-green-50 hover:text-green-600">
            <Link href="/bank-transfer" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Bank Transfer
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Transaction Details</h1>
            <p className="text-xl text-gray-600">Enter your transaction ID to complete the process</p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">Transaction Information</CardTitle>
              <CardDescription>
                Please provide your transaction ID or reference number from your bank transfer
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{transferData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{transferData.customerInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{transferData.customerInfo.email}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-bold text-green-600">{transferData.price}</span>
                  </div>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-base font-semibold">
                  Transaction ID / Reference Number *
                </Label>
                <Input
                  id="transactionId"
                  placeholder="Enter your transaction ID (e.g., TXN123456789)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-green-500 text-base"
                  required
                />
                <p className="text-sm text-gray-600">
                  This is the reference number provided by your bank after the transfer
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Important Notice</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Make sure the transaction ID is correct and complete</li>
                      <li>• Keep your bank receipt for verification purposes</li>
                      <li>• We'll verify your payment within 2-4 hours</li>
                      <li>• You'll receive email updates on your application status</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitTransaction}
                disabled={loading || !transactionId.trim()}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Submit Transaction ID
                  </div>
                )}
              </Button>

              {/* Help Text */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Need help finding your transaction ID?{" "}
                  <span className="text-green-600 font-medium cursor-pointer hover:underline">Contact Support</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
