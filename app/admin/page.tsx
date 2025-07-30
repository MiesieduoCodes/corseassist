"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { Search, Download, Eye, CheckCircle, XCircle } from "lucide-react"
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
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  useEffect(() => {
    // Check if user is admin (you can implement proper role checking)
    if (user && user.email !== "admin@nyscplatform.com") {
      router.push("/dashboard")
      return
    }

    if (user) {
      loadRequests()
    }
  }, [user, router])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter, serviceFilter])

  const loadRequests = async () => {
    try {
      // Mock data - replace with actual Firebase query
      const mockRequests: AdminRequest[] = [
        {
          id: "1",
          userId: "user1",
          service: "Direct Posting",
          status: "pending",
          amount: 25000,
          createdAt: new Date("2024-01-15"),
          formData: { fullName: "John Doe", preferredState: "Lagos" },
          userEmail: "john@example.com",
        },
        {
          id: "2",
          userId: "user2",
          service: "Relocation",
          status: "approved",
          amount: 20000,
          createdAt: new Date("2024-01-14"),
          formData: { fullName: "Jane Smith", desiredState: "Abuja" },
          userEmail: "jane@example.com",
        },
        {
          id: "3",
          userId: "user3",
          service: "PPA Change",
          status: "rejected",
          amount: 15000,
          createdAt: new Date("2024-01-13"),
          formData: { fullName: "Mike Johnson", desiredPPA: "Tech Company" },
          userEmail: "mike@example.com",
        },
      ]

      setRequests(mockRequests)
    } catch (error) {
      console.error("Error loading requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.formData.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.service.toLowerCase().includes(searchTerm.toLowerCase()),
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
      // Update in Firebase
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

  if (!user || user.email !== "admin@nyscplatform.com") {
    return <div>Access denied</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage NYSC service requests and applications</p>
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
            <CardTitle>Service Requests</CardTitle>
            <CardDescription>Manage and review all service applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{request.formData.fullName}</h3>
                        <p className="text-sm text-gray-600">{request.userEmail}</p>
                        <p className="text-sm text-gray-500">
                          {request.createdAt.toLocaleDateString()} • {request.service}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        <span className="font-bold">₦{request.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                            onClick={() => updateRequestStatus(request.id, "approved")}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
