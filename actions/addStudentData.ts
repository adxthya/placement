import { db, auth } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Student, StudentData } from "@/types/student";
import { CompanyData } from "@/types/companyData";

export type EligibilityStatus = {
  companyId: string;
  studentId: string;
  status: "pending" | "eligible" | "rejected";
};

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

  return snap.data() as Student;
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

export async function fetchAllStudentsData(): Promise<Student[]> {
  const studentsRef = collection(db, "students");
  const snapshot = await getDocs(studentsRef);

  const data: Student[] = [];

  snapshot.forEach((docSnap) => {
    const student = docSnap.data();

    data.push({
      id: docSnap.id, // doc id from Firestore
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

export async function deleteCompanyData(companyId: string) {
  if (!companyId) throw new Error("Invalid company ID");

  // Delete the company document
  const companyDocRef = doc(db, "companies", companyId);
  await deleteDoc(companyDocRef);

  // Delete all related eligibilityStatus documents
  const statusRef = collection(db, "eligibilityStatus");
  const q = query(statusRef, where("companyId", "==", companyId));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletePromises);
}

export async function saveStudentStatus(
  companyId: string,
  studentId: string,
  status: string
) {
  const ref = doc(db, "eligibilityStatus", `${companyId}-${studentId}`);

  await setDoc(ref, {
    companyId,
    studentId,
    status,
    updatedAt: new Date(),
  });
}

// Fetch eligibility statuses
export async function getStudentStatuses() {
  const snap = await getDocs(collection(db, "eligibilityStatus"));
  const map: Record<string, string> = {};
  snap.docs.forEach((doc) => {
    const d = doc.data();
    map[`${d.companyId}-${d.studentId}`] = d.status;
  });
  return map;
}

export async function fetchEligibilityForStudent(
  studentId: string
): Promise<EligibilityStatus[]> {
  const statusRef = collection(db, "eligibilityStatus");
  const q = query(statusRef, where("studentId", "==", studentId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => docSnap.data() as EligibilityStatus);
}
