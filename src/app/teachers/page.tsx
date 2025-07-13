"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useTeachers } from "../hooks/useTeachers";
import { Teacher } from "../types/index";

const TeacherList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { teachers, loading, deleteTeacher } = useTeachers();

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.role &&
        teacher.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteTeacher = (teacher: Teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      deleteTeacher(teacher.id);
    }
  };

  if (loading) {
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
            Teachers
          </h2>
          <p className="text-muted-foreground">
            Manage your teaching staff and their information
          </p>
        </div>
        <Link href="/add-teachers">
          <Button className="w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </Link>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                All Teachers ({filteredTeachers.length})
              </CardTitle>
              <CardDescription>
                Search and manage your teaching staff
              </CardDescription>
            </div>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, subject, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm
                  ? "No teachers found matching your search."
                  : "No teachers available."}
              </div>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="text-left p-2 sm:p-4 font-medium">
                      Teacher
                    </th>
                    <th className="text-left p-2 sm:p-4 font-medium hidden sm:table-cell">
                      Role
                    </th>
                    <th className="text-left p-2 sm:p-4 font-medium hidden md:table-cell">
                      Subject
                    </th>
                    <th className="text-left p-2 sm:p-4 font-medium hidden lg:table-cell">
                      Experience
                    </th>
                    <th className="text-left p-2 sm:p-4 font-medium">Salary</th>
                    <th className="text-left p-2 sm:p-4 font-medium">Status</th>
                    <th className="text-right p-2 sm:p-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b hover:bg-gray-50 transition-colors text-sm"
                    >
                      <td className="p-2 sm:p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                            <AvatarFallback className="text-xs sm:text-sm font-medium">
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {teacher.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 truncate">
                              {teacher.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden sm:table-cell">
                        <div className="font-medium">
                          {teacher.role || "Teacher"}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 hidden md:table-cell">
                        <div className="font-medium">{teacher.subject}</div>
                      </td>
                      <td className="p-2 sm:p-4 hidden lg:table-cell">
                        <div className="text-sm">
                          {teacher.experience}{" "}
                          {teacher.experience === 1 ? "year" : "years"}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <div className="font-medium">
                          ${teacher.salary.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          per month
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">
                        <Badge
                          variant={
                            teacher.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            teacher.status === "active"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {teacher.status}
                        </Badge>
                      </td>
                      <td className="p-2 sm:p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit teacher
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteTeacher(teacher)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete teacher
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherList;
