"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { UserPlus, Save, X, Loader2 } from "lucide-react";
import { useTeachers } from "../hooks/useTeachers";
import { Teacher, TeacherFormData, SUBJECTS, ROLES } from "../types/index";
import { toast } from "sonner";

const AddTeacher: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addTeacher } = useTeachers();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TeacherFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      experience: 0,
      salary: 0,
      status: "active",
      phone: "",
      rating: 0,
      role: "",
      birthdate: "",
      address: "",
      qualifications: [{ name: "", rate: 0 }],
    },
    mode: "onChange",
  });

  const qualifications = watch("qualifications");

  const onSubmit = async (data: TeacherFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        subject: data.subject,
        experience: data.experience,
        salary: data.salary,
        status: data.status,
        phone: data.phone,
        joinDate: new Date().toISOString(),
        rating: data.rating || 4.0,
        role: data.role,
        birthdate: data.birthdate,
        address: data.address,
        qualifications: data.qualifications.filter((q) => q.name.trim() !== ""),
      };

      addTeacher(newTeacher);

      // Show success message then redirect
      setTimeout(() => {
        router.push("/teachers");
      }, 1000);
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("Failed to add teacher. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    toast.info("Form cleared");
  };

  const addQualification = () => {
    const currentQualifications = watch("qualifications");
    setValue("qualifications", [
      ...currentQualifications,
      { name: "", rate: 0 },
    ]);
  };

  const removeQualification = (index: number) => {
    const currentQualifications = watch("qualifications");
    if (currentQualifications.length > 1) {
      setValue(
        "qualifications",
        currentQualifications.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Add New Teacher
          </h2>
          <p className="text-muted-foreground">
            Add a new teacher to your institution
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Teacher Information
            </CardTitle>
            <CardDescription>
              Enter the basic information for the new teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters long",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must not exceed 50 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="Enter full name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Controller
                    name="role"
                    control={control}
                    rules={{
                      required: "Role is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.role ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birth Date *</Label>
                  <Controller
                    name="birthdate"
                    control={control}
                    rules={{
                      required: "Birth date is required",
                      validate: (value) => {
                        const birthDate = new Date(value);
                        const today = new Date();
                        const age =
                          today.getFullYear() - birthDate.getFullYear();
                        if (age < 18)
                          return "Teacher must be at least 18 years old";
                        if (age > 80) return "Please enter a valid birth date";
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="birthdate"
                        type="date"
                        className={errors.birthdate ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.birthdate && (
                    <p className="text-sm text-red-600">
                      {errors.birthdate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email address is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        className={errors.email ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{
                      required: "Subject is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.subject ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: "Address is required",
                    minLength: {
                      value: 10,
                      message: "Address must be at least 10 characters long",
                    },
                  }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id="address"
                      rows={3}
                      placeholder="Enter complete address"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <Separator />

              {/* Qualifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Qualifications</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQualification}
                    className="text-sm"
                  >
                    + Add Qualification
                  </Button>
                </div>

                <div className="space-y-3">
                  {qualifications.map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                    >
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`qualification-name-${index}`}>
                          Qualification Name {index === 0 ? "*" : ""}
                        </Label>
                        <Controller
                          name={`qualifications.${index}.name`}
                          control={control}
                          rules={
                            index === 0
                              ? {
                                  required:
                                    "At least one qualification is required",
                                }
                              : {}
                          }
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={`qualification-name-${index}`}
                              placeholder="e.g., Bachelor's in Mathematics, Teaching Certificate"
                              className={
                                errors.qualifications?.[index]?.name
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                        {errors.qualifications?.[index]?.name && (
                          <p className="text-sm text-red-600">
                            {errors.qualifications[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`qualification-rate-${index}`}>
                            Rate (1-5) {index === 0 ? "*" : ""}
                          </Label>
                          <Controller
                            name={`qualifications.${index}.rate`}
                            control={control}
                            rules={
                              index === 0
                                ? {
                                    required: "Rate is required",
                                    validate: (value) => {
                                      const num = Number(value);
                                      if (isNaN(num))
                                        return "Please enter a valid number";
                                      if (num < 1)
                                        return "Rate must be at least 1";
                                      if (num > 5)
                                        return "Rate cannot exceed 5";
                                      return true;
                                    },
                                  }
                                : {
                                    validate: (value) => {
                                      if (
                                        value === 0 ||
                                        (typeof value === "string" &&
                                          value === "") ||
                                        value === undefined
                                      )
                                        return true;
                                      const num = Number(value);
                                      if (isNaN(num))
                                        return "Please enter a valid number";
                                      if (num < 1)
                                        return "Rate must be at least 1";
                                      if (num > 5)
                                        return "Rate cannot exceed 5";
                                      return true;
                                    },
                                  }
                            }
                            render={({ field }) => (
                              <Input
                                {...field}
                                id={`qualification-rate-${index}`}
                                type="text"
                                inputMode="numeric"
                                placeholder="1-5"
                                className={
                                  errors.qualifications?.[index]?.rate
                                    ? "border-red-500"
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "" || /^[1-5]$/.test(value)) {
                                    field.onChange(
                                      value === "" ? 0 : Number(value)
                                    );
                                  }
                                }}
                                value={
                                  field.value === 0
                                    ? ""
                                    : field.value.toString()
                                }
                              />
                            )}
                          />
                          {errors.qualifications?.[index]?.rate && (
                            <p className="text-sm text-red-600">
                              {errors.qualifications[index]?.rate?.message}
                            </p>
                          )}
                        </div>

                        {qualifications.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeQualification(index)}
                            className="mt-8 h-10 w-10 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Professional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years) *</Label>
                    <Controller
                      name="experience"
                      control={control}
                      rules={{
                        required: "Experience is required",
                        validate: (value) => {
                          const num = Number(value);
                          if (isNaN(num)) return "Please enter a valid number";
                          if (num < 0) return "Experience cannot be negative";
                          if (num > 50)
                            return "Experience cannot exceed 50 years";
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="experience"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter years of experience"
                          className={errors.experience ? "border-red-500" : ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*$/.test(value)) {
                              field.onChange(value === "" ? 0 : Number(value));
                            }
                          }}
                          value={
                            field.value === 0 ? "" : field.value.toString()
                          }
                        />
                      )}
                    />
                    {errors.experience && (
                      <p className="text-sm text-red-600">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Monthly Salary ($) *</Label>
                    <Controller
                      name="salary"
                      control={control}
                      rules={{
                        required: "Salary is required",
                        validate: (value) => {
                          const num = Number(value);
                          if (isNaN(num)) return "Please enter a valid number";
                          if (num < 1000)
                            return "Salary must be at least $1,000";
                          if (num > 50000)
                            return "Salary cannot exceed $50,000";
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="salary"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter monthly salary"
                          className={errors.salary ? "border-red-500" : ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*$/.test(value)) {
                              field.onChange(value === "" ? 0 : Number(value));
                            }
                          }}
                          value={
                            field.value === 0 ? "" : field.value.toString()
                          }
                        />
                      )}
                    />
                    {errors.salary && (
                      <p className="text-sm text-red-600">
                        {errors.salary.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="sm:w-auto"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Teacher...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Add Teacher
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTeacher;
