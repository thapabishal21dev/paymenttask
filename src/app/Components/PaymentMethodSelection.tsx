import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Building2,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react";

interface PaymentMethodSelectionProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  selectedMethod,
  setSelectedMethod,
  paymentAmount,
  onBack,
  onNext,
}) => {
  const handleMethodSelection = () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    onNext();
  };

  const paymentMethods = [
    {
      id: "upi",
      title: "UPI",
      subtitle: "Pay instantly with UPI apps",
      description: "Google Pay, PhonePe, Paytm, BHIM & more",
      icon: Smartphone,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      popular: true,
      instant: true,
      free: true,
      features: ["Instant Transfer", "No Charges", "Most Popular"],
      processingTime: "Instant",
    },
    {
      id: "card",
      title: "Cards",
      subtitle: "Debit & Credit Cards",
      description: "Visa, Mastercard, RuPay supported",
      icon: CreditCard,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
      popular: false,
      instant: true,
      free: false,
      features: ["Secure Payment", "Wide Acceptance", "Instant"],
      processingTime: "Instant",
    },
    {
      id: "netbanking",
      title: "Net Banking",
      subtitle: "Internet Banking",
      description: "All major banks supported",
      icon: Building2,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
      popular: false,
      instant: false,
      free: true,
      features: ["Bank Level Security", "No Charges", "Reliable"],
      processingTime: "1-2 minutes",
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Choose Payment Method
        </DialogTitle>
        <DialogDescription>
          Select how you want to pay ₹{paymentAmount?.toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <RadioGroup
          value={selectedMethod}
          onValueChange={setSelectedMethod}
          className="space-y-3"
        >
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <div key={method.id} className="flex items-center space-x-2">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <Card
                    className={`
                      hover:shadow-md transition-all duration-200 
                      ${isSelected ? `${method.borderColor} border-2 shadow-sm` : "border hover:border-gray-300"}
                      ${isSelected ? method.bgColor : "hover:bg-gray-50"}
                    `}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${method.bgColor} ${method.borderColor} border-2
                          `}
                          >
                            <IconComponent
                              className={`h-6 w-6 ${method.textColor}`}
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {method.title}
                              </h3>
                              {method.popular && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                              {method.instant && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 text-xs"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  Instant
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {method.subtitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {method.processingTime}
                            </div>
                            {method.free && (
                              <Badge variant="outline" className="text-xs">
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {method.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 text-xs text-gray-600"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Payment Summary */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount to pay:</span>
              <span className="text-lg font-bold">
                ₹{paymentAmount?.toLocaleString()}
              </span>
            </div>
            {selectedMethod && (
              <div className="mt-2 text-xs text-gray-500">
                via {paymentMethods.find((m) => m.id === selectedMethod)?.title}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Secure Payment
            </span>
          </div>
          <p className="text-xs text-blue-700">
            All payments are processed through secure, encrypted channels. Your
            financial information is never stored on our servers.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleMethodSelection} disabled={!selectedMethod}>
          Continue with{" "}
          {selectedMethod
            ? paymentMethods.find((m) => m.id === selectedMethod)?.title
            : "Payment"}
        </Button>
      </DialogFooter>
    </>
  );
};

export default PaymentMethodSelection;
