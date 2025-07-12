'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
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
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Clock,
  Activity,
  Flag,
} from 'lucide-react';
import { ROLES } from '@/enums/roles.enum';
import { UserDetail, getUserById } from '@/data/mockUsers';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userId = parseInt(params?.id as string);
      const userData = getUserById(userId);
      setUser(userData || null);
      setLoading(false);
    }, 1000);
  }, [params?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        );
      case 'unverified':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="mr-1 h-3 w-3" />
            Unverified
          </Badge>
        );
      case 'banned':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="mr-1 h-3 w-3" />
            Banned
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case 'RECRUITER':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Users className="mr-1 h-3 w-3" />
            Recruiter
          </Badge>
        );
      case 'ADMIN_RECRUITER':
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
            <Shield className="mr-1 h-3 w-3" />
            Admin Recruiter
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            User
          </Badge>
        );
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

  const handleStatusChange = (
    newStatus: 'verified' | 'unverified' | 'banned',
  ) => {
    if (user) {
      setUser({ ...user, status: newStatus });
      // Here you would typically make an API call to update the user status
      console.log(`Changing user ${user.id} status to ${newStatus}`);
    }
  };

  const handleRoleChange = (newRole: keyof typeof ROLES) => {
    if (user) {
      setUser({ ...user, role: newRole });
      // Here you would typically make an API call to update the user role
      console.log(`Changing user ${user.id} role to ${newRole}`);
    }
  };

  const handleReportAction = (
    reportId: number,
    action: 'resolve' | 'dismiss',
  ) => {
    if (user) {
      const updatedReports = user.reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: (action === 'resolve' ? 'resolved' : 'dismissed') as
                | 'resolved'
                | 'dismissed',
            }
          : report,
      );
      setUser({ ...user, reports: updatedReports });
      console.log(`${action} report ${reportId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User Not Found</h1>
          <p className="mt-2 text-gray-600">
            The user you&apos;re looking for doesn&apos;t exist.
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
            Back to Users
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || '/placeholder.svg'} />
              <AvatarFallback className="text-2xl">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-lg text-gray-600">@{user.username}</p>
              <div className="mt-2 flex items-center gap-3">
                {getStatusBadge(user.status)}
                {getRoleBadge(user.role)}
                {user.accountWarnings > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {user.accountWarnings} Warning
                    {user.accountWarnings > 1 ? 's' : ''}
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
                  Edit User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                  <DialogDescription>
                    Make changes to user account settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={user.status}
                      onValueChange={(
                        value: 'verified' | 'unverified' | 'banned',
                      ) => handleStatusChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={user.role}
                      onValueChange={(value: keyof typeof ROLES) =>
                        handleRoleChange(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ROLES).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.replace('_', ' ')}
                          </SelectItem>
                        ))}
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

            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>

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
                    Add a private note about this user for admin reference.
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
            {user.reports.filter((r) => r.status === 'pending').length > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                {user.reports.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Full Name
                  </Label>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Phone
                    </Label>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                )}
                {user.birthday && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Birthday
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(user.birthday).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.location && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Location
                    </Label>
                    <p className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </p>
                  </div>
                )}
                {user.bio && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Bio
                    </Label>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Account Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Applications
                    </Label>
                    <p className="text-2xl font-bold">
                      {user.totalApplications}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Jobs Posted
                    </Label>
                    <p className="text-2xl font-bold">{user.totalJobs}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Profile Views
                    </Label>
                    <p className="text-2xl font-bold">{user.profileViews}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Logins
                    </Label>
                    <p className="text-2xl font-bold">{user.loginCount}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Member Since
                  </Label>
                  <p className="text-sm">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Last Active
                  </Label>
                  <p className="text-sm">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Verified</span>
                  {user.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phone Verified</span>
                  {user.phoneVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">2FA Enabled</span>
                  {user.twoFactorEnabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Account Warnings
                  </Label>
                  <p className="text-sm font-medium text-red-600">
                    {user.accountWarnings}
                  </p>
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
                User Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  {user.reports.map((report) => (
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
                {user.activityLogs.map((log) => (
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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Last Password Change
                  </Label>
                  <p className="text-sm">
                    {new Date(user.lastPasswordChange).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm">
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Permissions
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
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
              {user.suspensionHistory.length > 0 ? (
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
                    {user.suspensionHistory.map((suspension) => (
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
