'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Mail,
  MoreHorizontal,
  Eye,
  Filter,
  ArrowUpDown,
  Loader2,
  EyeOff,
} from 'lucide-react';
import { userManagementService } from '@/services/api/admin/user-mgm.api';
import { User, UserResponse } from '@/types/admin/UserManagement';
import { ROLES } from '@/enums/roles.enum';

type UserStatus = 'active' | 'disabled';
type RoleFilter = 'all' | ROLES;

// Utility functions for masking PII data
const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.substring(0, 2)}***@${domain}`;
};

const maskName = (name: string): string => {
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 2) return part;
      return `${part[0]}***${part[part.length - 1]}`;
    })
    .join(' ');
};

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPII, setShowPII] = useState(false);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [pagination, setPagination] = useState({
    count: 0,
    limit: 100,
    offset: 0,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: UserResponse = await userManagementService.getUsers({
        limit: pagination.limit,
        offset: pagination.offset,
      });
      setUsers(response.data.users);
      setPagination((prev) => ({
        ...prev,
        count: response.data.count,
      }));
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset]);
  useEffect(() => {
    fetchUsers();
  }, [pagination.offset, pagination.limit, fetchUsers]);

  const getStatusBadge = (user: User) => {
    if (user.isAccountDisabled) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Disabled
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    );
  };

  const getUserStatus = (user: User): UserStatus => {
    return user.isAccountDisabled ? 'disabled' : 'active';
  };

  const filterUsers = (status: UserStatus) => {
    return users.filter((user) => {
      const userStatus = getUserStatus(user);
      const matchesStatus = userStatus === status;
      const matchesRole =
        roleFilter === 'all' || user.roles.includes(roleFilter as ROLES);
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesRole && matchesSearch;
    });
  };

  const handleStatusChange = async (
    userId: number,
    newStatus: 'active' | 'disabled',
  ) => {
    try {
      const isAccountDisabled = newStatus === 'disabled';
      await userManagementService.updateUserStatus({
        id: userId.toString(),
        isAccountDisabled,
      });

      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(false);
  };

  const handleViewProfile = (userId: number) => {
    router.push(`/ad/users/${userId}`);
  };

  const UserTable = ({ users: tableUsers }: { users: User[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              User <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              Created <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || '/placeholder.svg'} />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <button
                    onClick={() => handleViewProfile(user.id)}
                    className="cursor-pointer text-left font-medium hover:text-blue-600"
                  >
                    {showPII ? user.name : maskName(user.name)}
                  </button>
                  <div className="text-sm text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              @{showPII ? user.username : maskName(user.username)}
            </TableCell>
            <TableCell>
              {showPII ? user.email : maskEmail(user.email)}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="outline" className="text-xs">
                    {role.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {new Date(user.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{getStatusBadge(user)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedUser(user);
                      setEmailDialogOpen(true);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(user.id, 'active')}
                    disabled={!user.isAccountDisabled}
                  >
                    Enable Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(user.id, 'disabled')}
                    disabled={user.isAccountDisabled}
                  >
                    Disable Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="mt-2 text-gray-600">Review and manage user accounts</p>
        </div>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="font-medium text-red-800">Error: {error}</div>
            <Button onClick={fetchUsers} className="mt-4" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-2 text-gray-600">Review and manage user accounts</p>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              User Accounts ({pagination.count} total)
            </CardTitle>
            <div className="flex w-full gap-2 sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:w-[300px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-700">
                    Filter by Role
                  </div>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter('all')}
                    className={
                      roleFilter === 'all' ? 'bg-blue-50 text-blue-600' : ''
                    }
                  >
                    {roleFilter === 'all' && '✓ '}All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter(ROLES.USER)}
                    className={
                      roleFilter === ROLES.USER
                        ? 'bg-blue-50 text-blue-600'
                        : ''
                    }
                  >
                    {roleFilter === ROLES.USER && '✓ '}User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter(ROLES.RECRUITER)}
                    className={
                      roleFilter === ROLES.RECRUITER
                        ? 'bg-blue-50 text-blue-600'
                        : ''
                    }
                  >
                    {roleFilter === ROLES.RECRUITER && '✓ '}Recruiter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRoleFilter(ROLES.ADMIN_RECRUITER)}
                    className={
                      roleFilter === ROLES.ADMIN_RECRUITER
                        ? 'bg-blue-50 text-blue-600'
                        : ''
                    }
                  >
                    {roleFilter === ROLES.ADMIN_RECRUITER && '✓ '}Admin
                    Recruiter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant={showPII ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPII(!showPII)}
                className="flex items-center gap-2"
              >
                {showPII ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showPII ? 'Hide PII' : 'Show PII'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="active" className="flex items-center gap-2">
                Active ({filterUsers('active').length})
              </TabsTrigger>
              <TabsTrigger value="disabled" className="flex items-center gap-2">
                Disabled ({filterUsers('disabled').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <UserTable users={filterUsers('active')} />
            </TabsContent>

            <TabsContent value="disabled">
              <UserTable users={filterUsers('disabled')} />
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
              Send an email to{' '}
              {selectedUser
                ? showPII
                  ? selectedUser.name
                  : maskName(selectedUser.name)
                : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={
                  selectedUser
                    ? showPII
                      ? selectedUser.email
                      : maskEmail(selectedUser.email)
                    : ''
                }
                disabled
              />
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
    </div>
  );
}
