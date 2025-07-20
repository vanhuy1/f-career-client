'use client';

import { Button } from '@/components/ui/button';
import { Save, Sidebar, Plus, Download } from 'lucide-react';
import { Panel } from 'reactflow';

interface RoadmapControlsProps {
  onSave?: () => void;
  onToggleSidebar?: () => void;
  onAddNode?: () => void;
  onExport?: () => void;
  isEditable?: boolean;
}

export default function RoadmapControls({
  onSave,
  onToggleSidebar,
  onAddNode,
  onExport,
  isEditable = false,
}: RoadmapControlsProps) {
  return (
    <Panel position="top-right" className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="border-green-500/30 bg-stone-900/80 text-green-500 hover:bg-green-500/20"
        onClick={onToggleSidebar}
      >
        <Sidebar className="mr-1 h-4 w-4" />
        Overview
      </Button>

      {isEditable && onSave && (
        <Button
          size="sm"
          variant="outline"
          className="border-green-500/30 bg-stone-900/80 text-green-500 hover:bg-green-500/20"
          onClick={onSave}
        >
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
      )}

      {isEditable && onAddNode && (
        <Button
          size="sm"
          variant="outline"
          className="border-green-500/30 bg-stone-900/80 text-green-500 hover:bg-green-500/20"
          onClick={onAddNode}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Node
        </Button>
      )}

      {onExport && (
        <Button
          size="sm"
          variant="outline"
          className="border-green-500/30 bg-stone-900/80 text-green-500 hover:bg-green-500/20"
          onClick={onExport}
        >
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>
      )}
    </Panel>
  );
}
