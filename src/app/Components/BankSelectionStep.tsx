"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Plus, ArrowLeft, X } from "lucide-react";
import {
  BankAccount,
  BankSelectionStepProps,
  INDIAN_BANKS,
} from "../types/index";
import { toast } from "sonner";

const BankSelectionStep: React.FC<BankSelectionStepProps> = ({
  selectedBank,
  setSelectedBank,
  bankAccounts,
  setBankAccounts,
  paymentAmount,
  onBack,
  onNext,
  indianBanks = INDIAN_BANKS,
}) => {
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [newBankForm, setNewBankForm] = useState({
    bankName: "",
    cardNumber: "",
    cardType: "debit" as "debit" | "credit",
    expiryDate: "",
    cvv: "",
    zipCode: "",
    holderName: "",
  });

  const handleBankSelection = () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    onNext();
  };

  const handleAddBank = () => {
    if (
      !newBankForm.bankName ||
      !newBankForm.cardNumber ||
      !newBankForm.expiryDate ||
      !newBankForm.cvv ||
      !newBankForm.holderName
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Generate card image based on card type
    const getCardImage = (cardType: string) => {
      if (cardType === "credit") {
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA4MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjUwIiByeD0iNSIgZmlsbD0iI0ZGNkMwMCIvPgo8dGV4dCB4PSI0MCIgeT0iMzAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNyZWRpdDwvdGV4dD4KPHN2Zz4K";
      }
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA4MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjUwIiByeD0iNSIgZmlsbD0iIzAwNEQ5RiIvPgo8dGV4dCB4PSI0MCIgeT0iMzAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRlYml0PC90ZXh0Pgo8L3N2Zz4K";
    };

    const newBank: BankAccount = {
      id: Date.now().toString(),
      bankName: newBankForm.bankName,
      bankLogo: "🏦",
      cardNumber: `**** **** **** ${newBankForm.cardNumber.slice(-4)}`,
      cardType: newBankForm.cardType,
      expiryDate: newBankForm.expiryDate,
      holderName: newBankForm.holderName,
      cardImage: getCardImage(newBankForm.cardType),
    };

    setBankAccounts([...bankAccounts, newBank]);
    setSelectedBank(newBank.id);
    setShowAddBankForm(false);
    setNewBankForm({
      bankName: "",
      cardNumber: "",
      cardType: "debit",
      expiryDate: "",
      cvv: "",
      zipCode: "",
      holderName: "",
    });

    toast.success("Bank account added successfully");
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay with
        </DialogTitle>
        <DialogDescription>
          Select your payment method for ${paymentAmount?.toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 max-h-[32rem] overflow-y-auto">
        {!showAddBankForm && (
          <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
            {bankAccounts.map((bank: BankAccount) => (
              <div key={bank.id} className="flex items-center space-x-2">
                <RadioGroupItem value={bank.id} id={bank.id} />
                <Label htmlFor={bank.id} className="flex-1 cursor-pointer">
                  <Card className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">
                              {typeof bank.bankLogo === "string"
                                ? bank.bankLogo
                                : "🏦"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{bank.bankName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {bank.cardNumber} • {bank.cardType.toUpperCase()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {bank.holderName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Expires</div>
                          <div className="text-sm text-muted-foreground">
                            {bank.expiryDate}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {showAddBankForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Add New Bank Account
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddBankForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Select
                    value={newBankForm.bankName}
                    onValueChange={(value) =>
                      setNewBankForm((prev) => ({
                        ...prev,
                        bankName: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Card Type</Label>
                  <Select
                    value={newBankForm.cardType}
                    onValueChange={(value) =>
                      setNewBankForm((prev) => ({
                        ...prev,
                        cardType: value as "debit" | "credit",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input
                  value={newBankForm.cardNumber}
                  onChange={(e) =>
                    setNewBankForm((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    value={newBankForm.expiryDate}
                    onChange={(e) =>
                      setNewBankForm((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input
                    value={newBankForm.cvv}
                    onChange={(e) =>
                      setNewBankForm((prev) => ({
                        ...prev,
                        cvv: e.target.value,
                      }))
                    }
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={newBankForm.zipCode}
                    onChange={(e) =>
                      setNewBankForm((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    placeholder="12345"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input
                  value={newBankForm.holderName}
                  onChange={(e) =>
                    setNewBankForm((prev) => ({
                      ...prev,
                      holderName: e.target.value,
                    }))
                  }
                  placeholder="Name on card"
                />
              </div>
              <Button onClick={handleAddBank} className="w-full">
                Add Bank Account
              </Button>
            </CardContent>
          </Card>
        )}

        {!showAddBankForm && (
          <Button
            variant="outline"
            onClick={() => setShowAddBankForm(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Bank Account
          </Button>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleBankSelection}>Continue to Recipients</Button>
      </DialogFooter>
    </>
  );
};

export default BankSelectionStep;
