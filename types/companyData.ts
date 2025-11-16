// type/companydata.ts
export type CompanyData = {
  id: string;
  name: string;
  cgpaRequirement: number;
  interviewDate: string; // ISO string
  location: string;
  package: string;
  eligibleBranches: string[];
};
