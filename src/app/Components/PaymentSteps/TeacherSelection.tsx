"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { Teacher } from "../../types/index";

interface TeacherSelectionProps {
  teachers: Teacher[];
  loading: boolean;
  onTeacherSelect: (teacher: Teacher) => void;
  selectedTeacher: Teacher | null;
}

const TeacherSelection: React.FC<TeacherSelectionProps> = ({
  teachers,
  loading,
  onTeacherSelect,
  selectedTeacher,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name, subject, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Teachers List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        <RadioGroup
          value={selectedTeacher?.id || ""}
          onValueChange={(value) => {
            const teacher = teachers.find((t) => t.id === value);
            if (teacher) onTeacherSelect(teacher);
          }}
        >
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm
                  ? "No teachers found matching your search."
                  : "No active teachers available for payment."}
              </div>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center space-x-2">
                <RadioGroupItem value={teacher.id} id={teacher.id} />
                <Label htmlFor={teacher.id} className="flex-1 cursor-pointer">
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
                              {teacher.role || "Teacher"} • {teacher.subject}
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
    </div>
  );
};

export default TeacherSelection;
