'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type TechItem = {
  name: string;
  color: string;
};

export default function TechStackSection() {
  const [techStack, setTechStack] = useState<TechItem[]>([
    { name: 'HTML 5', color: 'bg-orange-500' },
    { name: 'CSS 3', color: 'bg-blue-500' },
    { name: 'JavaScript', color: 'bg-yellow-400' },
    { name: 'Ruby', color: 'bg-red-500' },
    { name: 'Mixpanel', color: 'bg-purple-600' },
    { name: 'Framer', color: 'bg-black' },
  ]);

  // State for add tech popup
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [newTechName, setNewTechName] = useState('');
  const [newTechColor, setNewTechColor] = useState('bg-gray-500');

  // State for editing tech stack items in the edit dialog
  const [editingTechStack, setEditingTechStack] =
    useState<TechItem[]>(techStack);

  // Sync editingTechStack with techStack when the dialog opens
  const handleOpenEditDialog = () => {
    setEditingTechStack(techStack);
    setIsEditPopupOpen(true);
  };

  // Handle adding a new tech item via popup
  const handleAddTechSubmit = () => {
    if (newTechName.trim()) {
      const newTechStack = [
        ...techStack,
        { name: newTechName.trim(), color: newTechColor },
      ];
      setTechStack(newTechStack);
      setNewTechName('');
      setNewTechColor('bg-gray-500');
      setIsAddPopupOpen(false);
    }
  };

  // Handle deleting a tech item in the Edit dialog
  const handleDeleteTech = (index: number) => {
    setEditingTechStack(editingTechStack.filter((_, i) => i !== index));
  };

  // Handle editing a tech item's name in the Edit dialog
  const handleEditTechName = (index: number, newName: string) => {
    const updatedTechStack = [...editingTechStack];
    updatedTechStack[index] = { ...updatedTechStack[index], name: newName };
    setEditingTechStack(updatedTechStack);
  };

  // Handle saving changes in the Edit dialog
  const handleSaveEdit = () => {
    setTechStack(editingTechStack);
    setIsEditPopupOpen(false);
  };

  return (
    <div className="mb-8">
      {/* Header with Title and Buttons */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-900">Tech Stack</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={() => setIsAddPopupOpen(true)}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={handleOpenEditDialog}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-3 gap-4">
        {techStack.map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`${tech.color} mb-2 flex h-16 w-16 items-center justify-center rounded-lg`}
            >
              <span className="text-sm font-bold text-white">
                {tech.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-700">{tech.name}</span>
          </div>
        ))}
      </div>

      {/* View Tech Stack Link */}
      <div className="mt-2 flex justify-end">
        <Button
          variant="link"
          size="sm"
          className="flex items-center gap-1 p-0 text-indigo-600"
        >
          View tech stack
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Add Tech Popup */}
      <Dialog open={isAddPopupOpen} onOpenChange={setIsAddPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Tech</DialogTitle>
            <DialogDescription>
              Add a new technology to your companys tech stack.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Tech Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tech Name
              </label>
              <input
                type="text"
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., Python"
              />
            </div>

            {/* Tech Color Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <select
                value={newTechColor}
                onChange={(e) => setNewTechColor(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="bg-gray-500">Gray</option>
                <option value="bg-orange-500">Orange</option>
                <option value="bg-blue-500">Blue</option>
                <option value="bg-yellow-400">Yellow</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-purple-600">Purple</option>
                <option value="bg-black">Black</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleAddTechSubmit}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tech Stack Popup (with list, edit, and delete) */}
      <Dialog open={isEditPopupOpen} onOpenChange={setIsEditPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tech Stack</DialogTitle>
            <DialogDescription>
              Edit or delete technologies in your companys tech stack. To add
              new items, use the + button.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tech Stack
            </label>
            <ul className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
              {editingTechStack.map((tech, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2 rounded-md bg-gray-50 p-2"
                >
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => handleEditTechName(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDeleteTech(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
            <p className="mt-1 text-sm text-gray-500">
              Note: To add new items, use the + button.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
