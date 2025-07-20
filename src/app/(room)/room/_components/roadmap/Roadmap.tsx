'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import RoadmapControls from './RoadmapControls';
import RoadmapSidebar from './RoadmapSidebar';
import { cn } from '@/lib/utils';

const nodeTypes = {
  custom: CustomNode,
};

interface RoadmapProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  isEditable?: boolean;
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onNodeClick?: (nodeId: string) => void;
}

export default function Roadmap({
  initialNodes = [],
  initialEdges = [],
  isEditable = false,
  onSave,
  onNodeClick,
}: RoadmapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges],
  );

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick],
  );

  return (
    <div className={cn('relative h-[80vh] w-full rounded-lg bg-black/10')}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="rounded-lg border border-green-500/30 bg-stone-900/80 backdrop-blur-sm"
      >
        <Background color="#22c55e" gap={16} />
        <Controls />
        <MiniMap />
        <RoadmapControls
          onSave={handleSave}
          onToggleSidebar={toggleSidebar}
          isEditable={isEditable}
        />
      </ReactFlow>
      <RoadmapSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        nodes={nodes}
        onNodeClick={(nodeId) => {
          const node = nodes.find((n) => n.id === nodeId);
          if (node) {
            reactFlowInstance.setCenter(node.position.x, node.position.y, {
              zoom: 1.5,
              duration: 800,
            });
          }
        }}
      />
    </div>
  );
}
