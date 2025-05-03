'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const [, forceUpdate] = useState(false); // force re-render for active state updates

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Listen for selection changes to update active formatting states
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      forceUpdate((prev) => !prev);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  // Styles
  const buttonBase = 'h-8 w-8';
  const buttonActive =
    'bg-gray-200 text-black dark:bg-gray-700 dark:text-white';

  return (
    <div className="w-full rounded-md border">
      <EditorContent
        editor={editor}
        className="min-h-[120px] px-3 py-2 focus:outline-none"
      />

      <div className="bg-muted flex items-center justify-between border-t px-3 py-2">
        <div className="flex gap-2">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant="ghost"
            size="icon"
            className={`${buttonBase} ${editor.isActive('bold') ? buttonActive : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant="ghost"
            size="icon"
            className={`${buttonBase} ${editor.isActive('italic') ? buttonActive : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            variant="ghost"
            size="icon"
            className={`${buttonBase} ${editor.isActive('bulletList') ? buttonActive : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().setParagraph().run()}
            variant="ghost"
            size="icon"
            className={`${buttonBase} ${editor.isActive('paragraph') ? buttonActive : ''}`}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          {editor.getText().length} / 500
        </div>
      </div>
    </div>
  );
}
