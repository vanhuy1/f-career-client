'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Mail, MoreHorizontal, Eye, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { companyManagementService } from '@/services/api/admin/company-mgm.api';
import { Company } from '@/types/admin/CompanyManagement';

export default function CompaniesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedFilter, setVerifiedFilter] = useState<
    'all' | 'verified' | 'unverified'
  >('all');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    companyId: string;
    companyName: string;
    currentStatus: boolean;
  } | null>(null);
  // Track which companies have at least one disabled user
  const [hasDisabledUsersMap, setHasDisabledUsersMap] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await companyManagementService.getCompanies({
          limit: 100,
          offset: 0,
          isVerified:
            verifiedFilter === 'all'
              ? undefined
              : verifiedFilter === 'verified'
                ? true
                : false,
        });
        setCompanies(response.data.companies || []);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to load companies');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [verifiedFilter]);

  // Load whether verified companies have disabled users
  useEffect(() => {
    const verifiedCompanies = companies.filter((c) => c.isVerified);
    const missingIds = verifiedCompanies
      .map((c) => c.id)
      .filter((id) => hasDisabledUsersMap[id] === undefined);

    if (missingIds.length === 0) return;

    let cancelled = false;
    const run = async () => {
      try {
        const results = await Promise.all(
          missingIds.map(async (id) => {
            const res = await companyManagementService.getCompanyDetail(id);
            const hasDisabled = (res.data.users || []).some(
              (u) => u.isAccountDisabled,
            );
            return { id, hasDisabled };
          }),
        );
        if (cancelled) return;
        setHasDisabledUsersMap((prev) => {
          const next = { ...prev };
          for (const r of results) next[r.id] = r.hasDisabled;
          return next;
        });
      } catch (_) {
        // best-effort; ignore errors per row
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [companies, hasDisabledUsersMap]);

  const getVerifiedBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Verified
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Unverified
      </Badge>
    );
  };

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return companies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.taxCode.toLowerCase().includes(term),
    );
  }, [companies, searchTerm]);

  const handleVerifyToggle = (companyId: string, current: boolean) => {
    const company = companies.find((c) => c.id === companyId);
    if (!company) return;

    setPendingAction({
      companyId,
      companyName: company.companyName,
      currentStatus: current,
    });
    setConfirmDialogOpen(true);
  };

  const confirmVerifyToggle = async () => {
    if (!pendingAction) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = pendingAction.currentStatus
        ? await companyManagementService.unverifyCompany(
            pendingAction.companyId,
          )
        : await companyManagementService.verifyCompany(pendingAction.companyId);

      const updated = res.data;
      setCompanies((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
      );

      setConfirmDialogOpen(false);
      setPendingAction(null);
    } catch (err) {
      const action = pendingAction.currentStatus ? 'unverify' : 'verify';
      setError(typeof err === 'string' ? err : `Failed to ${action} company`);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelVerifyToggle = () => {
    setConfirmDialogOpen(false);
    setPendingAction(null);
  };

  const handleSendEmail = () => {
    console.log('Sending email to:', selectedCompany?.email);
    setEmailDialogOpen(false);
  };

  const handleViewProfile = (companyId: string) => {
    router.push(`/ad/companies/${companyId}`);
  };

  const CompanyTable = ({ companies }: { companies: Company[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              Company Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Tax Code</TableHead>
          <TableHead>Contact Email</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Approve</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell className="font-medium">{company.companyName}</TableCell>
            <TableCell>{company.taxCode}</TableCell>
            <TableCell>{company.email}</TableCell>
            <TableCell>
              {new Date(company.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{getVerifiedBadge(company.isVerified)}</TableCell>
            <TableCell>
              {company.isVerified && hasDisabledUsersMap[company.id] && (
                <Button
                  variant="default"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await companyManagementService.approveCompany(
                        company.id,
                      );
                      const updated = res.data;
                      setCompanies((prev) =>
                        prev.map((c) =>
                          c.id === updated.id ? { ...c, ...updated } : c,
                        ),
                      );
                      // After approve, clear disabled flag for this company
                      setHasDisabledUsersMap((prev) => ({
                        ...prev,
                        [company.id]: false,
                      }));
                    } catch (err) {
                      setError(
                        typeof err === 'string'
                          ? err
                          : 'Failed to approve company users',
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Approve
                </Button>
              )}
            </TableCell>
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
                    onClick={() =>
                      handleVerifyToggle(company.id, company.isVerified)
                    }
                  >
                    {company.isVerified ? 'Mark Unverified' : 'Mark Verified'}
                  </DropdownMenuItem>
                  {/* Approve moved to its own column */}
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
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={verifiedFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setVerifiedFilter('all')}
                  className="h-9"
                >
                  All
                </Button>
                <Button
                  variant={
                    verifiedFilter === 'verified' ? 'default' : 'outline'
                  }
                  onClick={() => setVerifiedFilter('verified')}
                  className="h-9"
                >
                  Verified
                </Button>
                <Button
                  variant={
                    verifiedFilter === 'unverified' ? 'default' : 'outline'
                  }
                  onClick={() => setVerifiedFilter('unverified')}
                  className="h-9"
                >
                  Unverified
                </Button>
              </div>
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search by name, email, or tax code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {isLoading && (
              <div className="py-6 text-sm text-gray-500">
                Loading companies...
              </div>
            )}
            {error && <div className="py-6 text-sm text-red-600">{error}</div>}
            {!isLoading && !error && (
              <CompanyTable companies={filteredCompanies} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCompany?.companyName}
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
              Detailed information about {selectedCompany?.companyName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Company Name
                </Label>
                <p className="text-sm font-medium">
                  {selectedCompany?.companyName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Status
                </Label>
                <div className="mt-1">
                  {selectedCompany &&
                    getVerifiedBadge(selectedCompany.isVerified)}
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
                  Tax Code
                </Label>
                <p className="text-sm">{selectedCompany?.taxCode}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">ID</Label>
                <p className="text-sm">{selectedCompany?.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Created At
                </Label>
                <p className="text-sm">
                  {selectedCompany?.createdAt &&
                    new Date(selectedCompany.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Created At
                </Label>
                <p className="text-sm">
                  {selectedCompany &&
                    selectedCompany.createdAt &&
                    new Date(selectedCompany.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Updated At
                </Label>
                <p className="text-sm">
                  {selectedCompany?.updatedAt &&
                    new Date(selectedCompany.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* No description in API; keeping layout simple */}
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to{' '}
              {pendingAction?.currentStatus ? 'unverify' : 'verify'} the company{' '}
              <span className="font-semibold">
                {pendingAction?.companyName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {pendingAction?.currentStatus
                ? 'This will mark the company as unverified and may affect their visibility and access to certain features.'
                : 'This will mark the company as verified, confirming their legitimacy and granting them full access to the platform.'}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={cancelVerifyToggle}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmVerifyToggle}
              disabled={isLoading}
              variant={pendingAction?.currentStatus ? 'destructive' : 'default'}
            >
              {isLoading
                ? 'Processing...'
                : pendingAction?.currentStatus
                  ? 'Unverify'
                  : 'Verify'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
