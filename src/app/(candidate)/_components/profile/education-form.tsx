'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  Education,
  CreateEducationDto,
  UpdateEducationDto,
} from '@/types/CandidateProfile';
import { candidateEducationService } from '@/services/api/profile/ca-educations';
import {
  updateCaProfileFailure,
  updateCaProfileStart,
  updateCaProfileSuccess,
} from '@/services/state/caProfileSlice';

// Update the education schema to use numbers for years and make currentlyStudying required
const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startYear: z.number().min(1900, 'Start year is required'),
  endYear: z.number().nullable(),
  currentlyStudying: z.boolean(),
  logo: z.string().optional(),
  description: z.string().optional(),
});

type EducationInput = z.infer<typeof educationSchema>;

interface EducationFormProps {
  mode: 'add' | 'edit';
  education?: Education;
  onSubmit: (education: Education) => void;
  onCancel?: () => void;
}

export function EducationForm({
  mode,
  education,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const dispatch = useDispatch();

  // Update the defaultValues to use numbers for years
  const defaultValues =
    mode === 'edit' && education
      ? {
          institution: education.institution,
          degree: education.degree,
          field: education.field,
          startYear:
            typeof education.startYear === 'string'
              ? Number.parseInt(education.startYear)
              : education.startYear,
          endYear: education.endYear
            ? typeof education.endYear === 'string'
              ? Number.parseInt(education.endYear)
              : education.endYear
            : null,
          currentlyStudying: !education.endYear,
          logo: education.logo || '',
          description: education.description || '',
        }
      : {
          institution: '',
          degree: '',
          field: '',
          startYear: new Date().getFullYear(),
          endYear: null as number | null,
          currentlyStudying: false,
          logo: '',
          description: '',
        };

  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(
    defaultValues.currentlyStudying,
  );

  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });

  // Update the isCurrentlyStudying state when the form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'currentlyStudying') {
        setIsCurrentlyStudying(!!value.currentlyStudying);
        if (value.currentlyStudying) {
          form.setValue('endYear', null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Update the handleSubmit function to use the API
  async function handleSubmit(values: EducationInput) {
    try {
      const educationData = {
        institution: values.institution,
        degree: values.degree,
        field: values.field,
        startYear: values.startYear,
        endYear: values.currentlyStudying ? null : values.endYear,
        logo: values.logo || '',
        description: values.description || '',
      };

      let result: Education;

      if (mode === 'add') {
        // Type assertion for CreateEducationDto
        const createDto = educationData as CreateEducationDto;
        dispatch(updateCaProfileStart());
        result = await candidateEducationService.CreateEducation(createDto);
        dispatch(updateCaProfileSuccess());
      } else {
        // Type assertion for UpdateEducationDto, including the id from the original education
        const updateDto = {
          id: education!.id,
          ...educationData,
        } as UpdateEducationDto;
        dispatch(updateCaProfileStart());
        result = await candidateEducationService.UpdateEducation(updateDto);
        dispatch(updateCaProfileSuccess());
      }

      onSubmit(result);
    } catch (error) {
      toast.error(error as string);
      dispatch(updateCaProfileFailure(error as string));
    }
  }

  // Update the years array to use numbers
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution*</FormLabel>
              <FormControl>
                <Input placeholder="University of California" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bachelors">Bachelor&aposs</SelectItem>
                    <SelectItem value="Master's">Master&aposs</SelectItem>
                    <SelectItem value="Ph.D">Ph.D</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field of Study*</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
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
              <FormLabel>Institution Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>
                Enter a URL for the institution logo (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startYear"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Year*</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(Number.parseInt(value))
                  }
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel
                    className={
                      isCurrentlyStudying ? 'text-muted-foreground' : ''
                    }
                  >
                    End Year
                  </FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                    defaultValue={field.value?.toString()}
                    disabled={isCurrentlyStudying}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={
                          isCurrentlyStudying
                            ? 'w-full cursor-not-allowed opacity-50'
                            : 'w-full'
                        }
                      >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentlyStudying"
                checked={isCurrentlyStudying}
                onCheckedChange={(checked) => {
                  setIsCurrentlyStudying(!!checked);
                  form.setValue('currentlyStudying', !!checked);
                  if (checked) {
                    form.setValue('endYear', null);
                  }
                }}
              />
              <label
                htmlFor="currentlyStudying"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I am currently studying here
              </label>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your education, achievements, or activities"
                  className="min-h-[120px]"
                  {...field}
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
                ? 'Save Education'
                : 'Update Education'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
