'use client';

import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { EducationInput, educationSchema } from '@/schemas/CandidateProfile';

interface Institution {
  name: string;
  country: string;
}

interface EducationFormProps {
  mode: 'add' | 'edit';
  education?: Education;
  onSubmit: (education: Education) => void;
  onCancel?: () => void;
}

const fetchInstitutions = async (query: string): Promise<Institution[]> => {
  const response = await fetch(
    `http://universities.hipolabs.com/search?name=${query}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch institutions');
  }
  return response.json();
};

export function EducationForm({
  mode,
  education,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const dispatch = useDispatch();

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
          description: education.description || '',
        }
      : {
          institution: '',
          degree: '',
          field: '',
          startYear: new Date().getFullYear(),
          endYear: null as number | null,
          currentlyStudying: false,
          description: '',
        };

  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(
    defaultValues.currentlyStudying,
  );
  const [institutionSuggestions, setInstitutionSuggestions] = useState<
    Institution[]
  >([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });

  const handleInstitutionChange = async (query: string) => {
    if (query.length < 2) {
      setInstitutionSuggestions([]);
      return;
    }

    setLoadingInstitutions(true);
    try {
      const suggestions = await fetchInstitutions(query);
      setInstitutionSuggestions(suggestions.slice(0, 4));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutionSuggestions([]);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const debouncedHandleInstitutionChange = debounce(
    handleInstitutionChange,
    300,
  );

  useEffect(() => {
    return () => debouncedHandleInstitutionChange.cancel();
  }, [debouncedHandleInstitutionChange]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

  async function handleSubmit(values: EducationInput) {
    try {
      const educationData = {
        institution: values.institution,
        degree: values.degree,
        field: values.field,
        startYear: values.startYear,
        endYear: values.currentlyStudying ? null : values.endYear,
        description: values.description || '',
      };

      let result: Education;

      if (mode === 'add') {
        const createDto = educationData as CreateEducationDto;
        dispatch(updateCaProfileStart());
        result = await candidateEducationService.CreateEducation(createDto);
        toast.success('Education added successfully');
        dispatch(updateCaProfileSuccess());
      } else {
        const updateDto = {
          id: education!.id,
          ...educationData,
        } as UpdateEducationDto;
        dispatch(updateCaProfileStart());
        result = await candidateEducationService.UpdateEducation(updateDto);
        toast.success('Education updated successfully');
        dispatch(updateCaProfileSuccess());
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
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Institution*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter institution name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedHandleInstitutionChange(e.target.value);
                    }}
                  />
                </FormControl>
                {loadingInstitutions && (
                  <p className="text-sm text-gray-500">Loading...</p>
                )}
                {institutionSuggestions.length > 0 && (
                  <div className="relative mt-1">
                    <ul className="absolute z-50 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                      {institutionSuggestions.map((institution, index) => (
                        <li
                          key={index}
                          className="cursor-pointer border-b p-2.5 text-sm last:border-b-0 hover:bg-gray-100"
                          onClick={() => {
                            form.setValue('institution', institution.name);
                            setInstitutionSuggestions([]);
                          }}
                        >
                          {institution.name} - {institution.country}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                  <RichTextEditor
                    content={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Describe your education, achievements, or activities"
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
                  ? 'Save Education'
                  : 'Update Education'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
