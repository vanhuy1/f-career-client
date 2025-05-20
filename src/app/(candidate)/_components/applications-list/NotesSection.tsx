'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateApplicationNotes } from './utils/api';

interface NotesSectionProps {
  notes?: string;
  applicationId: number;
}

export default function NotesSection({
  notes = '',
  applicationId,
}: NotesSectionProps) {
  const [noteText, setNoteText] = useState(notes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateApplicationNotes({
        applicationId,
        notes: noteText,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Notes</h3>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Notes
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your notes here..."
            className="min-h-[200px]"
          />
        ) : (
          <div className="min-h-[200px] rounded-lg bg-gray-50 p-4">
            {noteText ? (
              <p className="whitespace-pre-wrap">{noteText}</p>
            ) : (
              <p className="text-gray-500 italic">
                No notes added yet. Click &apos;Edit Notes&apos; to add some.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
