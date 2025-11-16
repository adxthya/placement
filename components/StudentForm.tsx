"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { saveStudentData } from "@/actions/addStudentData";

const branches = [
  "Computer Science",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Bio Medical Engineering",
  "Biotechnology",
];

const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cgpa: "",
    semester: "",
    branch: "",
    universityId: "",
    collegeId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await await saveStudentData({
        ...formData,
        cgpa: Number(formData.cgpa),
        semester: Number(formData.semester),
      });

      toast("Submission successful", {
        description: "Your information has been successfully submitted.",
      });

      setFormData({
        name: "",
        email: "",
        cgpa: "",
        semester: "",
        branch: "",
        universityId: "",
        collegeId: "",
      });
    } catch (error) {
      console.error(error);
      toast("Error submitting data", {
        description: "Something went wrong while saving your info.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const cgpaValue = parseFloat(formData.cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      toast("Invalid CGPA", {
        description: "CGPA must be a number between 0 and 10",
      });
      return false;
    }

    return true;
  };

  return (
    <section
      id="student-form"
      className="py-20 bg-college-light"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <span className="border border-[#f59e0b1a] bg-[#f59e0b1a] text-primary text-sm font-medium px-4 py-1.5 rounded-full">
              Student Portal
            </span>
            <h2 className="heading-lg mt-4 mb-3">Submit Your Information</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete the form below to submit your academic details. This
              helps us provide you with personalized opportunities and
              resources.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-college-primary focus:ring-college-primary/20"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-college-primary focus:ring-college-primary/20"
                  />
                </div>

                {/* University ID */}
                <div className="space-y-2">
                  <Label htmlFor="universityId">University ID</Label>
                  <Input
                    id="universityId"
                    name="universityId"
                    placeholder="Enter University ID"
                    value={formData.universityId}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-college-primary focus:ring-college-primary/20"
                  />
                </div>

                {/* College ID */}
                <div className="space-y-2">
                  <Label htmlFor="collegeId">College ID</Label>
                  <Input
                    id="collegeId"
                    name="collegeId"
                    placeholder="Enter College ID"
                    value={formData.collegeId}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-college-primary focus:ring-college-primary/20"
                  />
                </div>

                {/* CGPA */}
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA (0-10)</Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    placeholder="Enter your CGPA"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    required
                    type="number"
                    className="h-12 border-gray-200 focus:border-college-primary focus:ring-college-primary/20"
                  />
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) =>
                      handleSelectChange("semester", value)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-college-primary/20">
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
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch/Department</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) =>
                      handleSelectChange("branch", value)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-college-primary/20">
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

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Information"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentForm;
