"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, IndianRupeeIcon, GraduationCap } from "lucide-react";

import {
  fetchStudentData,
  fetchAllCompaniesData,
  fetchEligibilityForStudent,
  EligibilityStatus,
} from "@/actions/addStudentData";

import { Student } from "@/types/student";
import { CompanyData } from "@/types/companyData";

const EligibleInterviews = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [eligibilities, setEligibilities] = useState<EligibilityStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (!user) {
        setLoading(false);
        return;
      }

      const std = await fetchStudentData();
      if (!std) {
        setLoading(false);
        return;
      }

      setStudent(std);

      const fetchedCompanies = await fetchAllCompaniesData();
      setCompanies(fetchedCompanies);

      // FIX: Use user.email instead of std.id (std.id does not exist)
      const records = await fetchEligibilityForStudent(user.email!);
      setEligibilities(records);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        No student profile found.
      </div>
    );
  }

  const eligibleCompanies = companies.filter((company) =>
    eligibilities.some(
      (record) =>
        record.companyId === company.id && record.status === "eligible"
    )
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Eligible Interviews</h1>
      <p className="text-muted-foreground">
        Placement opportunities based on your profile
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">CGPA: {student.cgpa}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{student.branch}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Semester {student.semester}</span>
          </div>
        </CardContent>
      </Card>

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
                  <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
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
                No eligible interviews found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EligibleInterviews;
