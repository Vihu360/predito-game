"use client"

import React from 'react';
import { 
  Users,
  Wallet,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

import { useAdminGuard } from '@/lib/adminGuard';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminGuard();

  console.log("is admin",isAdmin);
  console.log(isLoading);

  if (isLoading === true) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black ">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    )
  }
  if (!isAdmin) return null;
  
  // Mock data - replace with real data from your backend
  const withdrawalRequests = [
    { id: 1, user: "John Doe", amount: 500, status: "pending", date: "2025-01-03" },
    { id: 2, user: "Jane Smith", amount: 1200, status: "approved", date: "2025-01-02" },
    { id: 3, user: "Mike Johnson", amount: 800, status: "rejected", date: "2025-01-01" },
  ];

  const recentActivity = [
    { id: 1, action: "New user signup", user: "Alice Cooper", time: "2 hours ago" },
    { id: 2, action: "Credit purchase", user: "Bob Dylan", time: "5 hours ago" },
    { id: 3, action: "Game completed", user: "Charlie Parker", time: "1 day ago" },
  ];

  const stats = {
    totalUsers: 1234,
    activeUsers: 789,
    totalRevenue: 45600,
    pendingWithdrawals: 8
  };

  const getStatusIcon = (status : string) => {
    switch(status) {
      case 'pending':
        return <AlertCircle className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="text-green-500" />;
      case 'rejected':
        return <XCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your application and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-200 text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-200 text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{stats.activeUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-200 text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">${stats.totalRevenue}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-200 text-sm font-medium">Pending Withdrawals</CardTitle>
              <Wallet className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{stats.pendingWithdrawals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Requests */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(request.status)}
                        <div>
                          <div className="font-medium">{request.user}</div>
                          <div className="text-sm text-gray-400">{request.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold">${request.amount}</div>
                        <button className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700"
                    >
                      <ArrowUpRight className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-gray-400">
                          {activity.user} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;