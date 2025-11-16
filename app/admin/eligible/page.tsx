"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchAllStudentsData,
  fetchAllCompaniesData,
  saveStudentStatus,
  getStudentStatuses,
} from "@/actions/addStudentData";

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

type Student = {
  id: string;
  name: string;
  email: string;
  branch: string;
  semester: number;
  cgpa: number;
};

type Company = {
  id: string;
  name: string;
  cgpaRequirement: number;
  eligibleBranches: string[];
  interviewDate: string;
  location: string;
  package: string;
};

type StudentStatus = "pending" | "eligible" | "rejected";

export default function EligibleStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statuses, setStatuses] = useState<Record<string, StudentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [s, c, stRaw] = await Promise.all([
        fetchAllStudentsData(),
        fetchAllCompaniesData(),
        getStudentStatuses(),
      ]);

      setStudents(s);
      setCompanies(c);

      // Cast statuses to proper type
      const st: Record<string, StudentStatus> = {};
      Object.keys(stRaw).forEach((key) => {
        const value = stRaw[key];
        if (
          value === "eligible" ||
          value === "rejected" ||
          value === "pending"
        ) {
          st[key] = value;
        } else {
          st[key] = "pending"; // fallback
        }
      });
      setStatuses(st);

      setSelectedCompanyId(c[0]?.id || "");
      setLoading(false);
    }

    load();
  }, []);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const eligibleStudents = selectedCompany
    ? students.filter(
        (student) =>
          student.cgpa >= selectedCompany.cgpaRequirement &&
          selectedCompany.eligibleBranches.includes(student.branch)
      )
    : [];

  const getStatus = (studentId: string): StudentStatus => {
    return statuses[`${selectedCompanyId}-${studentId}`] || "pending";
  };

  const handleStatusChange = async (
    studentId: string,
    status: StudentStatus
  ) => {
    await saveStudentStatus(selectedCompanyId, studentId, status);

    setStatuses((prev) => ({
      ...prev,
      [`${selectedCompanyId}-${studentId}`]: status,
    }));

    const student = students.find((s) => s.id === studentId);

    toast(
      status === "eligible"
        ? "Student Marked Eligible"
        : "Student Marked Rejected",
      {
        description: `${student?.name} has been marked as ${status}.`,
        duration: 3000,
      }
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        Loading…
      </div>
    );
  }

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
          <Label>Company</Label>
          <Select
            value={selectedCompanyId}
            onValueChange={setSelectedCompanyId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                      const status = getStatus(student.id);

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
                            {student.cgpa}
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
                              {status}
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
                No students meet this company’s eligibility criteria.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
