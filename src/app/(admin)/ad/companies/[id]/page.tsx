'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  XCircle,
  Users,
  Activity,
  Flag,
  Globe,
  Phone,
} from 'lucide-react';
import { CompanyDetail } from '@/types/admin/CompanyManagement';
import { companyManagementService } from '@/services/api/admin/company-mgm.api';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const id = String(params?.id ?? '');
        if (!id) return;
        const res = await companyManagementService.getCompanyDetail(id);
        setCompany(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params?.id]);

  const handleSendEmail = () => {
    console.log('Sending email to:', company?.email);
    console.log('Subject:', emailSubject);
    console.log('Message:', emailMessage);
    setEmailDialogOpen(false);
    setEmailSubject('');
    setEmailMessage('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Company Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The company you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={company.logoUrl || '/placeholder.svg'} />
              <AvatarFallback className="text-2xl">
                {company.companyName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.companyName}
              </h1>
              {company.industry && (
                <p className="text-lg text-gray-600">{company.industry}</p>
              )}
              <div className="mt-2 flex items-center gap-3">
                {company.isVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Unverified</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Send Email</DialogTitle>
                  <DialogDescription>
                    Send an email to {company.companyName}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" value={company.email} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      rows={5}
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEmailDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSendEmail}>Send Email</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Company Name
                  </Label>
                  <p className="text-sm font-medium">{company.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{company.email}</p>
                </div>
                {company.phone !== null && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Phone
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {company.phone || '-'}
                    </p>
                  </div>
                )}
                {company.website && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Website
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    </p>
                  </div>
                )}
                {company.address && company.address.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Address
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {company.address.join(', ')}
                    </p>
                  </div>
                )}
                {company.foundedAt && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Founded
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(company.foundedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {company.industry && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Industry
                    </Label>
                    <p className="text-sm">{company.industry}</p>
                  </div>
                )}
                {company.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Description
                    </Label>
                    <p className="text-sm whitespace-pre-line text-gray-600">
                      {company.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Company Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Open Positions
                    </Label>
                    <p className="text-2xl font-bold">
                      {company.openPositions.length}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Users
                    </Label>
                    <p className="text-2xl font-bold">{company.users.length}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Created At
                  </Label>
                  <p className="text-sm">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Updated At
                  </Label>
                  <p className="text-sm">
                    {new Date(company.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verified</span>
                  {company.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Tax Code
                  </Label>
                  <p className="text-sm">{company.taxCode}</p>
                </div>
                {company.businessLicenseUrl && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Business License
                    </Label>
                    <p className="text-sm">
                      <a
                        href={company.businessLicenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Open Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.openPositions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.openPositions.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>{p.category?.name}</TableCell>
                        <TableCell>{p.location}</TableCell>
                        <TableCell>{p.status}</TableCell>
                        <TableCell>{p.typeOfEmployment}</TableCell>
                        <TableCell>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No open positions.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Disabled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.username}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          {u.isAccountDisabled ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No users found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
