"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mockCompanies, Company } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Calendar, MapPin, Briefcase } from "lucide-react";

const branches = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Chemical Engineering",
  "Biotechnology",
];

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cgpaRequirement: "",
    interviewDate: "",
    location: "",
    package: "",
    eligibleBranches: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branch: string) => {
    setFormData((prev) => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCompany: Company = {
      id: Date.now().toString(),
      name: formData.name,
      cgpaRequirement: parseFloat(formData.cgpaRequirement),
      interviewDate: formData.interviewDate,
      location: formData.location,
      package: formData.package,
      eligibleBranches: formData.eligibleBranches,
    };

    setCompanies([...companies, newCompany]);
    setOpen(false);
    setFormData({
      name: "",
      cgpaRequirement: "",
      interviewDate: "",
      location: "",
      package: "",
      eligibleBranches: [],
    });

    toast.success(`${newCompany.name} added successfully!`, {
      description: "Company has been added to the list.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Companies
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage placement companies
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cgpaRequirement">CGPA Requirement</Label>
                  <Input
                    id="cgpaRequirement"
                    name="cgpaRequirement"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.cgpaRequirement}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date</Label>
                  <Input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="package">Package</Label>
                  <Input
                    id="package"
                    name="package"
                    placeholder="e.g., 12 LPA"
                    value={formData.package}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eligible Branches</Label>
                <div className="grid grid-cols-2 gap-2">
                  {branches.map((branch) => (
                    <label
                      key={branch}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.eligibleBranches.includes(branch)}
                        onChange={() => handleBranchToggle(branch)}
                        className="rounded border-input"
                      />
                      <span className="text-sm">{branch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Add Company
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span>{company.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Min CGPA: {company.cgpaRequirement}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(company.interviewDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{company.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{company.package}</span>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Eligible Branches:
                </p>
                <div className="flex flex-wrap gap-1">
                  {company.eligibleBranches.map((branch) => (
                    <span
                      key={branch}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
