"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mockStudents, mockCompanies } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentStatus = "pending" | "eligible" | "rejected";

export default function EligibleStudents() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    mockCompanies[0]?.id || ""
  );
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, StudentStatus>
  >({});

  const selectedCompany = mockCompanies.find((c) => c.id === selectedCompanyId);

  const eligibleStudents = selectedCompany
    ? mockStudents.filter(
        (student) =>
          student.cgpa >= selectedCompany.cgpaRequirement &&
          selectedCompany.eligibleBranches.includes(student.branch)
      )
    : [];

  const handleStatusChange = (studentId: string, status: StudentStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [`${selectedCompanyId}-${studentId}`]: status,
    }));

    const student = mockStudents.find((s) => s.id === studentId);
    toast(
      status === "eligible"
        ? "✅ Student Marked Eligible"
        : "❌ Student Marked Rejected",
      {
        description: `${student?.name} has been marked as ${status}.`,
        duration: 3000,
      }
    );
  };

  const getStudentStatus = (studentId: string): StudentStatus => {
    return studentStatuses[`${selectedCompanyId}-${studentId}`] || "pending";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">
          Eligible Students
        </h2>
        <p className="text-muted-foreground mt-1">
          View students eligible for company placements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Company</Label>
            <Select
              value={selectedCompanyId}
              onValueChange={setSelectedCompanyId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCompany && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-semibold">{selectedCompany.name}</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>CGPA Requirement: {selectedCompany.cgpaRequirement}</p>
                <p>
                  Interview Date:{" "}
                  {new Date(selectedCompany.interviewDate).toLocaleDateString()}
                </p>
                <p>Location: {selectedCompany.location}</p>
                <p>Package: {selectedCompany.package}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle>Eligible Students ({eligibleStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {eligibleStudents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead className="text-center">Semester</TableHead>
                      <TableHead className="text-center">CGPA</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibleStudents.map((student) => {
                      const status = getStudentStatus(student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.branch}</TableCell>
                          <TableCell className="text-center">
                            {student.semester}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {student.cgpa}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                status === "eligible"
                                  ? "bg-green-100 text-green-800"
                                  : status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant={
                                  status === "eligible" ? "default" : "outline"
                                }
                                onClick={() =>
                                  handleStatusChange(student.id, "eligible")
                                }
                                disabled={status === "eligible"}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  status === "rejected"
                                    ? "destructive"
                                    : "outline"
                                }
                                onClick={() =>
                                  handleStatusChange(student.id, "rejected")
                                }
                                disabled={status === "rejected"}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No students meet the eligibility criteria for this company.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
