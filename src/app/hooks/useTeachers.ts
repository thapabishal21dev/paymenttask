// hooks/useTeachers.ts
import { useState, useEffect } from "react";
import { Teacher } from "../types/index";
import { toast } from "sonner";

const sampleTeachers: Teacher[] = [
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
    birthdate: "1985-03-15",
    address: "123 Main St, City, State 12345",
    qualifications: [
      { name: "Master in Mathematics", rate: 5 },
      { name: "Teaching Certificate", rate: 4 },
    ],
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
    birthdate: "1982-07-22",
    address: "456 Oak Ave, City, State 12345",
    qualifications: [
      { name: "PhD in English Literature", rate: 5 },
      { name: "Advanced Teaching Methods", rate: 5 },
    ],
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike.brown@school.edu",
    subject: "Physics",
    experience: 6,
    salary: 4200,
    status: "inactive",
    phone: "+1 234 567 8903",
    joinDate: "2021-01-10",
    rating: 4.3,
    role: "Teacher",
    birthdate: "1988-11-08",
    address: "789 Pine Rd, City, State 12345",
    qualifications: [
      { name: "Bachelor in Physics", rate: 4 },
      { name: "Science Teaching Certificate", rate: 4 },
    ],
  },
];

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = () => {
      try {
        const storedTeachers = JSON.parse(
          localStorage.getItem("teachers") || "[]"
        );
        const allTeachers = [...sampleTeachers, ...storedTeachers];
        setTeachers(allTeachers);
      } catch (error) {
        console.error("Error loading teachers:", error);
        toast.error("Failed to load teachers");
        setTeachers(sampleTeachers);
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const addTeacher = (teacher: Teacher) => {
    try {
      const existingTeachers = JSON.parse(
        localStorage.getItem("teachers") || "[]"
      );
      const updatedTeachers = [...existingTeachers, teacher];
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
      setTeachers((prev) => [...prev, teacher]);
      toast.success("Teacher added successfully!");
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("Failed to add teacher");
    }
  };

  const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>) => {
    try {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
        )
      );
      toast.success("Teacher updated successfully!");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher");
    }
  };

  const deleteTeacher = (id: string) => {
    try {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher");
    }
  };

  return {
    teachers,
    loading,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  };
};
