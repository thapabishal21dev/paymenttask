"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Loader2,
} from "lucide-react";
import { ConfirmationStepProps } from "../types/index";
import { toast } from "sonner";

const LoadingShimmer = () => (
  <div className="space-y-4">
    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
  </div>
);

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  paymentData,
  selectedBank,
  selectedRecipient,
  selectedUPI,
  paymentMethod,
  otp,
  setOtp,
  isProcessing,
  setIsProcessing,
  showOtpInput,
  setShowOtpInput,
  onBack,
  onSuccess,
}) => {
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Show processing toast
      const processingToast = toast.loading("Processing payment...", {
        description: "Please wait while we process your payment",
      });

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Dismiss processing toast
      toast.dismiss(processingToast);

      setIsProcessing(false);
      setShowOtpInput(true);

      toast.info("OTP sent to your registered mobile number", {
        description: "Please enter the 6-digit code to complete the payment",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsProcessing(false);
      toast.error("Payment initiation failed", {
        description: "Please try again or contact support",
      });
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Show processing toast
      const processingToast = toast.loading("Verifying OTP...", {
        description: "Please wait while we verify your payment",
      });

      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Dismiss processing toast
      toast.dismiss(processingToast);

      // Show success toast
      toast.success("Payment Successful!", {
        description: `Payment of $${paymentData.amount?.toLocaleString()} has been processed successfully`,
        duration: 5000,
      });

      setIsProcessing(false);
      onSuccess();
    } catch (error) {
      setIsProcessing(false);
      toast.error("Payment Failed", {
        description:
          "There was an error processing your payment. Please try again.",
        duration: 6000,
      });
      console.error("OTP verification error:", error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Confirm Payment
        </DialogTitle>
        <DialogDescription>
          Review your payment details and complete the transaction
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">Amount:</span>
              <span className="font-bold text-2xl text-green-600">
                ${paymentData.amount?.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="space-y-3">
              {paymentMethod === "upi" && selectedUPI ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Payment Method:</span>
                    <div className="text-right">
                      <div className="font-medium flex items-center gap-2">
                        <span className="text-lg">{selectedUPI.logo}</span>
                        UPI Payment
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {selectedUPI.upiId} • {selectedUPI.provider}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">To:</span>
                    <div className="text-right">
                      <div className="font-medium">Teacher UPI Account</div>
                      <div className="text-muted-foreground text-xs">
                        Direct UPI Transfer
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">From:</span>
                    <div className="text-right">
                      <div className="font-medium">
                        {selectedBank?.bankName}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {selectedBank?.cardNumber} •{" "}
                        {selectedBank?.cardType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">To:</span>
                    <div className="text-right">
                      <div className="font-medium">
                        {selectedRecipient?.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {selectedRecipient?.bankName} •{" "}
                        {selectedRecipient?.accountNumber}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-medium">Payment Type:</span>
                <span className="capitalize font-medium">
                  {paymentData.type}
                </span>
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
                <span className="text-green-600 font-medium">
                  {paymentMethod === "upi" ? "FREE" : "FREE"}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-green-600">
                ${paymentData.amount?.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {isProcessing && !showOtpInput && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing your payment...</span>
              </div>
              <LoadingShimmer />
            </CardContent>
          </Card>
        )}

        {showOtpInput && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                OTP Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Secure Transaction
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  {paymentMethod === "upi"
                    ? "We've sent a verification code to your registered mobile number for UPI authentication"
                    : "We've sent a 6-digit verification code to your registered mobile number ending with ****1234"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    toast.info("A new OTP has been sent to your mobile");
                  }}
                >
                  Resend OTP
                </Button>
                <span className="text-xs text-muted-foreground">
                  OTP expires in 5:00
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              Security Notice
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Your payment is secured with bank-grade encryption. Never share your
            OTP with anyone.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {!showOtpInput ? (
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Pay ${paymentData.amount?.toLocaleString()}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleOtpVerification}
            disabled={isProcessing || otp.length !== 6}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify & Pay
              </>
            )}
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

export default ConfirmationStep;
