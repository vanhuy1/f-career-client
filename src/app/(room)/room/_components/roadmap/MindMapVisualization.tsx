'use client';

import { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MindMapNode from './MindMapNode';
import { X, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RoadmapSkill, RoadmapTask } from '@/types/RoadMap';

interface MindMapVisualizationProps {
  skill: RoadmapSkill;
  onClose: () => void;
  onToggleTask?: (taskId: string) => void;
}

interface MindMapNodeData {
  label: string;
  description?: string;
  status: 'completed' | 'in-progress' | 'todo' | 'blocked';
  tasks: RoadmapTask[];
  isHighlighted?: boolean;
  icon: string;
  isMainNode?: boolean;
  isSkillNode?: boolean;
  progress: number;
  skillId?: string;
}

const nodeTypes = {
  custom: MindMapNode,
};

export default function MindMapVisualization({
  skill,
  onClose,
  onToggleTask,
}: MindMapVisualizationProps) {
  // Since RoadmapSkill no longer has a skills array, we treat all tasks as part of a single group
  const hasTasks = skill.tasks && skill.tasks.length > 0;

  // Create a single skill object for the main skill
  const orderedSkills: RoadmapSkill[] = hasTasks
    ? [
        {
          id: skill.id,
          title: skill.title,
          description: skill.description,
          progress: skill.progress,
          tasks: skill.tasks,
          test: skill.test,
        },
      ]
    : [];

  // Generate nodes for visualization - single node for the skill
  const initialNodes: Node[] = [
    {
      id: 'center',
      type: 'custom',
      position: { x: 400, y: 100 },
      data: {
        label: skill.title,
        description: skill.description,
        status:
          skill.progress === 100
            ? 'completed'
            : skill.progress > 0
              ? 'in-progress'
              : 'todo',
        tasks: skill.tasks,
        isHighlighted: true,
        icon: 'route',
        isMainNode: true,
      },
    },
    ...orderedSkills.map((skillItem, index) => ({
      id: `skill-${index}`,
      type: 'custom',
      position: { x: 400, y: 250 + index * 150 },
      data: {
        label: skillItem.title,
        description:
          skillItem.description || `Step ${index + 1} of your learning journey`,
        status:
          skillItem.progress === 100
            ? 'completed'
            : skillItem.progress > 0
              ? 'in-progress'
              : 'todo',
        tasks: skillItem.tasks,
        icon: 'briefcase',
        isSkillNode: true,
        progress: skillItem.progress,
        order: index + 1,
        skillId: skillItem.id,
      },
    })),
  ];

  // Generate edges (only one edge if there's a skill node)
  const initialEdges: Edge[] = hasTasks
    ? [
        {
          id: 'edge-center-skill-0',
          source: 'center',
          target: 'skill-0',
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 2 },
        },
      ]
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, _, onEdgesChange] = useEdgesState(initialEdges);
  const [skillDetails, setSkillDetails] = useState<RoadmapSkill | null>(null);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    if (node.data.isSkillNode) {
      setSkillDetails({
        id: node.data.skillId,
        title: node.data.label,
        description: node.data.description,
        tasks: node.data.tasks,
        progress: node.data.progress,
      });
    } else if (node.data.isMainNode) {
      setSkillDetails(null);
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!onToggleTask) return;
    onToggleTask(taskId);

    // Update skillDetails state
    if (skillDetails) {
      const updatedTasks = skillDetails.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress =
        updatedTasks.length > 0
          ? Math.round((completedCount / updatedTasks.length) * 100)
          : 0;

      setSkillDetails({
        ...skillDetails,
        tasks: updatedTasks,
        progress,
      });
    }

    // Update nodes state
    setNodes(
      nodes.map((node: Node<MindMapNodeData>) => {
        if (node.data.isSkillNode || node.id === 'center') {
          const updatedTasks: RoadmapTask[] = node.data.tasks.map(
            (t: RoadmapTask) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t,
          );
          const completedCount: number = updatedTasks.filter(
            (t: RoadmapTask) => t.completed,
          ).length;
          const progress: number =
            updatedTasks.length > 0
              ? Math.round((completedCount / updatedTasks.length) * 100)
              : 0;

          return {
            ...node,
            data: {
              ...node.data,
              tasks: updatedTasks,
              progress,
              status:
                progress === 100
                  ? 'completed'
                  : progress > 0
                    ? 'in-progress'
                    : 'todo',
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex h-[90vh] w-[95vw] overflow-hidden rounded-lg border border-green-500/30 bg-stone-900/95">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-stone-700/50 p-4">
            <h2 className="flex items-center gap-2 text-lg font-medium text-white">
              <Route className="h-5 w-5 text-green-500" />
              {skill.title} - Learning Path
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-stone-400 hover:bg-stone-700/50 hover:text-white"
              aria-label="Close visualization"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                attributionPosition="bottom-right"
                className="bg-stone-900"
                minZoom={0.5}
                maxZoom={1.5}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              >
                <Background color="#22c55e" gap={16} size={1} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    switch (node.data?.status) {
                      case 'completed':
                        return '#22c55e';
                      case 'in-progress':
                        return '#3b82f6';
                      case 'blocked':
                        return '#ef4444';
                      default:
                        return '#6b7280';
                    }
                  }}
                  maskColor="rgba(0, 0, 0, 0.5)"
                />
                <div className="absolute top-4 left-4 rounded-md border border-stone-700 bg-stone-800/80 p-3 backdrop-blur-sm">
                  <h3 className="mb-2 text-sm font-medium text-green-400">
                    Learning Path Progress
                  </h3>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-full rounded-full bg-stone-700">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-300"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap text-stone-400">
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="text-xs text-stone-300">
                    <span className="font-medium">Tasks: </span>
                    <span>
                      {skill.tasks.filter((t) => t.completed).length}/
                      {skill.tasks.length} completed
                    </span>
                  </div>
                </div>
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>

        {skillDetails && (
          <div className="w-1/3 overflow-y-auto border-l border-stone-700/50 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge className="border-green-500 bg-green-500/20 text-green-300">
                Skill
              </Badge>
              <h3 className="text-xl font-medium text-green-500">
                {skillDetails.title}
              </h3>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-full rounded-full bg-stone-700">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${skillDetails.progress || 0}%` }}
                />
              </div>
              <span className="text-xs whitespace-nowrap text-stone-400">
                {skillDetails.progress || 0}%
              </span>
            </div>

            {skillDetails.description && (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-stone-300">
                  Description
                </h4>
                <p className="text-stone-400">{skillDetails.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="mb-2 text-sm font-medium text-stone-300">Tasks</h4>
              <div className="space-y-2">
                {skillDetails.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2 rounded-md bg-stone-800/50 p-2"
                  >
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'}`}
                    ></div>
                    <div className="flex-1">
                      <h5
                        className={cn(
                          'text-sm font-medium',
                          task.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-200',
                        )}
                      >
                        {task.title}
                      </h5>
                      {task.description && (
                        <p className="mt-1 text-xs text-stone-400">
                          {task.description}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'mt-2 h-7 px-2 text-xs',
                          task.completed ? 'text-stone-400' : 'text-green-400',
                        )}
                        onClick={() => handleToggleTask(task.id)}
                      >
                        {task.completed
                          ? 'Mark as Incomplete'
                          : 'Mark as Complete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
