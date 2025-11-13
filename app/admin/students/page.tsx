import { mockStudents } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground">
          Students
        </h2>
        <p className="text-muted-foreground mt-1">
          View all registered students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students ({mockStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                {mockStudents.map((student) => (
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.cgpa >= 8.5
                            ? "bg-green-100 text-green-800"
                            : student.cgpa >= 7.5
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {student.cgpa}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
