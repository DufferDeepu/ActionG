// In app/TriggerNode.tsx
"use client";

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// 1. Define the new, structured types
export type Trigger = {
  event: string;      // e.g., "push"
  key?: string;     // e.g., "branches"
  values: string[]; // e.g., ["main", "dev"]
};

export type TriggerNodeData = {
  triggers: Trigger[];
};
// ---

export default function TriggerNode({ data, isConnectable }: NodeProps<TriggerNodeData>) {
  
  // Get a title from the array of event names
  const getTitle = () => {
    if (!data.triggers || data.triggers.length === 0) {
      return "on: (empty)";
    }
    // Get all the 'event' names, remove duplicates, and join them
    const eventNames = [...new Set(data.triggers.map(t => t.event))];
    return `on: ${eventNames.join(', ')}`;
  }
  
  return (
    <div className="rounded-lg bg-[#f0f7ff] border-2 border-[#007bff] shadow-[0_4px_6px_rgba(0,0,0,0.05)] w-[200px]">
      <div className="p-4 text-center">
        <div className="text-base font-semibold text-[#004a99]">
          <strong>{getTitle()}</strong>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
}