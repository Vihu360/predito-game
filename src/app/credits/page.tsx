"use client";

import React, { useEffect, useState } from 'react';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  History,
  CreditCard
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useSession } from 'next-auth/react';
import { UserProps } from '@/lib/type';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CreditsPage = () => {
  const [credits, setCredits] = useState(50); // Example initial credits
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    const userId = (session?.user as UserProps)?.id;
    if (!userId) return;

    const fetchUserCredits = async () => {
      setIsLoading(true);
      try {
        const creditResponse = await axios.get(`/api/checkCredit?userId=${userId}`);
        console.log("creds log",creditResponse.data);
        const transactionRespone = await axios.get(`/api/checkTransaction?userId=${userId}`);
        console.log(transactionRespone.data);
        setCredits(creditResponse.data);
      } catch (err) {
        console.log(err);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchUserCredits();
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (amount < 100) {
      alert('Minimum withdrawal amount is 100 credits');
      return;
    }
    if (amount > credits) {
      alert('Insufficient credits');
      return;
    }
    // Handle withdrawal logic here
    setIsWithdrawDialogOpen(false);
    setWithdrawAmount('');
  };

  const handleRecharge = () => {
    const amount = Number(rechargeAmount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    // Handle recharge logic here
    setIsRechargeDialogOpen(false);
    setRechargeAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Credits Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Your Credits
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your credits, withdraw funds, or recharge your balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-white mb-8">
              {credits.toLocaleString()} <span className="text-2xl text-gray-400">credits</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsWithdrawDialogOpen(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              <Button
                onClick={() => setIsRechargeDialogOpen(true)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Recharge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Dialog */}
        <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
          <DialogContent className="bg-gray-800 text-white w-10/12">
            <DialogHeader>
              <DialogTitle>Withdraw Credits</DialogTitle>
              <DialogDescription className="text-gray-400">
                Minimum withdrawal amount is 100 credits
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Withdrawal Method</label>
                <Select onValueChange={setWithdrawMethod}>
                  <SelectTrigger className="bg-gray-700">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700">
                    <SelectItem value="bank" className='text-gray-200'>Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="100"
                  className="bg-gray-700"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <Alert className="bg-gray-700 border-yellow-600">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription className="text-gray-400">
                Withdrawals are processed within 24-48 hours.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsWithdrawDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                className="bg-red-600 hover:bg-red-700"
                disabled={!withdrawAmount || !withdrawMethod}
              >
                Withdraw Credits
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Recharge Dialog */}
        <Dialog open={isRechargeDialogOpen} onOpenChange={setIsRechargeDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Recharge Credits</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add credits to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {[100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className={`h-20 bg-gray-700 border-gray-600 hover:bg-gray-600 ${
                      Number(rechargeAmount) === amount ? 'border-blue-500' : ''
                    }`}
                    onClick={() => setRechargeAmount(amount.toString())}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{amount}</div>
                      <div className="text-sm text-gray-400">credits</div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Or enter custom amount</label>
                <Input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="bg-gray-700"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsRechargeDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRecharge}
                className="bg-green-600 hover:bg-green-700"
                disabled={!rechargeAmount}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CreditsPage;