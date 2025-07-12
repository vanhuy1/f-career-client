'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Mail,
  MoreHorizontal,
  Eye,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockCompanies, CompanyDetail } from '@/data/mockUsers';

export default function CompaniesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetail | null>(
    null,
  );
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Accepted
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Pending
          </Badge>
        );
      case 'denied':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Denied
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filterCompaniesByStatus = (status: CompanyDetail['status']) => {
    return mockCompanies.filter(
      (company) =>
        company.status === status &&
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.email.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  };

  const handleStatusChange = (
    companyId: number,
    newStatus: CompanyDetail['status'],
  ) => {
    console.log('status change', companyId, newStatus);
  };

  const handleSendEmail = () => {
    console.log('Sending email to:', selectedCompany?.email);
    setEmailDialogOpen(false);
  };

  const handleViewProfile = (companyId: number) => {
    router.push(`/ad/companies/${companyId}`);
  };

  const CompanyTable = ({ companies }: { companies: CompanyDetail[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              Company Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Contact Email</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              Submission Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell>{company.email}</TableCell>
            <TableCell>{company.industry}</TableCell>
            <TableCell>{company.employees}</TableCell>
            <TableCell>{company.location}</TableCell>
            <TableCell>
              {new Date(company.submissionDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{getStatusBadge(company.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleViewProfile(company.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCompany(company);
                      setEmailDialogOpen(true);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(company.id, 'accepted')}
                  >
                    Set as Accepted
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(company.id, 'pending')}
                  >
                    Set as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(company.id, 'denied')}
                  >
                    Set as Denied
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Companies</h1>
        <p className="mt-2 text-gray-600">
          Review and manage company applications
        </p>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Company Applications
            </CardTitle>
            <div className="flex w-full gap-2 sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="accepted" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                Accepted ({filterCompaniesByStatus('accepted').length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending ({filterCompaniesByStatus('pending').length})
              </TabsTrigger>
              <TabsTrigger value="denied" className="flex items-center gap-2">
                Denied ({filterCompaniesByStatus('denied').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accepted">
              <CompanyTable companies={filterCompaniesByStatus('accepted')} />
            </TabsContent>

            <TabsContent value="pending">
              <CompanyTable companies={filterCompaniesByStatus('pending')} />
            </TabsContent>

            <TabsContent value="denied">
              <CompanyTable companies={filterCompaniesByStatus('denied')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" value={selectedCompany?.email || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter email subject" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Company Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Company Name
                </Label>
                <p className="text-sm font-medium">{selectedCompany?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Status
                </Label>
                <div className="mt-1">
                  {selectedCompany && getStatusBadge(selectedCompany.status)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Contact Email
                </Label>
                <p className="text-sm">{selectedCompany?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Industry
                </Label>
                <p className="text-sm">{selectedCompany?.industry}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Employees
                </Label>
                <p className="text-sm">{selectedCompany?.employees}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Location
                </Label>
                <p className="text-sm">{selectedCompany?.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Submission Date
                </Label>
                <p className="text-sm">
                  {selectedCompany &&
                    new Date(
                      selectedCompany.submissionDate,
                    ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Founded
                </Label>
                <p className="text-sm">{selectedCompany?.foundedYear}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Description
              </Label>
              <p className="text-sm text-gray-600">
                {selectedCompany?.description}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setProfileDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setProfileDialogOpen(false);
                if (selectedCompany) {
                  handleViewProfile(selectedCompany.id);
                }
              }}
            >
              View Full Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
