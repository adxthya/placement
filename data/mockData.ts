export interface Student {
  id: string;
  name: string;
  email: string;
  cgpa: number;
  semester: number;
  branch: string;
}

export interface Company {
  id: string;
  name: string;
  cgpaRequirement: number;
  interviewDate: string;
  location: string;
  package: string;
  eligibleBranches: string[];
}

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    cgpa: 8.5,
    semester: 6,
    branch: "Computer Science",
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    cgpa: 9.2,
    semester: 7,
    branch: "Information Technology",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    cgpa: 7.8,
    semester: 6,
    branch: "Electrical Engineering",
  },
  {
    id: "4",
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    cgpa: 8.9,
    semester: 8,
    branch: "Computer Science",
  },
  {
    id: "5",
    name: "Vikram Reddy",
    email: "vikram.reddy@example.com",
    cgpa: 7.5,
    semester: 7,
    branch: "Mechanical Engineering",
  },
];

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechCorp India",
    cgpaRequirement: 8.0,
    interviewDate: "2025-12-15",
    location: "Bangalore",
    package: "12 LPA",
    eligibleBranches: ["Computer Science", "Information Technology"],
  },
  {
    id: "2",
    name: "Innovate Solutions",
    cgpaRequirement: 7.5,
    interviewDate: "2025-12-20",
    location: "Pune",
    package: "10 LPA",
    eligibleBranches: [
      "Computer Science",
      "Information Technology",
      "Electrical Engineering",
    ],
  },
  {
    id: "3",
    name: "Global Systems",
    cgpaRequirement: 8.5,
    interviewDate: "2025-12-25",
    location: "Hyderabad",
    package: "15 LPA",
    eligibleBranches: ["Computer Science", "Information Technology"],
  },
];
