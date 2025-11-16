import { db, auth } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { StudentData } from "@/types/student";

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
