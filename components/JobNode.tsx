// In app/JobNode.tsx
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styles from './CustomNodes.module.css';

// 1. CREATE AND EXPORT THIS 'Step' TYPE
export type Step = {
  name: string;
  uses?: string;
  run?: string;
  // We can add 'with' and 'env' here later
};

// 2. UPDATE JobNodeData TO INCLUDE AN ARRAY OF STEPS
export type JobNodeData = {
  jobName: string;
  runsOn: string;
  steps: Step[]; // Add this line
};

export default function JobNode({ data, isConnectable }: NodeProps<JobNodeData>) {
  // ... (rest of the component is unchanged)
  // ... (it just displays jobName and runsOn)
  return (
    <div className={styles.jobNode}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className={styles.content}>
        <div className={styles.title}>
          <strong>{data.jobName}</strong>
        </div>
        <div className={styles.details}>
          <span className={styles.label}>runs-on:</span>
          <span>{data.runsOn || 'ubuntu-latest'}</span>
        </div>
        {/* We can add a "step count" here later if we want */}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}