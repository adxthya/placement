"use client";
import { useState } from "react";
import { mockCompanies, mockStudents } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EligibleInterviews = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(
    mockStudents[0].id
  );

  const currentStudent = mockStudents.find((s) => s.id === selectedStudentId);

  const eligibleCompanies = mockCompanies.filter(
    (company) =>
      currentStudent &&
      currentStudent.cgpa >= company.cgpaRequirement &&
      company.eligibleBranches.includes(currentStudent.branch)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Eligible Interviews</h1>
          <p className="text-muted-foreground">
            View all placement opportunities you&apos;re eligible for
          </p>
        </div>
        <Select
          value={selectedStudentId}
          onValueChange={setSelectedStudentId}
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

      {currentStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">CGPA: {currentStudent.cgpa}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentStudent.branch}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Semester {currentStudent.semester}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {eligibleCompanies.length > 0 ? (
          eligibleCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{company.package}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(company.interviewDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>Min CGPA: {company.cgpaRequirement}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {company.eligibleBranches.map((branch) => (
                    <Badge
                      key={branch}
                      variant="outline"
                    >
                      {branch}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                No eligible interviews found based on your current profile.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EligibleInterviews;
