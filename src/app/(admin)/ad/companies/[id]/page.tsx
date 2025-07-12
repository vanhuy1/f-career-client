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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Edit,
  Mail,
  MapPin,
  Calendar,
  Building,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Clock,
  Activity,
  Flag,
  Globe,
  Phone,
  DollarSign,
  TrendingUp,
  Star,
  ExternalLink,
} from 'lucide-react';
import { CompanyDetail, getCompanyById } from '@/data/mockUsers';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const companyId = parseInt(params?.id as string);
      const companyData = getCompanyById(companyId);
      setCompany(companyData || null);
      setLoading(false);
    }, 1000);
  }, [params?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'denied':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="mr-1 h-3 w-3" />
            Denied
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Star className="mr-1 h-3 w-3" />
            Enterprise
          </Badge>
        );
      case 'premium':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <TrendingUp className="mr-1 h-3 w-3" />
            Premium
          </Badge>
        );
      case 'free':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Users className="mr-1 h-3 w-3" />
            Free
          </Badge>
        );
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  const getReportSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800">Dismissed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (newStatus: 'accepted' | 'pending' | 'denied') => {
    if (company) {
      setCompany({ ...company, status: newStatus });
      // Here you would typically make an API call to update the company status
      console.log(`Changing company ${company.id} status to ${newStatus}`);
    }
  };

  const handleReportAction = (
    reportId: number,
    action: 'resolve' | 'dismiss',
  ) => {
    if (company) {
      const updatedReports = company.reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: (action === 'resolve' ? 'resolved' : 'dismissed') as
                | 'resolved'
                | 'dismissed',
            }
          : report,
      );
      setCompany({ ...company, reports: updatedReports });
      console.log(`${action} report ${reportId}`);
    }
  };

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
              <AvatarImage src={company.logo || '/placeholder.svg'} />
              <AvatarFallback className="text-2xl">
                {company.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <p className="text-lg text-gray-600">{company.industry}</p>
              <div className="mt-2 flex items-center gap-3">
                {getStatusBadge(company.status)}
                {getSubscriptionBadge(company.subscriptionPlan)}
                {company.companyWarnings > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {company.companyWarnings} Warning
                    {company.companyWarnings > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Company</DialogTitle>
                  <DialogDescription>
                    Make changes to company account settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={company.status}
                      onValueChange={(
                        value: 'accepted' | 'pending' | 'denied',
                      ) => handleStatusChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="denied">Denied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="subscription">Subscription Plan</Label>
                    <Select
                      value={company.subscriptionPlan}
                      onValueChange={(
                        value: 'free' | 'premium' | 'enterprise',
                      ) => {
                        setCompany({ ...company, subscriptionPlan: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setEditDialogOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
                    Send an email to {company.name}
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

            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Admin Note</DialogTitle>
                  <DialogDescription>
                    Add a private note about this company for admin reference.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Enter your note here..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setNoteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setNoteDialogOpen(false)}>
                    Save Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {company.reports.filter((r) => r.status === 'pending').length >
              0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                {company.reports.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
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
                  <p className="text-sm font-medium">{company.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{company.email}</p>
                </div>
                {company.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Phone
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      {company.phone}
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
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Location
                  </Label>
                  <p className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Founded
                  </Label>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {company.foundedYear}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Description
                  </Label>
                  <p className="text-sm text-gray-600">{company.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Company Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Company Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Total Jobs
                    </Label>
                    <p className="text-2xl font-bold">{company.totalJobs}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Active Jobs
                    </Label>
                    <p className="text-2xl font-bold">{company.activeJobs}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Applications
                    </Label>
                    <p className="text-2xl font-bold">
                      {company.totalApplications}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Hires
                    </Label>
                    <p className="text-2xl font-bold">{company.totalHires}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Profile Views
                  </Label>
                  <p className="text-2xl font-bold">{company.profileViews}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Member Since
                  </Label>
                  <p className="text-sm">
                    {new Date(company.submissionDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Last Active
                  </Label>
                  <p className="text-sm">
                    {new Date(company.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Verified</span>
                  {company.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phone Verified</span>
                  {company.phoneVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Company Warnings
                  </Label>
                  <p className="text-sm font-medium text-red-600">
                    {company.companyWarnings}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Employees
                  </Label>
                  <p className="text-sm font-medium">{company.employees}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Company Size
                  </Label>
                  <p className="text-sm">{company.companySize}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Person & Social Media */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Person
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Name
                  </Label>
                  <p className="text-sm font-medium">
                    {company.contactPerson.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Role
                  </Label>
                  <p className="text-sm">{company.contactPerson.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{company.contactPerson.email}</p>
                </div>
                {company.contactPerson.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Phone
                    </Label>
                    <p className="text-sm">{company.contactPerson.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Social Media & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Social Media
                  </Label>
                  <div className="space-y-2">
                    {company.socialMedia.linkedin && (
                      <p className="text-sm">
                        <a
                          href={company.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </p>
                    )}
                    {company.socialMedia.twitter && (
                      <p className="text-sm">
                        <a
                          href={company.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Twitter
                        </a>
                      </p>
                    )}
                    {company.socialMedia.facebook && (
                      <p className="text-sm">
                        <a
                          href={company.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Benefits
                  </Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {company.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Company Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.reports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.reportedBy}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.reason}</p>
                            <p className="text-sm text-gray-500">
                              {report.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getReportSeverityBadge(report.severity)}
                        </TableCell>
                        <TableCell>
                          {new Date(report.reportDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getReportStatusBadge(report.status)}
                        </TableCell>
                        <TableCell>
                          {report.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReportAction(report.id, 'resolve')
                                }
                              >
                                Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReportAction(report.id, 'dismiss')
                                }
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No reports found for this company.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">{log.description}</p>
                      <p className="text-xs text-gray-500">
                        IP: {log.ipAddress} • {log.userAgent.substring(0, 50)}
                        ...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Current Plan
                  </Label>
                  <div className="mt-1">
                    {getSubscriptionBadge(company.subscriptionPlan)}
                  </div>
                </div>
                {company.subscriptionExpiry && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Expires
                    </Label>
                    <p className="text-sm">
                      {new Date(
                        company.subscriptionExpiry,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {company.fundingStage && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Funding Stage
                    </Label>
                    <p className="text-sm font-medium">
                      {company.fundingStage}
                    </p>
                  </div>
                )}
                {company.revenue && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Revenue
                    </Label>
                    <p className="text-sm font-medium">{company.revenue}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Suspension History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.suspensionHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reason</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Issued By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.suspensionHistory.map((suspension) => (
                      <TableRow key={suspension.id}>
                        <TableCell>{suspension.reason}</TableCell>
                        <TableCell>
                          {new Date(suspension.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(suspension.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{suspension.issuedBy}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              suspension.status === 'active'
                                ? 'bg-red-100 text-red-800'
                                : suspension.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {suspension.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No suspension history found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
