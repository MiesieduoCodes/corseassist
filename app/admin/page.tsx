"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Search, Download, Eye, CheckCircle, XCircle, Table, Phone, Mail, Calendar, CreditCard, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminRequest {
  id: string
  userId: string
  service: string
  status: "pending" | "approved" | "rejected"
  amount: number
  createdAt: Date
  formData: any
  userEmail: string
  phoneNumber?: string
  transactionId?: string
  paymentMethod?: string
  fullName?: string
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push("/admin-login")
      return
    }

    if (user.email !== "Admin@admin.com") {
      router.push("/admin-login")
      return
    }

    loadRequests()
  }, [user, router])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, serviceFilter])

  const loadRequests = async () => {
    try {
      // Load real data from localStorage (for now, will be replaced with Firebase)
      const storedRequests = localStorage.getItem("serviceRequests")
      if (storedRequests) {
        const requests = JSON.parse(storedRequests)
        setRequests(requests)
      } else {
        // Add some sample data for testing
        const sampleRequests: AdminRequest[] = [
          {
            id: "sample_1",
          userId: "user1",
          service: "Direct Posting",
          status: "pending",
          amount: 25000,
          createdAt: new Date("2024-01-15"),
          formData: { fullName: "John Doe", preferredState: "Lagos" },
          userEmail: "john@example.com",
            phoneNumber: "08012345678",
            transactionId: "TXN123456789",
            paymentMethod: "bank_transfer",
            fullName: "John Doe",
        },
        {
            id: "sample_2",
          userId: "user2",
          service: "Relocation",
          status: "approved",
          amount: 20000,
          createdAt: new Date("2024-01-14"),
          formData: { fullName: "Jane Smith", desiredState: "Abuja" },
          userEmail: "jane@example.com",
            phoneNumber: "08087654321",
            transactionId: "TXN987654321",
            paymentMethod: "bank_transfer",
            fullName: "Jane Smith",
        },
        {
            id: "sample_3",
          userId: "user3",
          service: "PPA Change",
          status: "rejected",
            amount: 30000,
          createdAt: new Date("2024-01-13"),
          formData: { fullName: "Mike Johnson", desiredPPA: "Tech Company" },
          userEmail: "mike@example.com",
            phoneNumber: "08055555555",
            transactionId: "TXN555555555",
            paymentMethod: "bank_transfer",
            fullName: "Mike Johnson",
        },
      ]
        setRequests(sampleRequests)
        localStorage.setItem("serviceRequests", JSON.stringify(sampleRequests))
      }
    } catch (error) {
      console.error("Error loading requests:", error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          (request.formData?.fullName || request.fullName || "")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.transactionId || "")?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter((request) => request.service === serviceFilter)
    }

    setFilteredRequests(filtered)
  }

  const updateRequestStatus = async (requestId: string, newStatus: "approved" | "rejected") => {
    try {
      // Update in localStorage
      const existingRequests = localStorage.getItem("serviceRequests")
      if (existingRequests) {
        const requests = JSON.parse(existingRequests)
        const updatedRequests = requests.map((request: AdminRequest) => 
          request.id === requestId ? { ...request, status: newStatus } : request
        )
        localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests))
      }

      // Update state
      setRequests((prev) =>
        prev.map((request) => (request.id === requestId ? { ...request, status: newStatus } : request)),
      )
    } catch (error) {
      console.error("Error updating request status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    revenue: requests.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0),
  }

  if (!user || user.email !== "Admin@admin.com") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Access denied. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage NYSC service requests and applications</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              logout()
              router.push("/admin-login")
            }}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₦{stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Direct Posting">Direct Posting</SelectItem>
                  <SelectItem value="Relocation">Relocation</SelectItem>
                  <SelectItem value="PPA Change">PPA Change</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Table className="w-5 h-5" />
               Service Requests Table
             </CardTitle>
             <CardDescription>Manage and review all service applications with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                 <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No requests found</p>
                 <p className="text-sm text-gray-500">Service requests will appear here once users submit applications</p>
              </div>
            ) : (
               <div className="overflow-x-auto">
                 <table className="w-full border-collapse">
                   <thead>
                     <tr className="border-b border-gray-200 bg-gray-50">
                       <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Contact</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Service</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Amount</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Transaction ID</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                       <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                {filteredRequests.map((request) => (
                       <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                         <td className="p-3">
                      <div>
                             <p className="font-medium text-gray-900">
                               {request.formData?.fullName || request.fullName || "N/A"}
                             </p>
                             <p className="text-sm text-gray-500">{request.userEmail}</p>
                           </div>
                         </td>
                         <td className="p-3">
                           <div className="flex items-center gap-1 text-sm text-gray-600">
                             <Phone className="w-3 h-3" />
                             {request.formData?.phoneNumber || request.phoneNumber || "N/A"}
                      </div>
                         </td>
                         <td className="p-3">
                           <Badge variant="outline" className="text-xs">
                             {request.service}
                           </Badge>
                         </td>
                         <td className="p-3">
                           <span className="font-semibold text-green-600">
                             ₦{request.amount.toLocaleString()}
                           </span>
                         </td>
                         <td className="p-3">
                           <div className="flex items-center gap-1">
                             <CreditCard className="w-3 h-3 text-gray-400" />
                             <span className="text-xs font-mono text-gray-600">
                               {request.transactionId || "N/A"}
                             </span>
                      </div>
                         </td>
                         <td className="p-3">
                           <div className="flex items-center gap-1 text-sm text-gray-600">
                             <Calendar className="w-3 h-3" />
                             {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                         </td>
                         <td className="p-3">
                           <Badge className={getStatusColor(request.status)}>
                             {request.status}
                           </Badge>
                         </td>
                         <td className="p-3">
                           <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                               <Eye className="w-3 h-3 mr-1" />
                               View
                      </Button>
                      {request.status === "pending" && (
                               <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                            onClick={() => updateRequestStatus(request.id, "approved")}
                          >
                                   <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                          >
                                   <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                               </>
                      )}
                    </div>
                         </td>
                       </tr>
                ))}
                   </tbody>
                 </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
