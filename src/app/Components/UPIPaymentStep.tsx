import React, { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Plus,
  ArrowLeft,
  X,
  QrCode,
  Zap,
  CheckCircle,
  Clock,
  Building2,
} from "lucide-react";

interface UPIAccount {
  id: string;
  upiId: string;
  name: string;
  provider: string;
  logo: string;
  verified: boolean;
}

interface UPIPaymentStepProps {
  selectedUPI: string;
  setSelectedUPI: (upiId: string) => void;
  upiAccounts: UPIAccount[];
  setUpiAccounts: (accounts: UPIAccount[]) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
}

// Popular UPI apps with their branding
const upiProviders = [
  { name: "Google Pay", logo: "🔵", color: "#4285f4" },
  { name: "PhonePe", logo: "🟣", color: "#5f259f" },
  { name: "Paytm", logo: "🔵", color: "#00baf2" },
  { name: "Amazon Pay", logo: "🟠", color: "#ff9900" },
  { name: "BHIM", logo: "🔴", color: "#ed1c24" },
  { name: "WhatsApp Pay", logo: "🟢", color: "#25d366" },
  { name: "MobiKwik", logo: "🔵", color: "#2e5bba" },
  { name: "Freecharge", logo: "🟡", color: "#ffc107" },
];

const UPIPaymentStep: React.FC<UPIPaymentStepProps> = ({
  selectedUPI,
  setSelectedUPI,
  upiAccounts,
  setUpiAccounts,
  paymentAmount,
  onBack,
  onNext,
}) => {
  const [showAddUPIForm, setShowAddUPIForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [newUPIForm, setNewUPIForm] = useState({
    upiId: "",
    name: "",
    provider: "",
  });

  const handleUPISelection = () => {
    if (!selectedUPI) {
      alert("Please select a UPI account or add a new one");
      return;
    }
    onNext();
  };

  const validateUPIId = (upiId: string) => {
    // Basic UPI ID validation (format: user@provider)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const handleAddUPI = () => {
    if (!newUPIForm.upiId || !newUPIForm.name || !newUPIForm.provider) {
      alert("Please fill all required fields");
      return;
    }

    if (!validateUPIId(newUPIForm.upiId)) {
      alert("Please enter a valid UPI ID (e.g., user@provider)");
      return;
    }

    const provider = upiProviders.find((p) => p.name === newUPIForm.provider);
    const newUPI: UPIAccount = {
      id: Date.now().toString(),
      upiId: newUPIForm.upiId,
      name: newUPIForm.name,
      provider: newUPIForm.provider,
      logo: provider?.logo || "💳",
      verified: true, // Simulate verification
    };

    setUpiAccounts([...upiAccounts, newUPI]);
    setSelectedUPI(newUPI.id);
    setShowAddUPIForm(false);
    setNewUPIForm({
      upiId: "",
      name: "",
      provider: "",
    });

    alert("UPI account added successfully");
  };

  const handleQRScan = () => {
    // Simulate QR code scanning
    setShowQRScanner(true);
    setTimeout(() => {
      const scannedUPI = {
        id: Date.now().toString(),
        upiId: "teacher@paytm",
        name: "Teacher Account",
        provider: "Paytm",
        logo: "🔵",
        verified: true,
      };
      setUpiAccounts([...upiAccounts, scannedUPI]);
      setSelectedUPI(scannedUPI.id);
      setShowQRScanner(false);
      alert("QR code scanned successfully!");
    }, 2000);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          UPI Payment
        </DialogTitle>
        <DialogDescription>
          Pay ₹{paymentAmount?.toLocaleString()} instantly using UPI
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 ">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAddUPIForm(true)}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Plus className="h-6 w-6 text-blue-600" />
            <span className="text-sm">Add UPI ID</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleQRScan}
            className="h-auto p-4 flex flex-col items-center gap-2"
            disabled={showQRScanner}
          >
            {showQRScanner ? (
              <Clock className="h-6 w-6 animate-spin text-blue-600" />
            ) : (
              <QrCode className="h-6 w-6 text-blue-600" />
            )}
            <span className="text-sm">
              {showQRScanner ? "Scanning..." : "Scan QR"}
            </span>
          </Button>
        </div>

        {/* Existing UPI Accounts */}
        {!showAddUPIForm && upiAccounts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Your UPI Accounts
            </h3>
            <RadioGroup value={selectedUPI} onValueChange={setSelectedUPI}>
              {upiAccounts.map((upi) => (
                <div key={upi.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={upi.id} id={upi.id} />
                  <Label htmlFor={upi.id} className="flex-1 cursor-pointer">
                    <Card className="hover:bg-blue-50 transition-colors border-2 hover:border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                              {upi.logo}
                            </div>
                            <div>
                              <h4 className="font-medium text-base flex items-center gap-2">
                                {upi.name}
                                {upi.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </h4>
                              <p className="text-sm text-blue-600 font-mono">
                                {upi.upiId}
                              </p>
                              <p className="text-xs text-gray-500">
                                via {upi.provider}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Instant
                            </Badge>
                            {upi.verified && (
                              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Add UPI Form */}
        {showAddUPIForm && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Add UPI Account
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddUPIForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>UPI ID *</Label>
                <Input
                  value={newUPIForm.upiId}
                  onChange={(e) =>
                    setNewUPIForm((prev) => ({
                      ...prev,
                      upiId: e.target.value.toLowerCase(),
                    }))
                  }
                  placeholder="example@paytm or mobile@upi"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Enter your UPI ID (e.g., 9876543210@paytm, user@googlepay)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Holder Name *</Label>
                <Input
                  value={newUPIForm.name}
                  onChange={(e) =>
                    setNewUPIForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="space-y-2">
                <Label>UPI Provider *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {upiProviders.map((provider) => (
                    <Button
                      key={provider.name}
                      type="button"
                      variant={
                        newUPIForm.provider === provider.name
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setNewUPIForm((prev) => ({
                          ...prev,
                          provider: provider.name,
                        }))
                      }
                      className="h-auto p-3 flex items-center gap-2"
                    >
                      <span className="text-lg">{provider.logo}</span>
                      <span className="text-xs">{provider.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddUPI} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add UPI Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* UPI Benefits */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              UPI Benefits
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-3 w-3" />
                Instant Transfer
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-3 w-3" />
                No Charges
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-3 w-3" />
                24/7 Available
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle className="h-3 w-3" />
                Secure & Safe
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Security Notice
            </span>
          </div>
          <p className="text-xs text-amber-700">
            UPI payments are processed through secure banking channels. Your UPI
            PIN and banking details are never stored or shared.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleUPISelection}>
          <Smartphone className="mr-2 h-4 w-4" />
          Pay with UPI
        </Button>
      </DialogFooter>
    </>
  );
};

export default UPIPaymentStep;
