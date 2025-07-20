'use client';

import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CustomNodeData {
  label: string;
  description?: string;
  status?: 'completed' | 'in-progress' | 'todo' | 'blocked';
  resources?: { title: string; url: string }[];
}

export default function CustomNode({
  data,
  isConnectable,
}: NodeProps<CustomNodeData>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusIcon = () => {
    switch (data.status) {
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

  const getStatusColor = () => {
    switch (data.status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'in-progress':
        return 'border-blue-500 bg-blue-500/10';
      case 'blocked':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div
      className={cn(
        'min-w-[200px] rounded-md border-2 p-3 shadow-md backdrop-blur-sm',
        getStatusColor(),
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="h-2 w-2 bg-green-500"
      />

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="text-sm font-medium text-white">{data.label}</h3>
        </div>
        <button
          onClick={toggleExpand}
          className="text-gray-400 transition-colors hover:text-white"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2">
          {data.description && (
            <p className="text-xs text-gray-300">{data.description}</p>
          )}

          {data.resources && data.resources.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-200">Resources:</p>
              <ul className="space-y-1">
                {data.resources.map((resource, index) => (
                  <li key={index} className="text-xs">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              data.status === 'completed' &&
                'border-green-500 bg-green-500/20 text-green-300',
              data.status === 'in-progress' &&
                'border-blue-500 bg-blue-500/20 text-blue-300',
              data.status === 'blocked' &&
                'border-red-500 bg-red-500/20 text-red-300',
              data.status === 'todo' &&
                'border-gray-500 bg-gray-500/20 text-gray-300',
            )}
          >
            {data.status || 'todo'}
          </Badge>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="h-2 w-2 bg-green-500"
      />
    </div>
  );
}
