'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !issueDate) return;

    const certification = {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
    };

    if (editIndex !== null) {
      onUpdateCertification(editIndex, certification);
      setEditIndex(null);
    } else {
      onAddCertification(certification);
    }

    setTitle('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setCredentialId('');
    setCredentialUrl('');
    setShowEditDialog(false);
  };

  const handleEdit = (cert: Certification, index: number) => {
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate);
    setExpiryDate(cert.expiryDate || '');
    setCredentialId(cert.credentialId || '');
    setCredentialUrl(cert.credentialUrl || '');
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteCertification(index);
    setDeleteIndex(null);
  };

  const handleCancel = () => {
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setCredentialId('');
    setCredentialUrl('');
    setEditIndex(null);
    setShowEditDialog(false);
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
                <Label htmlFor="title">Certification Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="mt-1"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>

              <div>
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input
                  id="credentialUrl"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="mt-1"
                  placeholder="Optional"
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
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
