"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Star, Plus, Activity, Loader2 } from "lucide-react";
import { useTeachers } from "../hooks/useTeachers";
import { usePayments } from "../hooks/usePayments";
import { TeacherStats } from "../types/index";

const TeacherDashboard: React.FC = () => {
  const { teachers, loading: teachersLoading } = useTeachers();
  const { payments, loading: paymentsLoading } = usePayments();

  // Calculate stats from actual data
  const stats: TeacherStats = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
    totalSalaryExpense: teachers
      .filter((t) => t.status === "active")
      .reduce((sum, t) => sum + t.salary, 0),
    averageRating:
      teachers.length > 0
        ? Math.round(
            (teachers.reduce((sum, t) => sum + (t.rating || 4.0), 0) /
              teachers.length) *
              10
          ) / 10
        : 0,
  };

  // Recent payments (last 3)
  const recentPayments = payments
    .filter((p) => p.status === "completed")
    .slice(0, 3);

  if (teachersLoading || paymentsLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-muted-foreground">
            `Welcome back! Here&apos;s what&apos;s happening with your school.
          </p>
        </div>
        <Link href="/add-teachers">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.totalTeachers}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTeachers > 0
                ? "+3 from last month"
                : "Start by adding teachers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Teachers
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.activeTeachers}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTeachers > 0
                ? `${Math.round((stats.activeTeachers / stats.totalTeachers) * 100)}% active rate`
                : "No teachers yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expense
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${stats.totalSalaryExpense.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTeachers > 0
                ? `$${Math.round(stats.totalSalaryExpense / stats.activeTeachers).toLocaleString()} avg per teacher`
                : "No active teachers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.averageRating}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.averageRating >= 4.5
                ? "Excellent performance"
                : stats.averageRating >= 4.0
                  ? "Good performance"
                  : stats.averageRating > 0
                    ? "Room for improvement"
                    : "No ratings yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Latest salary payments processed
                </CardDescription>
              </div>
              <Link href="/payments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentPayments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">
                  No payments processed yet
                </div>
                <Link href="/payments">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Process Payment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {payment.teacherName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${payment.amount.toLocaleString()}
                      </span>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/add-teachers">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Teacher
              </Button>
            </Link>
            <Link href="/payments">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </Link>
            <Link href="/teachers">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Teachers
              </Button>
            </Link>
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-2">
                System Status
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
