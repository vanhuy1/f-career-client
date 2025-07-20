'use client';

import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import {
  Briefcase,
  Book,
  Code,
  Server,
  Cloud,
  Users,
  School,
  Building2,
  LineChart,
  CheckCircle2,
  Clock,
  AlertCircle,
  MousePointer,
  Route,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  briefcase: Briefcase,
  book: Book,
  code: Code,
  server: Server,
  cloud: Cloud,
  users: Users,
  school: School,
  building: Building2,
  chart: LineChart,
  checkCircle: CheckCircle2,
  clock: Clock,
  route: Route,
  default: Book,
};

interface MindMapNodeProps {
  data: {
    label: string;
    icon?: string;
    description?: string;
    status?: 'completed' | 'in-progress' | 'todo' | 'blocked';
    tasks?: {
      id: string;
      title: string;
      completed: boolean;
      description?: string;
      skillTitle?: string;
    }[];
    isHighlighted?: boolean;
    isMainNode?: boolean;
    isSkillNode?: boolean;
    skillTitle?: string;
    progress?: number;
    order?: number;
  };
  isConnectable: boolean;
}

function MindMapNode({ data, isConnectable }: MindMapNodeProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(data.isMainNode || false);

  const IconComponent =
    data.icon && icons[data.icon as keyof typeof icons]
      ? icons[data.icon as keyof typeof icons]
      : icons.default;

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

  const getNodeColor = () => {
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

  const completedTasks = data.tasks?.filter((t) => t.completed).length || 0;
  const totalTasks = data.tasks?.length || 0;
  const progress =
    data.progress !== undefined
      ? data.progress
      : totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

  return (
    <div
      className={cn(
        'group relative cursor-pointer rounded-lg border-2 px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-300',
        getNodeColor(),
        data.isHighlighted && 'scale-110 shadow-xl',
        data.isMainNode && 'border-green-400 bg-green-500/20',
        data.isSkillNode && 'border-blue-400 bg-blue-500/10',
        hovered ? 'scale-105 shadow-xl' : '',
      )}
      style={{ width: data.isMainNode ? 280 : 300 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      {hovered && (
        <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 transform items-center gap-1 rounded bg-stone-800/90 px-2 py-1 text-xs whitespace-nowrap text-white">
          <MousePointer className="h-3 w-3" />
          <span>Click to view details</span>
        </div>
      )}

      {data.isSkillNode && (
        <div className="absolute top-1/2 -left-8 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
          {data.order}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!-top-1.5 !h-3 !w-3 !border-2 !border-white !bg-green-500"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'rounded-lg p-1.5',
              data.isMainNode
                ? 'bg-green-200'
                : data.isSkillNode
                  ? 'bg-blue-200'
                  : 'bg-green-100',
            )}
          >
            <IconComponent
              className={cn(
                'h-4 w-4',
                data.isMainNode
                  ? 'text-green-700'
                  : data.isSkillNode
                    ? 'text-blue-700'
                    : 'text-green-600',
              )}
            />
          </div>
          <h2
            className={cn(
              'text-sm font-semibold text-white',
              data.isMainNode && 'text-base',
            )}
          >
            {data.label}
          </h2>
          <div className="ml-auto flex items-center gap-1">
            {getStatusIcon()}
          </div>
        </div>

        {data.isSkillNode && (
          <div className="mt-1">
            <div className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-stone-700">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 text-xs text-blue-300">
              {completedTasks}/{totalTasks} tasks completed
            </div>
          </div>
        )}

        {data.isMainNode && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-300">
            <Route className="h-3 w-3" />
            <span>Click on steps below to see details</span>
          </div>
        )}

        {data.isMainNode && (
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 transform text-green-400">
            <ArrowDown className="h-5 w-5" />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!-bottom-1.5 !h-3 !w-3 !border-2 !border-white !bg-green-500"
      />
    </div>
  );
}

export default memo(MindMapNode);
