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
import { User, Plus, ArrowLeft, X } from "lucide-react";

interface RecipientAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface RecipientSelectionStepProps {
  selectedRecipient: string;
  setSelectedRecipient: (recipientId: string) => void;
  recipients: RecipientAccount[];
  setRecipients: (recipients: RecipientAccount[]) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
  indianBanks: string[];
}

const RecipientSelectionStep: React.FC<RecipientSelectionStepProps> = ({
  selectedRecipient,
  setSelectedRecipient,
  recipients,
  setRecipients,
  paymentAmount,
  onBack,
  onNext,
  indianBanks,
}) => {
  const [showAddRecipientForm, setShowAddRecipientForm] = useState(false);
  const [newRecipientForm, setNewRecipientForm] = useState({
    name: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleRecipientSelection = () => {
    if (!selectedRecipient) {
      alert("Please select a recipient");
      return;
    }
    onNext();
  };

  const handleAddRecipient = () => {
    if (
      !newRecipientForm.name ||
      !newRecipientForm.bankName ||
      !newRecipientForm.accountNumber ||
      !newRecipientForm.ifscCode
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newRecipient: RecipientAccount = {
      id: Date.now().toString(),
      name: newRecipientForm.name,
      bankName: newRecipientForm.bankName,
      accountNumber: `****${newRecipientForm.accountNumber.slice(-4)}`,
      ifscCode: newRecipientForm.ifscCode,
    };

    setRecipients([...recipients, newRecipient]);
    setSelectedRecipient(newRecipient.id);
    setShowAddRecipientForm(false);
    setNewRecipientForm({
      name: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    });

    alert("Recipient added successfully");
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Send Money To
        </DialogTitle>
        <DialogDescription>
          Select recipient for ${paymentAmount} payment
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {!showAddRecipientForm && (
          <RadioGroup
            value={selectedRecipient}
            onValueChange={setSelectedRecipient}
          >
            {recipients.map((recipient) => (
              <div key={recipient.id} className="flex items-center space-x-2">
                <RadioGroupItem value={recipient.id} id={recipient.id} />
                <Label htmlFor={recipient.id} className="flex-1 cursor-pointer">
                  <Card className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-base">
                              {recipient.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {recipient.bankName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Account: {recipient.accountNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            IFSC Code
                          </div>
                          <div className="text-sm font-mono">
                            {recipient.ifscCode}
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

        {showAddRecipientForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Add New Recipient
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddRecipientForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient Name</Label>
                <Input
                  value={newRecipientForm.name}
                  onChange={(e) =>
                    setNewRecipientForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter recipient name"
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Select
                  value={newRecipientForm.bankName}
                  onValueChange={(value) =>
                    setNewRecipientForm((prev) => ({
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
                <Label>Account Number</Label>
                <Input
                  value={newRecipientForm.accountNumber}
                  onChange={(e) =>
                    setNewRecipientForm((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter account number"
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={newRecipientForm.ifscCode}
                  onChange={(e) =>
                    setNewRecipientForm((prev) => ({
                      ...prev,
                      ifscCode: e.target.value,
                    }))
                  }
                  placeholder="Enter IFSC code"
                />
              </div>
              <Button onClick={handleAddRecipient} className="w-full">
                Add Recipient
              </Button>
            </CardContent>
          </Card>
        )}

        {!showAddRecipientForm && (
          <Button
            variant="outline"
            onClick={() => setShowAddRecipientForm(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Recipient
          </Button>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleRecipientSelection}>Confirm Payment</Button>
      </DialogFooter>
    </>
  );
};

export default RecipientSelectionStep;
