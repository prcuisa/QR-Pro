'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Ban,
  Check
} from 'lucide-react'

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  const adminStats = [
    {
      title: "Total Users",
      value: "10,234",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Active Subscriptions",
      value: "3,456",
      change: "+8.3%",
      trend: "up",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: "Rp 456.7M",
      change: "+23.1%",
      trend: "up",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "Total QR Codes",
      value: "125,678",
      change: "+15.7%",
      trend: "up",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-orange-600"
    }
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      plan: "Premium",
      status: "active",
      joined: "2024-01-15",
      lastActive: "2 hours ago",
      qrCodes: 45,
      scans: 1250,
      revenue: "Rp 299K"
    },
    {
      id: 2,
      name: "Budi Santoso",
      email: "budi@resto.com",
      plan: "Standard",
      status: "active",
      joined: "2024-01-14",
      lastActive: "1 day ago",
      qrCodes: 23,
      scans: 890,
      revenue: "Rp 99K"
    },
    {
      id: 3,
      name: "Maya Putri",
      email: "maya@agency.com",
      plan: "Enterprise",
      status: "active",
      joined: "2024-01-13",
      lastActive: "3 hours ago",
      qrCodes: 156,
      scans: 3450,
      revenue: "Custom"
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@example.com",
      plan: "Free",
      status: "inactive",
      joined: "2024-01-12",
      lastActive: "5 days ago",
      qrCodes: 3,
      scans: 45,
      revenue: "Rp 0"
    },
    {
      id: 5,
      name: "Lisa Wong",
      email: "lisa@company.com",
      plan: "Standard",
      status: "suspended",
      joined: "2024-01-11",
      lastActive: "1 week ago",
      qrCodes: 12,
      scans: 234,
      revenue: "Rp 99K"
    }
  ]

  const recentTransactions = [
    {
      id: "TRX001",
      user: "Sarah Johnson",
      plan: "Premium",
      amount: "Rp 299K",
      status: "completed",
      date: "2024-01-15 14:30",
      method: "Credit Card",
      invoice: "INV-2024-001"
    },
    {
      id: "TRX002",
      user: "Budi Santoso",
      plan: "Standard",
      amount: "Rp 99K",
      status: "completed",
      date: "2024-01-15 13:15",
      method: "Bank Transfer",
      invoice: "INV-2024-002"
    },
    {
      id: "TRX003",
      user: "Maya Putri",
      plan: "Enterprise",
      amount: "Rp 5M",
      status: "pending",
      date: "2024-01-15 12:00",
      method: "Wire Transfer",
      invoice: "INV-2024-003"
    },
    {
      id: "TRX004",
      user: "John Doe",
      plan: "Standard",
      amount: "Rp 99K",
      status: "failed",
      date: "2024-01-15 11:45",
      method: "Credit Card",
      invoice: "INV-2024-004"
    },
    {
      id: "TRX005",
      user: "Lisa Wong",
      plan: "Premium",
      amount: "Rp 299K",
      status: "completed",
      date: "2024-01-15 10:30",
      method: "PayPal",
      invoice: "INV-2024-005"
    }
  ]

  const systemHealth = [
    { metric: "API Response Time", value: "124ms", status: "healthy" },
    { metric: "Database Load", value: "45%", status: "healthy" },
    { metric: "Server CPU", value: "67%", status: "warning" },
    { metric: "Memory Usage", value: "78%", status: "warning" },
    { metric: "Storage", value: "234GB / 1TB", status: "healthy" },
    { metric: "Uptime", value: "99.9%", status: "healthy" }
  ]

  const planDistribution = [
    { plan: "Free", users: 6789, percentage: 66.3, color: "bg-gray-500" },
    { plan: "Standard", users: 2345, percentage: 22.9, color: "bg-blue-500" },
    { plan: "Premium", users: 890, percentage: 8.7, color: "bg-purple-500" },
    { plan: "Enterprise", users: 210, percentage: 2.1, color: "bg-amber-500" }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", variant: "default" as const, icon: <CheckCircle className="w-3 h-3" /> },
      inactive: { label: "Inactive", variant: "secondary" as const, icon: <XCircle className="w-3 h-3" /> },
      suspended: { label: "Suspended", variant: "destructive" as const, icon: <Ban className="w-3 h-3" /> },
      pending: { label: "Pending", variant: "outline" as const, icon: <Clock className="w-3 h-3" /> },
      completed: { label: "Completed", variant: "default" as const, icon: <CheckCircle className="w-3 h-3" /> },
      failed: { label: "Failed", variant: "destructive" as const, icon: <XCircle className="w-3 h-3" /> }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getHealthBadge = (status: string) => {
    const statusConfig = {
      healthy: { label: "Healthy", variant: "default" as const, color: "text-green-600" },
      warning: { label: "Warning", variant: "secondary" as const, color: "text-yellow-600" },
      critical: { label: "Critical", variant: "destructive" as const, color: "text-red-600" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.healthy
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts (3)
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-600 to-orange-600" />
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Users Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage and monitor all users
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">User</th>
                        <th className="text-left py-3 px-2">Plan</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">QR Codes</th>
                        <th className="text-left py-3 px-2">Scans</th>
                        <th className="text-left py-3 px-2">Revenue</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{user.plan}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-3 px-2 text-sm">{user.qrCodes}</td>
                          <td className="py-3 px-2 text-sm">{user.scans.toLocaleString()}</td>
                          <td className="py-3 px-2 text-sm font-medium">{user.revenue}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Monitor payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Transaction ID</th>
                        <th className="text-left py-3 px-2">User</th>
                        <th className="text-left py-3 px-2">Plan</th>
                        <th className="text-left py-3 px-2">Amount</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Method</th>
                        <th className="text-left py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-sm">{transaction.id}</p>
                              <p className="text-xs text-muted-foreground">{transaction.invoice}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm">{transaction.user}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline">{transaction.plan}</Badge>
                          </td>
                          <td className="py-3 px-2 text-sm font-medium">{transaction.amount}</td>
                          <td className="py-3 px-2">
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className="py-3 px-2 text-sm">{transaction.method}</td>
                          <td className="py-3 px-2 text-sm">{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemHealth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.metric}</p>
                        <p className="text-xs text-muted-foreground">{item.value}</p>
                      </div>
                      {getHealthBadge(item.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Plan Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planDistribution.map((plan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{plan.plan}</span>
                        <span className="text-sm text-muted-foreground">
                          {plan.users.toLocaleString()} ({plan.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${plan.color} h-2 rounded-full`}
                          style={{ width: `${plan.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Users
                </Button>
                <Button className="w-full" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Export Transactions
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Newsletter
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  System Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">New user registration</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Payment received</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">High server load</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Failed payment</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}