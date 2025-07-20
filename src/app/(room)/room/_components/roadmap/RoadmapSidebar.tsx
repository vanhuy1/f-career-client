'use client';

import { Node } from 'reactflow';
import { X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface RoadmapSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  onNodeClick: (nodeId: string) => void;
}

export default function RoadmapSidebar({
  isOpen,
  onClose,
  nodes,
  onNodeClick,
}: RoadmapSidebarProps) {
  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  const completedNodes = nodes.filter(
    (node) => node.data?.status === 'completed',
  );
  const inProgressNodes = nodes.filter(
    (node) => node.data?.status === 'in-progress',
  );
  const todoNodes = nodes.filter(
    (node) => !node.data?.status || node.data?.status === 'todo',
  );
  const blockedNodes = nodes.filter((node) => node.data?.status === 'blocked');

  return (
    <div className="animate-in slide-in-from-right fixed top-0 right-0 z-50 h-full w-80 border-l border-green-500/30 bg-stone-900/95 shadow-xl backdrop-blur-sm duration-300">
      <div className="flex items-center justify-between border-b border-green-500/30 p-4">
        <h3 className="text-lg font-medium text-green-500">Roadmap Overview</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)] p-4">
        <div className="space-y-6">
          {inProgressNodes.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-blue-500">
                In Progress
              </h4>
              <ul className="space-y-2">
                {inProgressNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      onClick={() => onNodeClick(node.id)}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-blue-500/10"
                    >
                      {getStatusIcon(node.data?.status)}
                      <span className="text-sm text-gray-200">
                        {node.data?.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {todoNodes.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-400">To Do</h4>
              <ul className="space-y-2">
                {todoNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      onClick={() => onNodeClick(node.id)}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-gray-500/10"
                    >
                      {getStatusIcon(node.data?.status)}
                      <span className="text-sm text-gray-300">
                        {node.data?.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {completedNodes.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-green-500">
                Completed
              </h4>
              <ul className="space-y-2">
                {completedNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      onClick={() => onNodeClick(node.id)}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-green-500/10"
                    >
                      {getStatusIcon(node.data?.status)}
                      <span className="text-sm text-gray-300">
                        {node.data?.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blockedNodes.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-red-500">Blocked</h4>
              <ul className="space-y-2">
                {blockedNodes.map((node) => (
                  <li key={node.id}>
                    <button
                      onClick={() => onNodeClick(node.id)}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-red-500/10"
                    >
                      {getStatusIcon(node.data?.status)}
                      <span className="text-sm text-gray-300">
                        {node.data?.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
