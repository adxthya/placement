"use client";

import { useEffect, useState } from "react";
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

import { StudentData } from "@/types/student";
import { fetchStudentData } from "@/actions/addStudentData";
import { updateStudentData } from "@/actions/addStudentData";

const branches = [
  "Computer Science",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Bio Medical Engineering",
  "Biotechnology",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStudentData();
        setFormData(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    }
    load();
  }, []);

  if (!formData) return <p>Loading...</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "cgpa" ? Number(value) : value,
          }
        : prev
    );
  };

  const handleSelectChange = (name: keyof StudentData, value: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "semester" ? Number(value) : value,
          }
        : prev
    );
  };

  async function handleSave() {
    if (!formData) return;

    if (formData.cgpa < 0 || formData.cgpa > 10) {
      toast.error("CGPA must be between 0 and 10");
      return;
    }

    try {
      await updateStudentData(formData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    }
  }

  function handleCancel() {
    setIsEditing(false);
  }

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
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
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
                onValueChange={(v) => handleSelectChange("semester", v)}
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
                onValueChange={(v) => handleSelectChange("branch", v)}
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
