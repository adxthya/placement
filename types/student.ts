export type StudentData = {
  name: string;
  email: string; // student-entered email (college email)
  cgpa: number;
  semester: number;
  branch: string;
  universityId: string;
  collegeId: string;
  createdAt?: string;
};

export type Student = StudentData & {
  id: string; // Firestore document ID
};
