// In app/FlowCanvas.tsx
'use client';

import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Controls,
  Background,
  NodeTypes,
  // 1. Import NodeMouseHandler
  NodeMouseHandler,
} from 'reactflow';

import 'reactflow/dist/style.css';

type FlowCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  nodeTypes: NodeTypes;
  onNodeDoubleClick: NodeMouseHandler; // 2. Add the double-click prop
};

export default function FlowCanvas({ 
  nodes, 
  edges, 
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  onNodeDoubleClick, // 3. Destructure the prop
}: FlowCanvasProps) {
  return (
    <div className='w-full h-full border border-primary/10 bg-secondary rounded-2xl'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={onNodeDoubleClick} // 4. Pass it to ReactFlow
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}