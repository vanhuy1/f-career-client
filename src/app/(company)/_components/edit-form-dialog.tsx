'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/common/RichTextEditor';

export type FormField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'date' | 'richtext';
  placeholder?: string;
  defaultValue?: string;
};

export type EditFormProps = {
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditFormDialog({
  title,
  description,
  fields,
  onSubmit,
  open,
  onOpenChange,
}: EditFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.defaultValue || '';
    });
    return initialData;
  });

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`grid gap-4 ${field.type === 'richtext' ? 'grid-cols-1' : 'grid-cols-4 items-center'}`}
              >
                <Label
                  htmlFor={field.id}
                  className={
                    field.type === 'richtext' ? 'text-left' : 'text-right'
                  }
                >
                  {field.label}
                </Label>
                {field.type === 'richtext' ? (
                  <div className="w-full">
                    <RichTextEditor
                      content={formData[field.id]}
                      onChange={(content) => handleChange(field.id, content)}
                      placeholder={field.placeholder}
                      minHeight="min-h-[300px]"
                    />
                  </div>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="col-span-3"
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
