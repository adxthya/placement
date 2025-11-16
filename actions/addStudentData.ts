import { db, auth } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export type StudentData = {
  name: string;
  email: string; // student's actual form email
  cgpa: string;
  semester: string;
  branch: string;
  universityId: string;
  collegeId: string;
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
    createdAt: new Date().toISOString(),
  });
}
