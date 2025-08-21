import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { jobService } from '@/services/api/jobs/job-api';
import type { Job } from '@/types/Job';

const schema = z.object({
  status: z.enum(['OPEN', 'CLOSED'] as const),
  deadline: z.string().min(1, 'Deadline is required'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditJobStatusDeadlineDialog({
  job,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: job.status as 'OPEN' | 'CLOSED',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
    },
  });

  const createdAt = new Date(job.createdAt || new Date());
  createdAt.setHours(0, 0, 0, 0);
  const minDate = new Date(createdAt);
  minDate.setDate(minDate.getDate() + 7);
  const maxDate = new Date(createdAt);
  maxDate.setDate(maxDate.getDate() + 30);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const newDeadline = new Date(data.deadline);
      newDeadline.setHours(0, 0, 0, 0);

      // Constrains: createdAt+7 <= deadline <= createdAt+30
      if (newDeadline < minDate || newDeadline > maxDate) {
        toast.error('Deadline must be between 7 and 30 days from job creation');
        return;
      }

      await jobService.update(job.id!, {
        status: data.status,
        deadline: newDeadline.toISOString(),
      } as Job);

      toast.success('Status/Deadline updated');
      onSuccess();
      onClose();
      reset();
    } catch (e) {
      toast.error('Failed to update');
      console.error('Error updating job status/deadline:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selected = watch('deadline');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Status & Deadline</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Status</Label>
            <input type="hidden" {...register('status')} />
            <Select
              value={watch('status')}
              onValueChange={(v) => setValue('status', v as 'OPEN' | 'CLOSED')}
            >
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <Label>Application Deadline</Label>
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selected && 'text-muted-foreground',
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selected
                      ? format(new Date(selected), 'PPP')
                      : 'Select deadline date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selected ? new Date(selected) : undefined}
                    onSelect={(date) => {
                      if (!date) return;
                      date.setHours(0, 0, 0, 0);
                      if (date < minDate || date > maxDate) {
                        toast.error(
                          'Deadline must be between 7 and 30 days from job creation',
                        );
                        return;
                      }
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      setValue('deadline', `${y}-${m}-${d}`);
                    }}
                    disabled={(date) => {
                      const d = new Date(date);
                      d.setHours(0, 0, 0, 0);
                      return d < minDate || d > maxDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">
                {errors.deadline.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Allowed range: {format(minDate, 'PPP')} - {format(maxDate, 'PPP')}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
