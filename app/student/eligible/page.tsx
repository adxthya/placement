"use client";

import { useEffect, useState } from "react";
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

import {
  fetchAllStudentsData,
  fetchAllCompaniesData,
  fetchEligibilityForStudent,
  EligibilityStatus,
} from "@/actions/addStudentData";

import { Student } from "@/types/student";
import { CompanyData } from "@/types/companyData";

const EligibleInterviews = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [eligibilities, setEligibilities] = useState<EligibilityStatus[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [fetchedStudents, fetchedCompanies] = await Promise.all([
        fetchAllStudentsData(),
        fetchAllCompaniesData(),
      ]);

      setStudents(fetchedStudents);
      setCompanies(fetchedCompanies);
      setSelectedStudentId(fetchedStudents[0]?.id || null);
      setLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    async function loadEligibilities() {
      const records = await fetchEligibilityForStudent(selectedStudentId!);
      setEligibilities(records);
    }

    loadEligibilities();
  }, [selectedStudentId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        Loading…
      </div>
    );
  }

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || null;

  const eligibleCompanies = companies.filter((company) =>
    eligibilities.some(
      (record) =>
        record.studentId === selectedStudentId &&
        record.companyId === company.id &&
        record.status === "eligible"
    )
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
          value={selectedStudentId || ""}
          onValueChange={(val) => setSelectedStudentId(val)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
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
                  {company.eligibleBranches.map((branch: string) => (
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
