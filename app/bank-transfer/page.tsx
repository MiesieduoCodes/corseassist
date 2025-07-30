"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { Copy, CheckCircle, ArrowLeft, Building2, Clock, Shield } from "lucide-react"
import Link from "next/link"

interface TransferData {
  service: string
  price: string
  amount: number
  customerInfo: {
    fullName: string
    email: string
  }
}

export default function BankTransferPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [transferData, setTransferData] = useState<TransferData | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

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

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "NYSC Platform Services",
    accountNumber: "2034567890",
    sortCode: "011151003",
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field)
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      })
      setTimeout(() => setCopied(null), 2000)
    })
  }

  if (!transferData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6 hover:bg-green-50 hover:text-green-600">
            <Link href="/payment" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Payment
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bank Transfer Details</h1>
            <p className="text-xl text-gray-600">Complete your payment using the bank details below</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bank Details */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-green-600" />
                    Bank Account Details
                  </CardTitle>
                  <CardDescription>Transfer the exact amount to this account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold text-gray-900">{bankDetails.bankName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.bankName, "Bank Name")}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {copied === "Bank Name" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Account Name</p>
                        <p className="font-semibold text-gray-900">{bankDetails.accountName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.accountName, "Account Name")}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {copied === "Account Name" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div>
                        <p className="text-sm text-green-700">Account Number</p>
                        <p className="font-bold text-green-900 text-lg">{bankDetails.accountNumber}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")}
                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                      >
                        {copied === "Account Number" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Sort Code</p>
                        <p className="font-semibold text-gray-900">{bankDetails.sortCode}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(bankDetails.sortCode, "Sort Code")}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {copied === "Sort Code" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div>
                        <p className="text-sm text-blue-700">Amount to Transfer</p>
                        <p className="font-bold text-blue-900 text-2xl">{transferData.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transferData.amount.toString(), "Amount")}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                      >
                        {copied === "Amount" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Transfer the exact amount <strong>{transferData.price}</strong> to the account above
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Use your full name <strong>"{transferData.customerInfo.fullName}"</strong> as the transfer
                        reference
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Keep your transfer receipt for verification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <span>Click "I've Made the Transfer" below after completing the payment</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Confirmation */}
            <div className="lg:sticky lg:top-8">
              <Card className="shadow-2xl border-0 bg-white mb-6">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
                  <CardDescription>Service: {transferData.service}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Customer</span>
                      <span className="text-gray-900">{transferData.customerInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Email</span>
                      <span className="text-gray-900 text-sm">{transferData.customerInfo.email}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total Amount</span>
                        <span className="text-green-600">{transferData.price}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/transaction-id")}
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I've Sent the Money
                  </Button>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Processing Time</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Your payment will be verified within 2-4 hours. We'll send you an email confirmation once
                      verified.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Secure & Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      All transfers are monitored and verified by our secure payment system.
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
