'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { mockUsers, UserDetail } from '@/data/mockUsers';

export default function UsersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Verified
          </Badge>
        );
      case 'unverified':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Unverified
          </Badge>
        );
      case 'banned':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Banned
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filterUsersByStatus = (status: UserDetail['status']) => {
    return mockUsers.filter(
      (user) =>
        user.status === status &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  };

  const handleStatusChange = (
    userId: number,
    newStatus: UserDetail['status'],
  ) => {
    console.log(`Changing status of user ${userId} to ${newStatus}`);
  };

  const handleSendEmail = () => {
    setEmailDialogOpen(false);
  };

  const handleViewProfile = (userId: number) => {
    router.push(`/ad/users/${userId}`);
  };

  const UserTable = ({ users }: { users: UserDetail[] }) => (
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
          <TableHead>
            <Button variant="ghost" className="h-auto p-0 font-semibold">
              Last Active <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
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
                    {user.name}
                  </button>
                  <div className="text-sm text-gray-500">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>@{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.lastActive).toLocaleDateString()}
            </TableCell>
            <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                    onClick={() => handleStatusChange(user.id, 'verified')}
                  >
                    Set as Verified
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(user.id, 'unverified')}
                  >
                    Set as Unverified
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(user.id, 'banned')}
                  >
                    Ban User
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="mt-2 text-gray-600">Review and manage user accounts</p>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              User Accounts
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verified" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="verified" className="flex items-center gap-2">
                Verified ({filterUsersByStatus('verified').length})
              </TabsTrigger>
              <TabsTrigger
                value="unverified"
                className="flex items-center gap-2"
              >
                Unverified ({filterUsersByStatus('unverified').length})
              </TabsTrigger>
              <TabsTrigger value="banned" className="flex items-center gap-2">
                Banned ({filterUsersByStatus('banned').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verified">
              <UserTable users={filterUsersByStatus('verified')} />
            </TabsContent>

            <TabsContent value="unverified">
              <UserTable users={filterUsersByStatus('unverified')} />
            </TabsContent>

            <TabsContent value="banned">
              <UserTable users={filterUsersByStatus('banned')} />
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
              Send an email to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" value={selectedUser?.email || ''} disabled />
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
