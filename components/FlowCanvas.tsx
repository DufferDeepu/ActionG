"use client";

import React from 'react';
import ReactFlow, {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Controls,
  Background,
  NodeTypes,
  NodeMouseHandler,
} from 'reactflow';

import 'reactflow/dist/style.css';

type FlowCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  nodeTypes: NodeTypes;
  onNodeDoubleClick: NodeMouseHandler;
};

export default function FlowCanvas({ 
  nodes, 
  edges, 
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  onNodeDoubleClick,
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


