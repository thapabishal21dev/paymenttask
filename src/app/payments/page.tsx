"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, Filter, Loader2 } from "lucide-react";
import { usePayments } from "../hooks/usePayments";
import {
  BankAccount,
  PaymentData,
  PaymentRecord,
  RecipientAccount,
} from "../types/index";
import { toast } from "sonner";
import { Teacher } from "../types/index";
// Code split the PaymentModal
const NewPaymentModal = dynamic(() => import("../Components/PaymentModal"), {
  loading: () => <div>Loading payment modal...</div>,
});

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);

  const { payments, loading, addPayment } = usePayments();

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce(
      (sum, p) => sum + (p.type === "deduction" ? -p.amount : p.amount),
      0
    );

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthPayments = payments.filter((p) => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return (
      paymentDate.getMonth() === now.getMonth() &&
      paymentDate.getFullYear() === now.getFullYear()
    );
  });

  const successRate =
    payments.length > 0
      ? Math.round(
          (payments.filter((p) => p.status === "completed").length /
            payments.length) *
            100
        )
      : 0;

  const handleViewDetails = (payment: PaymentRecord) => {
    toast.info(
      `Transaction Details:
      Transaction ID: ${payment.transactionId || "N/A"}
      Teacher: ${payment.teacherName}
      Amount: $${payment.amount}
      Type: ${payment.type}
      Status: ${payment.status}
      Date: ${new Date(payment.date).toLocaleString()}`,
      {
        duration: 8000,
      }
    );
  };

  // Remove local NewPaymentData type and use the type expected by PaymentModal

  const handleNewPaymentSuccess = (paymentData: {
    teacher: Teacher | null;
    paymentData: Partial<PaymentData>;
    selectedBank?: BankAccount;
    selectedRecipient?: RecipientAccount;
    otp: string;
    timestamp: string;
    transactionId: string;
  }) => {
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      teacherId: paymentData.teacher?.id ?? "",
      teacherName: paymentData.teacher?.name ?? "",
      amount: paymentData.paymentData.amount ?? 0,
      type: paymentData.paymentData.type ?? "salary",
      description: paymentData.paymentData.description ?? "",
      date: new Date().toISOString(),
      status: "completed",
      transactionId: paymentData.transactionId,
    };

    addPayment(newPayment);
    setIsNewPaymentModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payments
          </h2>
          <p className="text-muted-foreground">
            Manage and track all teacher payments
          </p>
        </div>
        <Button
          onClick={() => setIsNewPaymentModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "completed").length}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              ${pendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} pending
              payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {thisMonthPayments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              $
              {thisMonthPayments
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}{" "}
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Payment History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Payment History
              </CardTitle>
              <CardDescription>
                Search and filter payment transactions (
                {filteredPayments.length} results)
              </CardDescription>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by teacher name, description, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="deduction">Deduction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "No payments found matching your filters."
                  : "No payments available."}
              </div>
              {(searchTerm ||
                statusFilter !== "all" ||
                typeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">
                      Transaction ID
                    </TableHead>
                    <TableHead className="min-w-[150px]">Teacher</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[200px]">
                      Description
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">
                        {payment.transactionId ? (
                          <div>
                            <div className="font-medium truncate">
                              {payment.transactionId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium truncate">
                          {payment.teacherName}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="capitalize">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            payment.type === "deduction"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {payment.type === "deduction" ? "-" : "+"}$
                          {payment.amount.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <div className="truncate" title={payment.description}>
                          {payment.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          {new Date(payment.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.date).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Payment Modal */}
      {isNewPaymentModalOpen && (
        <NewPaymentModal
          isOpen={isNewPaymentModalOpen}
          onClose={() => setIsNewPaymentModalOpen(false)}
          onSuccess={handleNewPaymentSuccess}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
