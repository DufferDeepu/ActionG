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
    <div className={styles.triggerNode}>
      {/* Node Content */}
      <div className={styles.content}>
        <div className={styles.title}>
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