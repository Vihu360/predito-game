"use client"

import React, { useEffect, useState } from 'react';
import {
  Users,
  Wallet,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  XIcon
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAdminGuard } from '@/lib/adminGuard';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Agent {
  id: string;
  email: string;
  name: string;
}

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminGuard();
  const [openDialogAddAgents, setOpenDialogAddAgents] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [newAgent, setNewAgent] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);


  // Mock data - replace with real data from your backend
  const stats = {
    activeUsers: 789,
    totalRevenue: 45600,
    pendingWithdrawals: 8
  };

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


  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get('/api/adminAccessData');
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const getAgents = async () => {
      try {
        const response = await axios.get('/api/getAgents');
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (isAdmin) {
      getUserData();
      getAgents();
    }
  }, [isAdmin]);

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const handleAddAgent = async () => {

    if (agents.some((agent) => agent.email === newAgent)) {
      alert('Agent already exists');
      return;
    }

    const response = await axios.post('/api/addingAgent', { email: newAgent });

    if (response.status === 200) {
      setAgents([...agents, response.data.agent]);
      console.log("updated agents", agents);
    }
    else {
      alert('Error adding agent, please contact admin');
    }

    setOpenDialogAddAgents(false);
    setNewAgent('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleDeleteClick = (agentId: string) => {
    setSelectedAgentId(agentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAgentId || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/deleteAgent?agentId=${selectedAgentId}`);
      
      if (response.status === 200) {
        setAgents(prevAgents => prevAgents.filter(agent => agent.id !== selectedAgentId));
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedAgentId(null);
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
              <div className="text-2xl font-bold text-gray-100">{allUsers.length}</div>
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

          {/* Agents */}

          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className='grid grid-cols-2 items-center justify-between'>
                <CardTitle className="text-gray-200">Agents</CardTitle>
                <Button
                  onClick={() => setOpenDialogAddAgents(true)}
                  className="h-10 bg-white hover:bg-gray-100 text-gray-900 font-medium relative flex items-center justify-center"
                >
                  Add Agents
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold text-white">{agent.name}</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleDeleteClick(agent.id)}
                          className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

              {/* Delete Confirmation Dialog */}

              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent className="bg-gray-800 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    This action cannot be undone. This will permanently delete the agent.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className="bg-gray-700 text-white hover:bg-gray-600"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>



            {/* Dialog for Adding Agents */}

            {openDialogAddAgents && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center m-6">
                <div className="bg-gray-700 rounded-lg w-full max-w-md p-6">
                  <div className='flex justify-between'>
                    <h3 className="text-lg font-medium mb-4">Add Agent</h3>
                    <XIcon
                      onClick={() => {
                        setOpenDialogAddAgents(false);
                        setNewAgent('');
                      }}
                      className="h-6 w-6 text-gray-200 cursor-pointer hover:text-gray-300"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        value={newAgent}
                        onChange={(e) => setNewAgent(e.target.value)}
                        className="col-span-3 p-2 border rounded text-black"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setOpenDialogAddAgents(false);
                        setNewAgent('');
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAgent}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                    >
                      Add Agent
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;