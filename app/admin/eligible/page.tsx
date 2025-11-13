"use client";
import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EligibleStudents() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    mockCompanies[0]?.id || ""
  );

  const selectedCompany = mockCompanies.find((c) => c.id === selectedCompanyId);

  const eligibleStudents = selectedCompany
    ? mockStudents.filter(
        (student) =>
          student.cgpa >= selectedCompany.cgpaRequirement &&
          selectedCompany.eligibleBranches.includes(student.branch)
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground">
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibleStudents.map((student) => (
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
                      </TableRow>
                    ))}
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
