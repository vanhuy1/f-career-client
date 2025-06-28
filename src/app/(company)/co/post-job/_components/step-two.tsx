'use client';

import { StepProps } from '@/types/Job';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  X,
  Heart,
  Waves,
  Video,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Simplified Tiptap Editor toolbar components
const MenuBar = ({
  editor,
  toggleBulletList,
  toggleOrderedList,
}: {
  editor: Editor | null;
  toggleBulletList: () => void;
  toggleOrderedList: () => void;
}) => {
  if (!editor) {
    return null;
  }

  const handleBulletList = () => {
    toggleBulletList();
  };

  const handleOrderedList = () => {
    toggleOrderedList();
  };

  return (
    <div className="flex flex-wrap gap-1 rounded-t-md border-b border-gray-200 bg-gray-50 p-2">
      <div className="mr-2 flex gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-6 w-px bg-gray-300"></div>

      <div className="mr-2 flex gap-1">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-6 w-px bg-gray-300"></div>

      <div className="mr-2 flex gap-1">
        <button
          onClick={handleBulletList}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={handleOrderedList}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
          title="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-1 h-6 w-px bg-gray-300"></div>

      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`rounded p-1.5 hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const TiptapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Link.configure({ openOnClick: false }),
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  // Handle bullet list command
  const toggleBulletList = () => {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  };

  // Handle ordered list command
  const toggleOrderedList = () => {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  };

  // Update editor content when content prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  return (
    <div className="rounded-md border">
      <MenuBar
        editor={editor}
        toggleBulletList={toggleBulletList}
        toggleOrderedList={toggleOrderedList}
      />
      <EditorContent
        editor={editor}
        className="prose prose-sm tiptap-editor-content min-h-[200px] max-w-none p-4"
      />
    </div>
  );
};

const RequiredIndicator = () => <span className="ml-1 text-red-500">*</span>;

const benefitIcons = {
  healthcare: <Heart className="h-6 w-6" />,
  vacation: <Waves className="h-6 w-6" />,
  development: <Video className="h-6 w-6" />,
};

const defaultBenefits = [
  {
    id: 1,
    title: 'Health Insurance',
    description: 'Comprehensive health coverage for you and your family',
    icon: 'healthcare',
  },
  {
    id: 2,
    title: 'Paid Time Off',
    description: '20 days of paid vacation and holidays per year',
    icon: 'vacation',
  },
  {
    id: 3,
    title: 'Learning & Development',
    description: 'Access to courses, workshops, and conferences',
    icon: 'development',
  },
  {
    id: 4,
    title: 'Flexible Work Hours',
    description: 'Work-life balance with flexible scheduling options',
    icon: 'vacation',
  },
  {
    id: 5,
    title: 'Professional Growth',
    description: 'Clear career path and growth opportunities',
    icon: 'development',
  },
];

export default function Step2({
  jobDescription,
  setJobDescription,
  benefits = [],
  setBenefits,
}: StepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    title: '',
    description: '',
    icon: 'healthcare',
  });

  // Initialize default benefits if none exist
  useEffect(() => {
    if (benefits.length === 0 && setBenefits) {
      setBenefits(defaultBenefits);
    }
  }, [benefits.length, setBenefits]);

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

  const handleAddBenefit = () => {
    if (setBenefits && newBenefit.title && newBenefit.description) {
      const newBenefitWithId = {
        ...newBenefit,
        id: Date.now(),
      };

      setBenefits([...benefits, newBenefitWithId]);
      setNewBenefit({
        title: '',
        description: '',
        icon: 'healthcare',
      });
      setIsDialogOpen(false);
    }
  };

  const handleRemoveBenefit = (id: number) => {
    if (setBenefits) {
      setBenefits(benefits.filter((benefit) => benefit.id !== id));
    }
  };

  // This function is not used but kept for future reference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <TiptapEditor
              content={jobDescription}
              onChange={setJobDescription}
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div>
              <h3 className="font-medium">Perks and Benefits</h3>
              <p className="mt-1 text-sm text-gray-500">
                Encourage more people to apply by sharing the attractive rewards
                and benefits you offer
              </p>
            </div>
            <div className="col-span-2">
              <div className="mb-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex w-full items-center gap-1 border-indigo-600 text-indigo-600 md:w-auto"
                    >
                      <Plus className="h-4 w-4" /> Add Benefit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Benefit</DialogTitle>
                      <DialogDescription>
                        Add a new benefit to attract potential candidates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="icon" className="text-sm font-medium">
                          Benefit Type
                        </label>
                        <Select
                          value={newBenefit.icon}
                          onValueChange={(value) =>
                            setNewBenefit({ ...newBenefit, icon: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select benefit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="vacation">Vacation</SelectItem>
                            <SelectItem value="development">
                              Skill Development
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          value={newBenefit.title}
                          onChange={(e) =>
                            setNewBenefit({
                              ...newBenefit,
                              title: e.target.value,
                            })
                          }
                          placeholder="e.g. Full Healthcare"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id="description"
                          value={newBenefit.description}
                          onChange={(e) =>
                            setNewBenefit({
                              ...newBenefit,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the benefit"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddBenefit}>Add Benefit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.length > 0 ? (
                  benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="relative rounded-md border p-4"
                    >
                      <button
                        onClick={() => handleRemoveBenefit(benefit.id)}
                        className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md text-indigo-600">
                          {benefit.icon === 'healthcare' &&
                            benefitIcons.healthcare}
                          {benefit.icon === 'vacation' && benefitIcons.vacation}
                          {benefit.icon === 'development' &&
                            benefitIcons.development}
                        </div>
                        <div>
                          <h4 className="font-medium">{benefit.title}</h4>
                          <p className="text-sm text-gray-500">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No benefits added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
