"use client";

import { useEffect, useState } from "react";
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
import {
  Plus,
  Calendar,
  MapPin,
  Briefcase,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CompanyData } from "@/types/companyData";
import {
  saveCompanyData,
  fetchAllCompaniesData,
  deleteCompanyData,
} from "@/actions/addStudentData";

const branches = [
  "Computer Science",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Bio Medical Engineering",
  "Biotechnology",
];

export default function Companies() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<CompanyData | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    cgpaRequirement: "",
    interviewDate: "",
    location: "",
    package: "",
    eligibleBranches: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true);
      try {
        const data = await fetchAllCompaniesData();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    }
    loadCompanies();
  }, []);

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

  const handleEdit = (company: CompanyData) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      cgpaRequirement: company.cgpaRequirement.toString(),
      interviewDate: company.interviewDate,
      location: company.location,
      package: company.package,
      eligibleBranches: company.eligibleBranches,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const companyData: CompanyData = {
      id: editingCompany ? editingCompany.id : Date.now().toString(),
      name: formData.name,
      cgpaRequirement: parseFloat(formData.cgpaRequirement),
      interviewDate: formData.interviewDate,
      location: formData.location,
      package: formData.package,
      eligibleBranches: formData.eligibleBranches,
    };

    try {
      await saveCompanyData(companyData);

      if (editingCompany) {
        setCompanies((prev) =>
          prev.map((c) => (c.id === editingCompany.id ? companyData : c))
        );
        toast.success("Company Updated", {
          description: `${companyData.name} has been updated successfully.`,
        });
      } else {
        setCompanies((prev) => [...prev, companyData]);
        toast.success("Company Added", {
          description: `${companyData.name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save company");
    } finally {
      setIsSubmitting(false);
      setOpen(false);
      setEditingCompany(null);
      setFormData({
        name: "",
        cgpaRequirement: "",
        interviewDate: "",
        location: "",
        package: "",
        eligibleBranches: [],
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    try {
      await deleteCompanyData(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success("Company Deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete company");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Companies</h2>
          <p className="text-muted-foreground mt-1">
            Manage placement companies
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditingCompany(null);
              setFormData({
                name: "",
                cgpaRequirement: "",
                interviewDate: "",
                location: "",
                package: "",
                eligibleBranches: [],
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? "Edit Company" : "Add New Company"}
              </DialogTitle>
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
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : editingCompany
                  ? "Update Company"
                  : "Add Company"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <p className="text-center col-span-full">Loading companies...</p>
        ) : companies.length === 0 ? (
          <p className="text-center col-span-full">No companies available.</p>
        ) : (
          companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{company.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-normal text-muted-foreground">
                      Min CGPA: {company.cgpaRequirement}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(company)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(company.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
          ))
        )}
      </div>
    </div>
  );
}
