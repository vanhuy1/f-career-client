'use client';

import { StepProps } from '@/types/Job';
import RichTextEditor from './RichTextEditor';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

const RequiredIndicator = () => <span className="ml-1 text-red-500">*</span>;

export default function Step2({
  jobDescription,
  setJobDescription,
  responsibilities,
  setResponsibilities,
  whoYouAre,
  setWhoYouAre,
  niceToHaves,
  setNiceToHaves,
}: StepProps) {
  // Chuyển đổi chuỗi thành mảng
  const [responsibilityList, setResponsibilityList] = useState<string[]>(
    responsibilities
      ? responsibilities.split('\n').filter((item) => item.trim() !== '')
      : [''],
  );
  const [whoYouAreList, setWhoYouAreList] = useState<string[]>(
    whoYouAre
      ? whoYouAre.split('\n').filter((item) => item.trim() !== '')
      : [''],
  );
  const [niceToHavesList, setNiceToHavesList] = useState<string[]>(
    niceToHaves
      ? niceToHaves.split('\n').filter((item) => item.trim() !== '')
      : [''],
  );

  // Cập nhật state cha khi danh sách thay đổi
  useEffect(() => {
    setResponsibilities(
      responsibilityList.filter((item) => item.trim() !== '').join('\n'),
    );
  }, [responsibilityList, setResponsibilities]);

  useEffect(() => {
    setWhoYouAre(whoYouAreList.filter((item) => item.trim() !== '').join('\n'));
  }, [whoYouAreList, setWhoYouAre]);

  useEffect(() => {
    setNiceToHaves(
      niceToHavesList.filter((item) => item.trim() !== '').join('\n'),
    );
  }, [niceToHavesList, setNiceToHaves]);

  const handleAddItem = (list: string[], setList: (list: string[]) => void) => {
    setList([...list, '']);
  };

  const handleRemoveItem = (
    index: number,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    if (list.length > 1) {
      const newList = [...list];
      newList.splice(index, 1);
      setList(newList);
    }
  };

  const handleItemChange = (
    index: number,
    value: string,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const renderInputList = (
    title: string,
    description: string,
    list: string[],
    setList: (list: string[]) => void,
  ) => (
    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="w-full space-y-4 md:col-span-2">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleItemChange(index, e.target.value, list, setList)
              }
              placeholder={`Enter ${title.toLowerCase()} item`}
            />
            {list.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index, list, setList)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => handleAddItem(list, setList)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add More
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="mb-1 text-lg font-medium">Details</h2>
      <p className="mb-4 text-sm text-gray-500">
        Add the description of the job, responsibilities, who you are, and
        nice-to-haves.
      </p>

      <div className="space-y-8 divide-y divide-gray-100">
        {/* Job Description */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">
              Job Description
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Describe the role in detail
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <RichTextEditor
              content={jobDescription}
              onChange={(content) => {
                // Loại bỏ thẻ <p> nếu có
                const cleanContent = content.replace(/<\/?p>/g, '');
                setJobDescription(cleanContent);
              }}
            />
          </div>
        </div>

        {/* Responsibilities */}
        {renderInputList(
          'Responsibilities',
          'List the main duties',
          responsibilityList,
          setResponsibilityList,
        )}

        {/* Who You Are */}
        {renderInputList(
          'Who You Are',
          'Describe the ideal candidate',
          whoYouAreList,
          setWhoYouAreList,
        )}

        {/* Nice-To-Haves */}
        {renderInputList(
          'Nice-To-Haves',
          'Optional but useful skills',
          niceToHavesList,
          setNiceToHavesList,
        )}
      </div>
    </div>
  );
}
