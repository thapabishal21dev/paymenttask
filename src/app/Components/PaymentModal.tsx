import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CreditCard,
  DollarSign,
  User,
  CheckCircle,
  ArrowLeft,
  Search,
  Users,
} from "lucide-react";
import sbiLogo from "@/assets/sbi.svg";
import hdfcLogo from "@/assets/hdfc.png";
import { BankAccount } from "../types/index";
// Lazy load components
const PaymentMethodSelection = lazy(() => import("./PaymentMethodSelection"));
const UPIPaymentStep = lazy(() => import("./UPIPaymentStep"));
const BankSelectionStep = lazy(() => import("./BankSelectionStep"));
const RecipientSelectionStep = lazy(() => import("./RecipientSelectionStep"));
const ConfirmationStep = lazy(() => import("./ConfirmationStep"));

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  experience: number;
  salary: number;
  status: "active" | "inactive";
  phone: string;
  joinDate: string;
  rating: number;
  role?: string;
  birthdate?: string;
  address?: string;
  qualifications?: Array<{
    name: string;
    rate: number;
  }>;
}

interface PaymentData {
  type: "salary" | "bonus" | "deduction";
  amount: number;
  description: string;
  status: string;
}

interface RecipientAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

interface UPIAccount {
  id: string;
  upiId: string;
  name: string;
  provider: string;
  logo: string;
  verified: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (paymentData: {
    teacher: Teacher | null;
    paymentData: Partial<PaymentData>;
    selectedBank?: BankAccount;
    selectedRecipient?: RecipientAccount;
    otp: string;
    timestamp: string;
    transactionId: string;
  }) => void;
}

const sampleBankAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "State Bank of India",
    bankLogo: sbiLogo,
    cardNumber: "**** **** **** 1234",
    cardType: "debit",
    expiryDate: "12/26",
    holderName: "Your Name",
    cardImage: typeof sbiLogo === "string" ? sbiLogo : "",
  },
  {
    id: "2",
    bankName: "HDFC Bank",
    bankLogo: hdfcLogo,
    cardNumber: "**** **** **** 5678",
    cardType: "credit",
    expiryDate: "08/27",
    holderName: "Your Name",
    cardImage: typeof hdfcLogo === "string" ? hdfcLogo : "",
  },
];

const sampleRecipients: RecipientAccount[] = [
  {
    id: "1",
    name: "John Doe",
    bankName: "ICICI Bank",
    accountNumber: "****7890",
    ifscCode: "ICIC0001234",
  },
  {
    id: "2",
    name: "Jane Smith",
    bankName: "Axis Bank",
    accountNumber: "****4567",
    ifscCode: "UTIB0001234",
  },
];

const indianBanks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Punjab National Bank",
  "Canara Bank",
  "Union Bank of India",
  "Bank of Baroda",
  "Indian Bank",
  "Central Bank of India",
  "Axis Bank",
];

const PaymentSummaryCard = ({
  teacher,
}: {
  teacher: Teacher;
  paymentData: Partial<PaymentData>;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">Selected Teacher</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{teacher?.name}</span>
        </div>
        <Badge variant="default">{teacher?.status}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          Monthly Salary: ${teacher?.salary?.toLocaleString()}
        </span>
      </div>
    </CardContent>
  </Card>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Teacher Selection, 1: Payment Details, 2: Payment Method, 3: UPI/Bank/etc, 4: Recipients, 5: Confirmation
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({
    type: "salary",
    amount: 0,
    description: "",
    status: "pending",
  });

  // Payment flow states
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [bankAccounts, setBankAccounts] =
    useState<BankAccount[]>(sampleBankAccounts);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [recipients, setRecipients] =
    useState<RecipientAccount[]>(sampleRecipients);
  const [selectedUPI, setSelectedUPI] = useState<string>("");
  const [upiAccounts, setUpiAccounts] = useState<UPIAccount[]>([
    {
      id: "1",
      upiId: "user@paytm",
      name: "Main Account",
      provider: "Paytm",
      logo: "🔵",
      verified: true,
    },
    {
      id: "2",
      upiId: "9876543210@googlepay",
      name: "Personal Account",
      provider: "Google Pay",
      logo: "🔵",
      verified: true,
    },
  ]);
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Sample teachers data
  const sampleTeachers: Teacher[] = React.useMemo(
    () => [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@school.edu",
        subject: "Mathematics",
        experience: 8,
        salary: 4500,
        status: "active",
        phone: "+1 234 567 8901",
        joinDate: "2020-09-15",
        rating: 4.8,
        role: "Senior Teacher",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.johnson@school.edu",
        subject: "English Literature",
        experience: 12,
        salary: 5200,
        status: "active",
        phone: "+1 234 567 8902",
        joinDate: "2018-08-20",
        rating: 4.9,
        role: "Head Teacher",
      },
    ],
    []
  );

  // Load teachers from localStorage and merge with sample data
  useEffect(() => {
    const storedTeachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    const allTeachers = [...sampleTeachers, ...storedTeachers];
    // Filter only active teachers for payments
    const activeTeachers = allTeachers.filter(
      (teacher) => teacher.status === "active"
    );
    setTeachers(activeTeachers);
  }, [sampleTeachers]);

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      teacher.email.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      (teacher.role &&
        teacher.role.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  const handleTeacherSelection = () => {
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }
    // Set default payment amount to teacher's salary
    setPaymentData((prev) => ({
      ...prev,
      amount: selectedTeacher.salary,
    }));
    setCurrentStep(1);
  };

  const handlePaymentDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.amount || paymentData.amount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }
    setCurrentStep(2); // Go to Payment Method Selection
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedBankDetails = bankAccounts.find(
      (bank) => bank.id === selectedBank
    );
    const selectedRecipientDetails = recipients.find(
      (recipient) => recipient.id === selectedRecipient
    );

    const paymentDetails = {
      teacher: selectedTeacher,
      paymentData,
      selectedBank: selectedBankDetails,
      selectedRecipient: selectedRecipientDetails,
      otp,
      timestamp: new Date().toISOString(),
      transactionId: `TXN${Date.now()}`,
    };

    console.log("Payment Details:", paymentDetails);

    setPaymentSuccess(true);
    setIsProcessing(false);

    // Call the success callback
    if (onSuccess) {
      onSuccess(paymentDetails);
    }

    // Wait 2 seconds then close modal
    setTimeout(() => {
      resetAll();
      onClose();
    }, 2000);
  };

  const resetAll = () => {
    setCurrentStep(0);
    setSelectedTeacher(null);
    setTeacherSearch("");
    setSelectedPaymentMethod("");
    setSelectedBank("");
    setSelectedRecipient("");
    setSelectedUPI("");
    setOtp("");
    setIsProcessing(false);
    setShowOtpInput(false);
    setPaymentSuccess(false);
    setPaymentData({
      type: "salary",
      amount: 0,
      description: "",
      status: "pending",
    });
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Success Screen
  if (paymentSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">
              Payment Successful!
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Payment of ${paymentData.amount} to {selectedTeacher?.name} has
              been processed successfully
            </p>
            <div className="w-full bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Transaction ID:</span>
                <span className="font-mono">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-semibold">${paymentData.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Teacher:</span>
                <span className="font-semibold">{selectedTeacher?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetAll();
        }
        onClose();
      }}
    >
      <DialogContent
        className={`
  ${currentStep === 0 || currentStep === 1 ? "sm:max-w-2xl" : "sm:max-w-lg"} 
  max-h-[calc(100vh-5rem)] 
  overflow-y-auto
`}
      >
        {/* Step 0: Teacher Selection */}
        {currentStep === 0 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Teacher for Payment
              </DialogTitle>
              <DialogDescription>
                Choose which teacher you want to process payment for
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers by name, subject, email, or role..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Teachers List */}
              <div className=" space-y-2">
                <RadioGroup
                  value={selectedTeacher?.id || ""}
                  onValueChange={(value) => {
                    const teacher = teachers.find((t) => t.id === value);
                    setSelectedTeacher(teacher || null);
                  }}
                >
                  {filteredTeachers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground">
                        {teacherSearch
                          ? "No teachers found matching your search."
                          : "No active teachers available for payment."}
                      </div>
                      {teacherSearch && (
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => setTeacherSearch("")}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={teacher.id} id={teacher.id} />
                        <Label
                          htmlFor={teacher.id}
                          className="flex-1 cursor-pointer"
                        >
                          <Card className="hover:bg-gray-50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-sm font-medium">
                                      {teacher.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-base">
                                      {teacher.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {teacher.role || "Teacher"} •{" "}
                                      {teacher.subject}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {teacher.email}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">
                                    ${teacher.salary.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Monthly Salary
                                  </div>
                                  <Badge
                                    variant="default"
                                    className="mt-1 bg-green-100 text-green-800"
                                  >
                                    {teacher.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Label>
                      </div>
                    ))
                  )}
                </RadioGroup>
              </div>

              {/* Summary */}
              {selectedTeacher && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Selected Teacher
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <div className="font-medium">{selectedTeacher.name}</div>
                      <div>
                        {selectedTeacher.role} • {selectedTeacher.subject}
                      </div>
                      <div>
                        Default amount: $
                        {selectedTeacher.salary.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleTeacherSelection}
                disabled={!selectedTeacher}
              >
                Continue to Payment Details
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 1: Payment Details */}
        {currentStep === 1 && selectedTeacher && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </DialogTitle>
              <DialogDescription>
                Configure payment details for {selectedTeacher.name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <PaymentSummaryCard
                teacher={selectedTeacher}
                paymentData={paymentData}
              />

              <form onSubmit={handlePaymentDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Payment Type</Label>
                    <Select
                      value={paymentData.type}
                      onValueChange={(value) =>
                        setPaymentData((prev) => ({
                          ...prev,
                          type: value as "salary" | "bonus" | "deduction",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary">Monthly Salary</SelectItem>
                        <SelectItem value="bonus">Bonus Payment</SelectItem>
                        <SelectItem value="deduction">Deduction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData((prev) => ({
                          ...prev,
                          amount: Number(e.target.value),
                        }))
                      }
                      placeholder="Enter payment amount"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={paymentData.description}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Add a note about this payment..."
                    rows={3}
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label>Quick Amount Selection</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaymentData((prev) => ({
                          ...prev,
                          amount: selectedTeacher.salary,
                        }))
                      }
                    >
                      Full Salary (${selectedTeacher.salary.toLocaleString()})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaymentData((prev) => ({
                          ...prev,
                          amount: Math.round(selectedTeacher.salary / 2),
                        }))
                      }
                    >
                      Half Salary ($
                      {Math.round(selectedTeacher.salary / 2).toLocaleString()})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPaymentData((prev) => ({ ...prev, amount: 1000 }))
                      }
                    >
                      Bonus ($1,000)
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={goBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </>
        )}

        {/* Step 2: Payment Method Selection */}
        {currentStep === 2 && (
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentMethodSelection
              selectedMethod={selectedPaymentMethod}
              setSelectedMethod={setSelectedPaymentMethod}
              paymentAmount={paymentData.amount}
              onBack={goBack}
              onNext={() => {
                // Navigate to appropriate step based on selected method
                if (selectedPaymentMethod === "upi") {
                  setCurrentStep(3); // UPI Step
                } else if (selectedPaymentMethod === "card") {
                  setCurrentStep(4); // Bank Selection Step
                } else if (selectedPaymentMethod === "netbanking") {
                  setCurrentStep(5); // Recipient Selection Step (skip bank cards for net banking)
                }
              }}
            />
          </Suspense>
        )}

        {/* Step 3: UPI Payment (only if UPI selected) */}
        {currentStep === 3 && selectedPaymentMethod === "upi" && (
          <Suspense fallback={<LoadingSpinner />}>
            <UPIPaymentStep
              selectedUPI={selectedUPI}
              setSelectedUPI={setSelectedUPI}
              upiAccounts={upiAccounts}
              setUpiAccounts={setUpiAccounts}
              paymentAmount={paymentData.amount}
              onBack={goBack}
              onNext={() => setCurrentStep(6)} // Skip recipient selection for UPI, go directly to confirmation
            />
          </Suspense>
        )}

        {/* Step 4: Bank Selection (only if card selected) */}
        {currentStep === 4 && selectedPaymentMethod === "card" && (
          <Suspense fallback={<LoadingSpinner />}>
            <BankSelectionStep
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              bankAccounts={bankAccounts}
              setBankAccounts={setBankAccounts}
              paymentAmount={paymentData.amount}
              onBack={goBack}
              onNext={() => setCurrentStep(5)}
              indianBanks={indianBanks}
            />
          </Suspense>
        )}

        {/* Step 5: Recipient Selection (for card and netbanking) */}
        {currentStep === 5 &&
          (selectedPaymentMethod === "card" ||
            selectedPaymentMethod === "netbanking") && (
            <Suspense fallback={<LoadingSpinner />}>
              <RecipientSelectionStep
                selectedRecipient={selectedRecipient}
                setSelectedRecipient={setSelectedRecipient}
                recipients={recipients}
                setRecipients={setRecipients}
                paymentAmount={paymentData.amount}
                onBack={goBack}
                onNext={() => setCurrentStep(6)}
                indianBanks={indianBanks}
              />
            </Suspense>
          )}

        {/* Step 6: Confirmation */}
        {currentStep === 6 && (
          <Suspense fallback={<LoadingSpinner />}>
            <ConfirmationStep
              paymentData={paymentData}
              selectedBank={
                selectedPaymentMethod === "card"
                  ? bankAccounts.find((b) => b.id === selectedBank)
                  : undefined
              }
              selectedRecipient={
                selectedPaymentMethod !== "upi"
                  ? recipients.find((r) => r.id === selectedRecipient)
                  : undefined
              }
              selectedUPI={
                selectedPaymentMethod === "upi"
                  ? upiAccounts.find((u) => u.id === selectedUPI)
                  : undefined
              }
              paymentMethod={selectedPaymentMethod}
              otp={otp}
              setOtp={setOtp}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              showOtpInput={showOtpInput}
              setShowOtpInput={setShowOtpInput}
              onBack={goBack}
              onSuccess={handlePaymentSuccess}
            />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
