'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export type Step = {
  name: string;
  uses?: string;
  run?: string;
};

export type JobNodeData = {
  jobName: string;
  runsOn: string;
  steps: Step[];
};

export default function JobNode({ data, isConnectable }: NodeProps<JobNodeData>) {
  return (
    <div className="rounded-lg bg-white border-2 border-neutral-900 shadow-md font-sans w-[200px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      <div className="px-4 py-2.5">
        <div className="text-base font-medium text-neutral-900 pb-1 border-b border-gray-200 mb-1">
          <strong>{data.jobName}</strong>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-700 mr-1">runs-on:</span>
          <span>{data.runsOn || 'ubuntu-latest'}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}
