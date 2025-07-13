// hooks/usePayments.ts
import { useState, useEffect } from "react";
import { PaymentRecord } from "../types/index";
import { toast } from "sonner";

const samplePayments: PaymentRecord[] = [
  {
    id: "1",
    teacherId: "1",
    teacherName: "John Smith",
    amount: 4500,
    type: "salary",
    description: "Monthly salary - January 2024",
    date: "2024-01-15T10:00:00Z",
    status: "completed",
    transactionId: "TXN1705320000000",
  },
  {
    id: "2",
    teacherId: "2",
    teacherName: "Sarah Johnson",
    amount: 5200,
    type: "salary",
    description: "Monthly salary - January 2024",
    date: "2024-01-14T09:30:00Z",
    status: "pending",
  },
];

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = () => {
      try {
        const storedPayments = JSON.parse(
          localStorage.getItem("payments") || "[]"
        );
        const allPayments = [...storedPayments, ...samplePayments];
        allPayments.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPayments(allPayments);
      } catch (error) {
        console.error("Error loading payments:", error);
        toast.error("Failed to load payments");
        setPayments(samplePayments);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const addPayment = (payment: PaymentRecord) => {
    try {
      const existingPayments = JSON.parse(
        localStorage.getItem("payments") || "[]"
      );
      const updatedPayments = [payment, ...existingPayments];
      localStorage.setItem("payments", JSON.stringify(updatedPayments));
      setPayments((prev) => [payment, ...prev]);
      toast.success("Payment processed successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to process payment");
    }
  };

  return {
    payments,
    loading,
    addPayment,
  };
};
