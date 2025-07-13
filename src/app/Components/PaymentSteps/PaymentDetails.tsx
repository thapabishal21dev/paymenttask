"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Teacher } from "../../types/index";
import { Badge } from "@/components/ui/badge";

interface PaymentFormData {
  type: "salary" | "bonus" | "deduction";
  amount: number;
  description: string;
}

interface PaymentDetailsProps {
  teacher: Teacher;
  initialData: PaymentFormData;
  onSubmit: (data: PaymentFormData) => void;
  onBack: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  teacher,
  initialData,
  onSubmit,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    defaultValues: initialData,
    mode: "onChange",
  });

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Selected Teacher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{teacher.name}</span>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              {teacher.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Monthly Salary: ${teacher.salary.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Payment Type</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Payment type is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Monthly Salary</SelectItem>
                    <SelectItem value="bonus">Bonus Payment</SelectItem>
                    <SelectItem value="deduction">Deduction</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: "Amount is required",
                validate: (value) => {
                  const num = Number(value);
                  if (isNaN(num) || num <= 0) {
                    return "Please enter a valid amount";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter payment amount"
                  className={errors.amount ? "border-red-500" : ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="description"
                placeholder="Add a note about this payment..."
                rows={3}
              />
            )}
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
              onClick={() => setValue("amount", teacher.salary)}
            >
              Full Salary (${teacher.salary.toLocaleString()})
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue("amount", Math.round(teacher.salary / 2))}
            >
              Half Salary (${Math.round(teacher.salary / 2).toLocaleString()})
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue("amount", 1000)}
            >
              Bonus ($1,000)
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" disabled={!isValid}>
            <CreditCard className="mr-2 h-4 w-4" />
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentDetails;
