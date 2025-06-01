'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Link, Download } from 'lucide-react';
import type { ApplicationDocument } from '@/types/Application';

interface DocumentsSectionProps {
  documents: ApplicationDocument[];
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'cover_letter':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'portfolio':
        return <Link className="h-5 w-5 text-purple-500" />;
      case 'assessment':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'resume':
        return 'Resume';
      case 'cover_letter':
        return 'Cover Letter';
      case 'portfolio':
        return 'Portfolio';
      case 'reference':
        return 'Reference';
      case 'assessment':
        return 'Assessment';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Documents</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Document
          </Button>
        </div>

        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                {getDocumentIcon(document.type)}
                <div>
                  <h4 className="font-medium">{document.name}</h4>
                  <p className="text-sm text-gray-500">
                    {getDocumentTypeName(document.type)}
                    {document.version && ` • Version ${document.version}`}
                    {` • ${new Date(document.dateUploaded).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              {document.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {document.type === 'portfolio' ? (
                      <Link className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </a>
                </Button>
              )}
            </div>
          ))}

          {documents.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No documents added yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
