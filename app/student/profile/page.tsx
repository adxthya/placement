"use client";

import { useState } from "react";
import { mockStudents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

const branches = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function Profile() {
  const [selectedStudentId, setSelectedStudentId] = useState(
    mockStudents[0].id
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockStudents[0]);

  const currentStudent = mockStudents.find((s) => s.id === selectedStudentId);

  const handleStudentChange = (studentId: string) => {
    const student = mockStudents.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudentId(studentId);
      setFormData(student);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cgpa" || name === "semester" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) : value,
    }));
  };

  const handleSave = () => {
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      toast.error("CGPA must be between 0 and 10");
      return;
    }

    toast.success("Profile updated successfully!");

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (currentStudent) setFormData(currentStudent);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your registration details
          </p>
        </div>

        <Select
          value={selectedStudentId}
          onValueChange={handleStudentChange}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            {mockStudents.map((student) => (
              <SelectItem
                key={student.id}
                value={student.id}
              >
                {student.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(value) => handleSelectChange("semester", value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem
                      key={sem}
                      value={sem}
                    >
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={formData.branch}
                onValueChange={(value) => handleSelectChange("branch", value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
