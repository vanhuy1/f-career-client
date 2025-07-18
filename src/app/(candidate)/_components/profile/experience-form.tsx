'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type {
  CreateExperienceDto,
  Experience,
  UpdateExperienceDto,
} from '@/types/CandidateProfile';
import { ExperienceInput, experienceSchema } from '@/schemas/CandidateProfile';
import { employmentType } from '@/enums/employmentType';
import { candidateExperienceService } from '@/services/api/profile/ca-experiences'; // Adjust path as necessary
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  updateCaProfileFailure,
  updateCaProfileStart,
  updateCaProfileSuccess,
} from '@/services/state/caProfileSlice';

interface ExperienceFormProps {
  mode: 'add' | 'edit';
  experience?: Experience;
  onSubmit: (experience: Experience) => void;
  onCancel?: () => void;
}

export function ExperienceForm({
  mode,
  experience,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const dispatch = useDispatch();

  // Parse string dates to Date objects for the form
  const parseDate = (dateString: string | null) => {
    if (!dateString) return undefined;
    return parse(dateString, 'yyyy-MM-dd', new Date());
  };

  const defaultValues =
    mode === 'edit' && experience
      ? {
          role: experience.role,
          company: experience.company,
          logo: experience.logo || '',
          employmentType: experience.employmentType,
          location: experience.location,
          description: experience.description,
          currentlyWorking: !experience.endDate,
          startDate: parseDate(experience.startDate),
          endDate: parseDate(experience.endDate),
        }
      : {
          role: '',
          company: '',
          logo: '',
          employmentType: '',
          location: '',
          description: '',
          currentlyWorking: false,
          endDate: null as Date | null,
        };

  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(
    defaultValues.currentlyWorking,
  );

  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });

  // Update the isCurrentlyWorking state when the form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'currentlyWorking') {
        setIsCurrentlyWorking(!!value.currentlyWorking);
        if (value.currentlyWorking) {
          form.setValue('endDate', undefined);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function handleSubmit(values: ExperienceInput) {
    try {
      const formattedStartDate = format(values.startDate, 'yyyy-MM-dd');
      const formattedEndDate = values.currentlyWorking
        ? null
        : values.endDate
          ? format(values.endDate, 'yyyy-MM-dd')
          : null;

      const experienceData = {
        role: values.role,
        company: values.company,
        logo: values.logo || '',
        employmentType: values.employmentType,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: values.location,
        description: values.description,
      };

      let result: Experience;

      if (mode === 'add') {
        // Type assertion for CreateExperienceDto (assumes it matches experienceData structure)
        const createDto = experienceData as CreateExperienceDto;
        dispatch(updateCaProfileStart());
        result = await candidateExperienceService.CreateExperience(createDto);
        toast.success('Experience added successfully');
        dispatch(updateCaProfileSuccess());
      } else {
        // Type assertion for UpdateExperienceDto, including the id from the original experience
        const updateDto = {
          id: experience!.id,
          ...experienceData,
        } as UpdateExperienceDto;
        dispatch(updateCaProfileStart());
        result = await candidateExperienceService.UpdateExperience(updateDto);
        dispatch(updateCaProfileSuccess());
        toast.success('Experience updated successfully');
      }

      onSubmit(result);
    } catch (error) {
      toast.error(error as string);
      dispatch(updateCaProfileFailure(error as string));
    }
  }

  return (
    <div
      className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{
        scrollbarWidth: 'none' /* Firefox */,
        msOverflowStyle: 'none' /* Internet Explorer 10+ */,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role/Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(employmentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter a URL for the company logo (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company*</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date*</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy-MM-dd')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel
                      className={
                        isCurrentlyWorking ? 'text-muted-foreground' : ''
                      }
                    >
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                              isCurrentlyWorking &&
                                'cursor-not-allowed opacity-50',
                            )}
                            disabled={isCurrentlyWorking}
                          >
                            {field.value ? (
                              format(field.value, 'yyyy-MM-dd')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={isCurrentlyWorking}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="currentlyWorking"
                  checked={isCurrentlyWorking}
                  onCheckedChange={(checked) => {
                    setIsCurrentlyWorking(!!checked);
                    form.setValue('currentlyWorking', !!checked);
                    if (checked) {
                      form.setValue('endDate', null);
                    }
                  }}
                />
                <label
                  htmlFor="currentlyWorking"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location*</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Describe your responsibilities and achievements"
                    minHeight="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Saving...'
                : mode === 'add'
                  ? 'Save Experience'
                  : 'Update Experience'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
