'use client';

import { useState, useMemo } from 'react';
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
  ConnectionMode,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MindMapNode from './MindMapNode';
import { X, Route, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RoadmapSkill } from '@/types/RoadMap';

interface MindMapVisualizationProps {
  skill: RoadmapSkill & {
    skills?: RoadmapSkill[]; // For full roadmap view
  };
  onClose: () => void;
  onToggleTask?: (taskId: string) => void;
}

const nodeTypes = {
  custom: MindMapNode,
};

// Enhanced color scheme
const colorScheme = {
  gradient: {
    from: '#10b981', // emerald-500
    to: '#06b6d4', // cyan-500
  },
  nodes: {
    main: {
      bg: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20',
      border: 'border-emerald-400',
      text: 'text-emerald-400',
    },
    skill: {
      bg: 'bg-gradient-to-br from-blue-500/15 to-purple-500/15',
      border: 'border-blue-400',
      text: 'text-blue-400',
    },
    completed: {
      bg: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      border: 'border-green-400',
      text: 'text-green-400',
    },
    inProgress: {
      bg: 'bg-gradient-to-br from-yellow-500/15 to-orange-500/15',
      border: 'border-yellow-400',
      text: 'text-yellow-400',
    },
    todo: {
      bg: 'bg-gradient-to-br from-gray-500/10 to-slate-500/10',
      border: 'border-gray-500',
      text: 'text-gray-400',
    },
  },
  edges: {
    completed: '#10b981',
    inProgress: '#f59e0b',
    todo: '#6b7280',
    animated: '#06b6d4',
  },
};

export default function MindMapVisualization({
  skill,
  onClose,
  onToggleTask,
}: MindMapVisualizationProps) {
  const [selectedSkill, setSelectedSkill] = useState<RoadmapSkill | null>(null);
  const [viewMode, setViewMode] = useState<'vertical' | 'tree' | 'radial'>(
    'vertical',
  );

  // Check if this is a roadmap view (has skills array)
  const isRoadmapView = 'skills' in skill && Array.isArray(skill.skills);

  // Memoize skills to avoid dependency issues
  const skills = useMemo(() => {
    return isRoadmapView && skill.skills ? skill.skills : [skill];
  }, [isRoadmapView, skill]);

  // Generate nodes with enhanced layout
  const generateNodes = useMemo(() => {
    const nodes: Node[] = [];

    if (viewMode === 'tree') {
      // Tree layout (horizontal)
      nodes.push({
        id: 'center',
        type: 'custom',
        position: { x: 50, y: 300 },
        data: {
          label: skill.title,
          description: skill.description,
          status:
            (skill.progress || 0) === 100
              ? 'completed'
              : (skill.progress || 0) > 0
                ? 'in-progress'
                : 'todo',
          tasks: skill.tasks,
          isHighlighted: true,
          icon: 'route',
          isMainNode: true,
          progress: skill.progress,
        },
      });

      // Position skills in a tree structure
      skills.forEach((skillItem, index) => {
        const row = index % 3;
        const col = Math.floor(index / 3);
        nodes.push({
          id: `skill-${index}`,
          type: 'custom',
          position: {
            x: 400 + col * 350,
            y: 150 + row * 200,
          },
          data: {
            label: skillItem.title,
            description: skillItem.description,
            status:
              (skillItem.progress || 0) === 100
                ? 'completed'
                : (skillItem.progress || 0) > 0
                  ? 'in-progress'
                  : 'todo',
            tasks: skillItem.tasks,
            icon: 'briefcase',
            isSkillNode: true,
            progress: skillItem.progress,
            order: skillItem.order || index + 1,
            skillId: skillItem.id,
          },
        });
      });
    } else if (viewMode === 'vertical') {
      // Vertical layout
      nodes.push({
        id: 'center',
        type: 'custom',
        position: { x: 400, y: 50 },
        data: {
          label: skill.title,
          description: skill.description,
          status:
            (skill.progress || 0) === 100
              ? 'completed'
              : (skill.progress || 0) > 0
                ? 'in-progress'
                : 'todo',
          tasks: skill.tasks,
          isHighlighted: true,
          icon: 'route',
          isMainNode: true,
          progress: skill.progress || 0,
        },
      });

      skills.forEach((skillItem, index) => {
        nodes.push({
          id: `skill-${index}`,
          type: 'custom',
          position: { x: 400, y: 200 + index * 120 },
          data: {
            label: skillItem.title,
            description: skillItem.description,
            status:
              (skillItem.progress || 0) === 100
                ? 'completed'
                : (skillItem.progress || 0) > 0
                  ? 'in-progress'
                  : 'todo',
            tasks: skillItem.tasks,
            icon: 'briefcase',
            isSkillNode: true,
            progress: skillItem.progress || 0,
            order: skillItem.order || index + 1,
            skillId: skillItem.id,
          },
        });
      });
    } else {
      // Radial layout
      const centerX = 500;
      const centerY = 400;
      const radius = 250;

      nodes.push({
        id: 'center',
        type: 'custom',
        position: { x: centerX - 140, y: centerY - 40 },
        data: {
          label: skill.title,
          description: skill.description,
          status:
            (skill.progress || 0) === 100
              ? 'completed'
              : (skill.progress || 0) > 0
                ? 'in-progress'
                : 'todo',
          tasks: skill.tasks,
          isHighlighted: true,
          icon: 'route',
          isMainNode: true,
          progress: skill.progress || 0,
        },
      });

      skills.forEach((skillItem, index) => {
        const angle = (index / skills.length) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 140;
        const y = centerY + radius * Math.sin(angle) - 40;

        nodes.push({
          id: `skill-${index}`,
          type: 'custom',
          position: { x, y },
          data: {
            label: skillItem.title,
            description: skillItem.description,
            status:
              (skillItem.progress || 0) === 100
                ? 'completed'
                : (skillItem.progress || 0) > 0
                  ? 'in-progress'
                  : 'todo',
            tasks: skillItem.tasks,
            icon: 'briefcase',
            isSkillNode: true,
            progress: skillItem.progress || 0,
            order: skillItem.order || index + 1,
            skillId: skillItem.id,
          },
        });
      });
    }

    return nodes;
  }, [skill, skills, viewMode]);

  // Generate edges with enhanced styling
  const generateEdges = useMemo(() => {
    const edges: Edge[] = [];

    if (viewMode === 'tree') {
      // Connect center to each skill
      skills.forEach((_, index) => {
        const skillProgress = skills[index].progress || 0;
        edges.push({
          id: `edge-center-skill-${index}`,
          source: 'center',
          target: `skill-${index}`,
          animated: skillProgress < 100,
          style: {
            stroke:
              skillProgress === 100
                ? colorScheme.edges.completed
                : skillProgress > 0
                  ? colorScheme.edges.inProgress
                  : colorScheme.edges.todo,
            strokeWidth: 2,
            strokeDasharray: skillProgress === 100 ? '0' : '5,5',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color:
              skillProgress === 100
                ? colorScheme.edges.completed
                : colorScheme.edges.inProgress,
          },
        });
      });
    } else if (viewMode === 'vertical') {
      // Sequential connections
      if (skills.length > 0) {
        edges.push({
          id: 'edge-center-skill-0',
          source: 'center',
          target: 'skill-0',
          animated: true,
          style: {
            stroke: colorScheme.edges.animated,
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: colorScheme.edges.animated,
          },
        });
      }

      for (let i = 0; i < skills.length - 1; i++) {
        const progress = skills[i].progress || 0;
        edges.push({
          id: `edge-skill-${i}-${i + 1}`,
          source: `skill-${i}`,
          target: `skill-${i + 1}`,
          animated: progress === 100,
          style: {
            stroke:
              progress === 100
                ? colorScheme.edges.completed
                : colorScheme.edges.todo,
            strokeWidth: 2,
            strokeDasharray: progress === 100 ? '0' : '5,5',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color:
              progress === 100
                ? colorScheme.edges.completed
                : colorScheme.edges.todo,
          },
        });
      }
    } else {
      // Radial connections
      skills.forEach((_, index) => {
        const skillProgress = skills[index].progress || 0;
        edges.push({
          id: `edge-center-skill-${index}`,
          source: 'center',
          target: `skill-${index}`,
          type: 'smoothstep',
          animated: skillProgress < 100,
          style: {
            stroke:
              skillProgress === 100
                ? colorScheme.edges.completed
                : skillProgress > 0
                  ? colorScheme.edges.inProgress
                  : colorScheme.edges.todo,
            strokeWidth: 2,
          },
        });
      });
    }

    return edges;
  }, [skills, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges);

  // Update nodes when view mode changes
  useMemo(() => {
    setNodes(generateNodes);
    setEdges(generateEdges);
  }, [generateNodes, generateEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    if (node.data.isSkillNode) {
      setSelectedSkill({
        id: node.data.skillId,
        title: node.data.label,
        description: node.data.description,
        tasks: node.data.tasks,
        progress: node.data.progress,
        category: 'core',
        difficulty: 'intermediate',
        estimatedHours: 40,
        order: node.data.order,
        reason: 'Selected skill for detailed view',
      });
    } else if (node.data.isMainNode) {
      setSelectedSkill(null);
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!onToggleTask) return;
    onToggleTask(taskId);

    // Update nodes to reflect task changes
    if (selectedSkill) {
      const updatedTasks = selectedSkill.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress =
        updatedTasks.length > 0
          ? Math.round((completedCount / updatedTasks.length) * 100)
          : 0;

      setSelectedSkill({
        ...selectedSkill,
        tasks: updatedTasks,
        progress,
      });

      // Update node data
      setNodes(
        nodes.map((node) => {
          if (
            node.data.skillId === selectedSkill.id ||
            (node.id === 'center' && !isRoadmapView)
          ) {
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-stone-900 to-zinc-900 backdrop-blur-sm">
      <div className="flex h-[90vh] w-[95vw] overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/95 via-stone-900/95 to-zinc-900/95 shadow-2xl">
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-gradient-to-r from-slate-800/50 to-stone-800/50 p-4">
            <div className="flex items-center gap-3">
              <Route className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-medium text-white">
                {skill.title} - Interactive Learning Path
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Selector */}
              <div className="flex rounded-lg bg-stone-800/50 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'tree'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-stone-400',
                  )}
                  onClick={() => setViewMode('tree')}
                >
                  <Layers className="mr-1 h-3 w-3" />
                  Tree
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'vertical'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-stone-400',
                  )}
                  onClick={() => setViewMode('vertical')}
                >
                  Vertical
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-7 px-2 text-xs',
                    viewMode === 'radial'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-stone-400',
                  )}
                  onClick={() => setViewMode('radial')}
                >
                  Radial
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full text-stone-400 hover:bg-red-500/20 hover:text-red-400"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Visualization */}
          <div className="relative flex-1">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
                className="bg-gradient-to-br from-slate-900 via-stone-900 to-zinc-900"
                minZoom={0.3}
                maxZoom={2}
                connectionMode={ConnectionMode.Loose}
                proOptions={{ hideAttribution: true }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#10b98120"
                />
                <Controls
                  className="border border-emerald-500/20 bg-stone-800/80"
                  showZoom
                  showFitView
                />
                <MiniMap
                  nodeColor={(node): string => {
                    switch (node.data?.status) {
                      case 'completed':
                        return colorScheme.edges.completed;
                      case 'in-progress':
                        return colorScheme.edges.inProgress;
                      default:
                        return colorScheme.edges.todo;
                    }
                  }}
                  maskColor="rgba(0, 0, 0, 0.7)"
                  className="border border-emerald-500/20 bg-stone-800/50"
                />

                {/* Progress Overview */}
                <div className="absolute top-4 left-4 rounded-lg border border-emerald-500/20 bg-gradient-to-br from-slate-800/90 to-stone-800/90 p-4 shadow-xl backdrop-blur-sm">
                  <h3 className="mb-3 text-sm font-medium text-emerald-400">
                    Learning Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 rounded-full bg-stone-700">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                          style={{ width: `${skill.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-emerald-300">
                        {skill.progress || 0}%
                      </span>
                    </div>

                    {isRoadmapView && skills && (
                      <div className="text-xs text-stone-300">
                        <span className="font-medium text-emerald-400">
                          Skills:{' '}
                        </span>
                        {skills.filter((s) => (s.progress || 0) === 100).length}
                        /{skills.length} completed
                      </div>
                    )}

                    <div className="mt-3 flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-stone-400">Completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        <span className="text-stone-400">In Progress</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-gray-500" />
                        <span className="text-stone-400">Todo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>

        {/* Side Panel for Selected Skill */}
        {selectedSkill && (
          <div className="w-1/3 overflow-y-auto border-l border-emerald-500/20 bg-gradient-to-b from-slate-800/50 to-stone-800/50 p-6">
            <div className="mb-4">
              <Badge className="mb-2 border-emerald-500 bg-emerald-500/20 text-emerald-300">
                Skill Details
              </Badge>
              <h3 className="text-xl font-medium text-white">
                {selectedSkill.title}
              </h3>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-full rounded-full bg-stone-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${selectedSkill.progress || 0}%` }}
                />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-emerald-300">
                {selectedSkill.progress || 0}%
              </span>
            </div>

            {selectedSkill.description && (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-stone-300">
                  Description
                </h4>
                <p className="text-sm text-stone-400">
                  {selectedSkill.description}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-stone-300">
                Tasks ({selectedSkill.tasks.filter((t) => t.completed).length}/
                {selectedSkill.tasks.length})
              </h4>
              {selectedSkill.tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'rounded-lg border p-3 transition-all',
                    task.completed
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-stone-700 bg-stone-800/50 hover:border-emerald-500/20',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        'mt-1 h-4 w-4 cursor-pointer rounded-full transition-colors',
                        task.completed
                          ? 'bg-emerald-500'
                          : 'bg-stone-600 hover:bg-emerald-600',
                      )}
                      onClick={() => handleToggleTask(task.id)}
                    />
                    <div className="flex-1">
                      <h5
                        className={cn(
                          'text-sm font-medium transition-colors',
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
