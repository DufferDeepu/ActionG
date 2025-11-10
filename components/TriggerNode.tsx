// Create new file: app/TriggerNode.tsx
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styles from './CustomNodes.module.css';

export type TriggerNodeData = {
  trigger: string;
};

export default function TriggerNode({ data, isConnectable }: NodeProps<TriggerNodeData>) {
  return (
    <div className="rounded-lg border-2 border-slate-400 bg-blue-50 shadow-md font-sans w-[180px]">
      {/* Node Content */}
      <div className="p-4 text-center">
        <div className="text-base font-semibold text-gray-800">
          <strong>{data.trigger}</strong>
        </div>
      </div>
      
      {/* This node only has an output (source) handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}