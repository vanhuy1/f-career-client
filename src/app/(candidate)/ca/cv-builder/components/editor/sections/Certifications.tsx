'use client';

import { useState } from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { Certification, Cv } from '@/types/Cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

interface CertificationsProps {
  cv: Cv;
  onAddCertification: (certification: Certification) => void;
  onUpdateCertification: (index: number, certification: Certification) => void;
  onDeleteCertification: (index: number) => void;
}

const Certifications = ({
  cv,
  onAddCertification,
  onUpdateCertification,
  onDeleteCertification,
}: CertificationsProps) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [noExpiry, setNoExpiry] = useState(false);
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dateError, setDateError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check all required fields including credentialId
    if (!title || !issuer || !issueDate || !credentialId) {
      toast.error(
        'Please fill in all required fields (including Credential ID)',
      );
      return;
    }

    // Validate dates
    if (!noExpiry && expiryDate && issueDate > expiryDate) {
      setDateError('Expiry date must be after issue date');
      return;
    }

    // Validate URL if provided
    if (credentialUrl && !validateUrl(credentialUrl)) {
      toast.error('Invalid URL format');
      return;
    }

    const certification: Certification = {
      title,
      issuer,
      issueDate: format(issueDate, 'yyyy-MM-dd'),
      expiryDate: noExpiry
        ? 'No Expiry'
        : expiryDate
          ? format(expiryDate, 'yyyy-MM-dd')
          : '',
      credentialId: credentialId, // Now always has a value
      credentialUrl: credentialUrl || undefined,
    };

    if (editIndex !== null) {
      onUpdateCertification(editIndex, certification);
      toast.success('Certification updated successfully');
    } else {
      onAddCertification(certification);
      toast.success('Certification added successfully');
    }

    resetForm();
    setShowEditDialog(false);
  };

  const resetForm = () => {
    setTitle('');
    setIssuer('');
    setIssueDate(undefined);
    setExpiryDate(undefined);
    setNoExpiry(false);
    setCredentialId('');
    setCredentialUrl('');
    setEditIndex(null);
    setDateError('');
  };

  const handleEdit = (cert: Certification, index: number) => {
    setTitle(cert.title);
    setIssuer(cert.issuer);

    // Parse issue date
    if (cert.issueDate) {
      try {
        setIssueDate(new Date(cert.issueDate));
      } catch (error) {
        console.error('Error parsing issue date:', error);
      }
    }

    // Parse expiry date
    if (cert.expiryDate === 'No Expiry') {
      setNoExpiry(true);
      setExpiryDate(undefined);
    } else if (cert.expiryDate) {
      try {
        setExpiryDate(new Date(cert.expiryDate));
        setNoExpiry(false);
      } catch (error) {
        console.error('Error parsing expiry date:', error);
      }
    }

    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteCertification(index);
    setDeleteIndex(null);
    toast.success('Certification deleted successfully');
  };

  const handleCancel = () => {
    resetForm();
    setShowEditDialog(false);
    setDateError('');
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return false;
      }
      // Try adding https://
      try {
        new URL('https://' + url);
        return true;
      } catch {
        return false;
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      title &&
      issuer &&
      issueDate &&
      credentialId && // Required field
      (!credentialUrl || validateUrl(credentialUrl)) &&
      !dateError
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Certifications List */}
      <ScrollArea className="h-[400px] pr-4">
        {cv.certifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Existing Certifications</h3>
            {cv.certifications.map((cert, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{cert.title}</h4>
                      <p className="text-sm text-gray-600">
                        Issued by {cert.issuer}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cert.issueDate} - {cert.expiryDate || 'No Expiry'}
                      </p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-500">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cert, index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteIndex(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Add Button */}
      <Button
        className="w-full"
        onClick={() => {
          setEditIndex(null);
          setShowEditDialog(true);
        }}
      >
        Add New Certification
      </Button>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="max-h-[90vh] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null
                ? 'Edit Certification'
                : 'Add New Certification'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Certification Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                  placeholder="e.g., AWS Certified Developer"
                />
              </div>

              <div>
                <Label htmlFor="issuer">
                  Issuing Organization <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="mt-1"
                  required
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'mt-1 w-full justify-start text-left font-normal',
                          !issueDate && 'text-muted-foreground',
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {issueDate ? format(issueDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={issueDate}
                        onSelect={setIssueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={noExpiry}
                          className={cn(
                            'mt-1 w-full justify-start text-left font-normal',
                            !expiryDate && !noExpiry && 'text-muted-foreground',
                            noExpiry && 'cursor-not-allowed opacity-50',
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {noExpiry
                            ? 'No Expiry'
                            : expiryDate
                              ? format(expiryDate, 'PPP')
                              : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      {!noExpiry && (
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={expiryDate}
                            onSelect={(date) => {
                              setExpiryDate(date);
                              if (date && issueDate && date < issueDate) {
                                setDateError(
                                  'Expiry date must be after issue date',
                                );
                              } else {
                                setDateError('');
                              }
                            }}
                            disabled={(date) =>
                              issueDate ? date < issueDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      )}
                    </Popover>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="noExpiry"
                        checked={noExpiry}
                        onChange={(e) => {
                          setNoExpiry(e.target.checked);
                          if (e.target.checked) {
                            setExpiryDate(undefined);
                            setDateError('');
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="noExpiry" className="text-sm">
                        No expiry date
                      </Label>
                    </div>
                    {dateError && (
                      <p className="text-xs text-red-500">{dateError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="credentialId">
                  Credential ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="credentialId"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className={cn(
                    'mt-1',
                    !credentialId && 'border-red-300', // Highlight when empty
                  )}
                  required
                  placeholder="e.g., AWS-123456 (Required)"
                />
                {!credentialId && (
                  <p className="mt-1 text-xs text-red-500">
                    Please enter the credential ID
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
                <Input
                  id="credentialUrl"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className={cn(
                    'mt-1',
                    credentialUrl &&
                      !validateUrl(credentialUrl) &&
                      'border-red-500',
                  )}
                  placeholder="https://example.com/credential"
                />
                {credentialUrl && !validateUrl(credentialUrl) && (
                  <p className="mt-1 text-xs text-red-500">
                    Please enter a valid URL
                  </p>
                )}
              </div>

              {/* Required fields notice */}
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> Fields marked with
                  <span className="text-red-500"> * </span>
                  are required
                </p>
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={cn(!isFormValid() && 'cursor-not-allowed opacity-50')}
            >
              {editIndex !== null
                ? 'Update Certification'
                : 'Add Certification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={() => setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              certification entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndex !== null && handleDelete(deleteIndex)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Certifications;
