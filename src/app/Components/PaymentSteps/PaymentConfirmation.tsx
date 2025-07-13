"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, DollarSign, Loader2, Shield } from "lucide-react";
import { Teacher } from "../../types/index";

interface PaymentFormData {
  type: "salary" | "bonus" | "deduction";
  amount: number;
  description: string;
}

interface PaymentConfirmationProps {
  teacher: Teacher;
  paymentData: PaymentFormData;
  isProcessing: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  teacher,
  paymentData,
  isProcessing,
  onConfirm,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Amount:</span>
            <span className="font-bold text-2xl text-green-600">
              ${paymentData.amount.toLocaleString()}
            </span>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Teacher:</span>
              <div className="text-right">
                <div className="font-medium">{teacher.name}</div>
                <div className="text-muted-foreground text-xs">
                  {teacher.role} • {teacher.subject}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Payment Type:</span>
              <span className="capitalize font-medium">{paymentData.type}</span>
            </div>
            {paymentData.description && (
              <div className="flex justify-between text-sm">
                <span className="font-medium">Description:</span>
                <span className="text-right max-w-48 truncate">
                  {paymentData.description}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="font-medium">Transaction Fee:</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span className="text-green-600">
              ${paymentData.amount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Secure Transaction
          </span>
        </div>
        <p className="text-xs text-blue-700">
          This payment will be processed securely. All transaction details will
          be recorded for audit purposes.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onConfirm} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payment ${paymentData.amount.toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
