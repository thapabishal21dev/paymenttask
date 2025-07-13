import { StaticImageData } from "next/image";

// types/index.ts
export interface Teacher {
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

export interface TeacherFormData {
  name: string;
  email: string;
  subject: string;
  experience: number;
  salary: number;
  status: "active" | "inactive";
  phone: string;
  rating: number;
  role: string;
  birthdate: string;
  address: string;
  qualifications: Array<{
    name: string;
    rate: number;
  }>;
}

export interface TeacherStats {
  totalTeachers: number;
  activeTeachers: number;
  totalSalaryExpense: number;
  averageRating: number;
}

export interface PaymentRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  amount: number;
  type: "salary" | "bonus" | "deduction";
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
  transactionId?: string;
}

export interface PaymentData {
  type: "salary" | "bonus" | "deduction";
  amount: number;
  description: string;
  status: string;
}

// Updated BankAccount to handle both string and StaticImageData
export interface BankAccount {
  id: string;
  bankName: string;
  bankLogo: string | StaticImageData; // Allow both string emoji and imported images
  cardNumber: string;
  cardType: "debit" | "credit";
  expiryDate: string;
  holderName: string;
  cardImage?: string;
}

export interface RecipientAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface UPIAccount {
  id: string;
  upiId: string;
  name: string;
  provider: string;
  logo: string;
  verified: boolean;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}
export interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (paymentData: PaymentData) => void;
}

export interface PaymentStepProps {
  onBack: () => void;
  onNext: () => void;
  paymentAmount?: number;
}

// Props interfaces for payment steps
export interface BankSelectionStepProps {
  selectedBank: string;
  setSelectedBank: (bankId: string) => void;
  bankAccounts: BankAccount[];
  setBankAccounts: (accounts: BankAccount[]) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
  indianBanks: readonly string[];
}

export interface ConfirmationStepProps {
  paymentData: Partial<PaymentData>;
  selectedBank?: BankAccount;
  selectedRecipient?: RecipientAccount;
  selectedUPI?: UPIAccount;
  paymentMethod?: string;
  otp: string;
  setOtp: (otp: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  showOtpInput: boolean;
  setShowOtpInput: (show: boolean) => void;
  onBack: () => void;
  onSuccess: () => void;
}

export interface UPIPaymentStepProps {
  selectedUPI: string;
  setSelectedUPI: (upiId: string) => void;
  upiAccounts: UPIAccount[];
  setUpiAccounts: (accounts: UPIAccount[]) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
}

export interface RecipientSelectionStepProps {
  selectedRecipient: string;
  setSelectedRecipient: (recipientId: string) => void;
  recipients: RecipientAccount[];
  setRecipients: (recipients: RecipientAccount[]) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
  indianBanks: readonly string[];
}

export interface PaymentMethodSelectionProps {
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  paymentAmount?: number;
  onBack: () => void;
  onNext: () => void;
}

// Constants
export const SUBJECTS = [
  "Mathematics",
  "English Literature",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
] as const;

export const ROLES = [
  "Head Teacher",
  "Senior Teacher",
  "Teacher",
  "Assistant Teacher",
  "Subject Coordinator",
  "Department Head",
  "Vice Principal",
  "Principal",
] as const;

export const INDIAN_BANKS = [
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
] as const;

export const UPI_PROVIDERS = [
  { name: "Google Pay", logo: "🔵", color: "#4285f4" },
  { name: "PhonePe", logo: "🟣", color: "#5f259f" },
  { name: "Paytm", logo: "🔵", color: "#00baf2" },
  { name: "Amazon Pay", logo: "🟠", color: "#ff9900" },
  { name: "BHIM", logo: "🔴", color: "#ed1c24" },
  { name: "WhatsApp Pay", logo: "🟢", color: "#25d366" },
  { name: "MobiKwik", logo: "🔵", color: "#2e5bba" },
  { name: "Freecharge", logo: "🟡", color: "#ffc107" },
] as const;
