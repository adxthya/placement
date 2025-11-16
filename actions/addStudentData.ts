import { db, auth } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { StudentData } from "@/types/student";
import { CompanyData } from "@/types/companyData";

export async function saveStudentData(data: StudentData) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User not logged in.");
  }

  const docId = user.email; // only used as doc ID, not stored

  const studentsRef = collection(db, "students");
  const studentDoc = doc(studentsRef, docId);

  await setDoc(studentDoc, {
    ...data,
    cgpa: Number(data.cgpa),
    semester: Number(data.semester),
    createdAt: new Date().toISOString(),
  });
}

export async function fetchStudentData() {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User not logged in");
  }

  const docRef = doc(db, "students", user.email);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error("Student profile not found");
  }

  return snap.data() as StudentData;
}

export async function updateStudentData(data: StudentData): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Not logged in");

  const ref = doc(db, "students", user.email);

  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function fetchAllStudentsData(): Promise<StudentData[]> {
  const studentsRef = collection(db, "students");
  const snapshot = await getDocs(studentsRef);
  const data: StudentData[] = [];

  snapshot.forEach((doc) => {
    const student = doc.data();
    data.push({
      name: student.name,
      email: student.email,
      cgpa: Number(student.cgpa),
      semester: Number(student.semester),
      branch: student.branch,
      universityId: student.universityId,
      collegeId: student.collegeId,
      createdAt: student.createdAt,
    });
  });

  return data;
}

// Save or update a company
export async function saveCompanyData(data: CompanyData) {
  const companiesRef = collection(db, "companies");
  const companyDoc = doc(companiesRef, data.id);

  await setDoc(companyDoc, {
    ...data,
    cgpaRequirement: Number(data.cgpaRequirement), // ensure number
    interviewDate: data.interviewDate,
  });
}

// Fetch all companies
export async function fetchAllCompaniesData(): Promise<CompanyData[]> {
  const companiesRef = collection(db, "companies");
  const snapshot = await getDocs(companiesRef);

  const data: CompanyData[] = [];

  snapshot.forEach((doc) => {
    const company = doc.data();
    data.push({
      id: doc.id,
      name: company.name,
      cgpaRequirement: Number(company.cgpaRequirement),
      interviewDate: company.interviewDate,
      location: company.location,
      package: company.package,
      eligibleBranches: company.eligibleBranches || [],
    });
  });

  return data;
}

export async function deleteCompanyData(id: string) {
  if (!id) throw new Error("Invalid company ID");

  const companyDocRef = doc(db, "companies", id);
  await deleteDoc(companyDocRef);
}
