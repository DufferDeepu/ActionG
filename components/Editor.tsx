"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

import FlowCanvas from "./FlowCanvas";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import ResizableHandleWrapper from "./ResizableHandleWrapper";
import { CopyIcon, Plus, UploadIcon } from "lucide-react";
import { Edge, Node, useEdgesState, useNodesState, NodeMouseHandler, NodeTypes } from "reactflow";
import * as yaml from "js-yaml"; 
import Toolbox from "./Toolbox";
import JobNode, { JobNodeData, Step } from './JobNode'; 
import TriggerNode, { TriggerNodeData, Trigger } from './TriggerNode';
import TriggerModal from './TriggerModal';
import JobModal from "./JobModal";
import { toast } from "sonner";

const nodeTypes: NodeTypes = {
  jobNode: JobNode,
  triggerNode: TriggerNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'triggerNode',
    data: { 
      triggers: [
        { event: 'push', key: 'branches', values: ['main'] }
      ]
    },
    position: { x: 200, y: 100 },
  },
  {
    id: '2',
    type: 'jobNode', 
    data: {
      jobName: 'build',
      runsOn: 'ubuntu-latest',
      steps: [
        { name: 'Checkout code', uses: 'actions/checkout@v4' }
      ]
    },
    position: { x: 200, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

function generateYaml(nodes: Node[], edges: Edge[]): string {
  const yamlConfig: any = {
    name: "My Visual Workflow",
    on: {},
    jobs: {}
  };

  const triggerNode = nodes.find(n => n.type === 'triggerNode');
  if (triggerNode) {
    const onConfig: any = {};
    const triggers: Trigger[] = triggerNode.data.triggers || [];

    triggers.forEach(trigger => {
      if (trigger.key) {
        // Check if the values array has content
        if (trigger.values && trigger.values.length > 0) {
          // Has values, so output: branches: [main]
          onConfig[trigger.event] = {
            [trigger.key]: trigger.values
          };
        } else {
          // Values is empty, so output: branches: null (which prints as "branches:")
          onConfig[trigger.event] = {
            [trigger.key]: null
          };
        }
      } 
      // Case 2: No key (e.g., "workflow_dispatch")
      else {
        onConfig[trigger.event] = null;
      }
    });

    // Handle simple list (e.g., on: [push, pull_request])
    const allKeysEmpty = triggers.every(t => !t.key);
    if (allKeysEmpty && triggers.length > 0) {
      yamlConfig.on = triggers.map(t => t.event);
    } else {
      yamlConfig.on = onConfig;
    }
  }

  nodes.filter(n => n.type === 'jobNode').forEach(jobNode => {
    const jobName = jobNode.data.jobName;
    const currentJob: any = {
      'runs-on': jobNode.data.runsOn,
      'steps': jobNode.data.steps.map((step: Step) => {
        const cleanStep: any = { name: step.name };
        if (step.uses) {
          cleanStep.uses = step.uses;
        }
        if (step.run) {
          cleanStep.run = step.run;
        }
        return cleanStep;
      })
    };
    
    const incomingEdges = edges.filter(e => e.target === jobNode.id);
    const dependencies = incomingEdges.map(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      if (sourceNode && sourceNode.type === 'jobNode') {
        return sourceNode.data.jobName;
      }
      return null;
    }).filter(Boolean);

    if (dependencies.length > 0) {
      currentJob.needs = dependencies;
    }
    yamlConfig.jobs[jobName] = currentJob;
  });

  try {
    return yaml.dump(yamlConfig, { 'noRefs': true, schema: yaml.JSON_SCHEMA });
  } catch (e) {
    console.error(e);
    return "Error generating YAML";
  }
}


export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [yamlOutput, setYamlOutput] = useState('');
  const [yamlInput, setYamlInput] = useState(''); 
  
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  const idCounter = useRef(3);
  const getNewNodeId = () => `node_${idCounter.current++}`;
 
  const addNode = useCallback(() => {
    const newNodeId = getNewNodeId();
    const newNode: Node = {
      id: newNodeId,
      type: 'jobNode',
      position: { x: 100, y: 100 },
      data: { 
        jobName: 'new-job', 
        runsOn: 'ubuntu-latest', 
        steps: []
      },
    };

    const selectedNode = nodes.find(n => n.selected);
    
    let sourceNode = null;
    if (selectedNode) {
      sourceNode = selectedNode;
    } else {
      sourceNode = nodes.find(n => n.type === 'triggerNode');
    }
    
    let newEdge = null;
    if (sourceNode) {
      newEdge = {
        id: `e-${sourceNode.id}-${newNodeId}`,
        source: sourceNode.id,
        target: newNodeId,  
        animated: true,
      };
    }
 
    setNodes((currentNodes) => currentNodes.concat(newNode));
    
    if (newEdge) {
      setEdges((currentEdges) => currentEdges.concat(newEdge));
    }

    toast.success("Node added successfully");
  }, [nodes, setNodes, setEdges]); 
 
  const importYaml = useCallback((yamlString: string) => {
    try {
      const configObject: any = yaml.load(yamlString);
      if (!configObject || typeof configObject !== 'object') {
        throw new Error('Invalid YAML object');
      }
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const jobNameToNodeIdMap = new Map<string, string>();
      let yPos = 50;
      let xPos = 50;

      if (configObject.on) {
        const triggers: Trigger[] = [];
        const onConfig = configObject.on;

        if (typeof onConfig === 'string') {
          // on: push
          triggers.push({ event: onConfig, values: [] });
        } else if (Array.isArray(onConfig)) {
          // on: [push, pull_request]
          onConfig.forEach(event => {
            triggers.push({ event, values: [] });
          });
        } else if (typeof onConfig === 'object') {
          // on: { push: { branches: [main] }, ... }
          Object.keys(onConfig).forEach(event => {
            const config = onConfig[event];
            if (config && typeof config === 'object') {
              const key = Object.keys(config)[0]; // "branches"
              const values = config[key];        // ["main"]
              triggers.push({ event, key, values: Array.isArray(values) ? values : [values] });
            } else {
              // on: { workflow_dispatch: null }
              triggers.push({ event, values: [] });
            }
          });
        }

        const triggerId = getNewNodeId();
        newNodes.push({
          id: triggerId,
          type: 'triggerNode',
          position: { x: xPos + 150, y: yPos },
          data: { triggers: triggers }
        });
        yPos += 150;
      }
      if (configObject.jobs) {
        for (const jobName in configObject.jobs) {
          const jobData = configObject.jobs[jobName];
          const jobId = getNewNodeId();
          jobNameToNodeIdMap.set(jobName, jobId);
          newNodes.push({
            id: jobId,
            type: 'jobNode',
            position: { x: xPos, y: yPos },
            data: { 
              jobName: jobName, 
              runsOn: jobData['runs-on'],
              steps: jobData.steps || []
            },
          });
          xPos += 250;
        }
      }
      if (configObject.jobs) {
        for (const jobName in configObject.jobs) {
          const jobData = configObject.jobs[jobName];
          const targetNodeId = jobNameToNodeIdMap.get(jobName);
          if (!targetNodeId) continue;
          if (jobData.needs) {
            const needsList: string[] = Array.isArray(jobData.needs) ? jobData.needs : [jobData.needs];
            for (const neededJobName of needsList) {
              const sourceNodeId = jobNameToNodeIdMap.get(neededJobName);
              if (sourceNodeId) {
                newEdges.push({ id: `e-${sourceNodeId}-${targetNodeId}`, source: sourceNodeId, target: targetNodeId, animated: true });
              }
            }
          } else {
            const triggerNode = newNodes.find(n => n.type === 'triggerNode');
            if (triggerNode) {
              newEdges.push({ id: `e-${triggerNode.id}-${targetNodeId}`, source: triggerNode.id, target: targetNodeId, animated: true });
            }
          }
        }
      }
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (e) {
      alert('Invalid YAML: ' + (e as Error).message);
    }
  }, [setNodes, setEdges]);

  const handleImport = useCallback(() => {
    importYaml(yamlInput);
    toast.success("File imported successfully!");
  }, [importYaml, yamlInput]);
  
  useEffect(() => {
    const newYaml = generateYaml(nodes, edges);
    setYamlOutput(newYaml);
  }, [nodes, edges]);

  const handleNodeDoubleClick: NodeMouseHandler = useCallback((event, node) => {
  if (node.type === 'jobNode') {
    setEditingNode(node);
    setIsJobModalOpen(true);
  } else if (node.type === 'triggerNode') { 
    setEditingNode(node);
    setIsTriggerModalOpen(true); 
  }
}, []);

  const handleJobModalSave = (nodeId: string, newData: JobNodeData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
    setIsJobModalOpen(false);
    setEditingNode(null);
  };

  const handleJobModalClose = () => {
    setIsJobModalOpen(false);
    setEditingNode(null);
  };

  const handleTriggerModalSave = (nodeId: string, newData: TriggerNodeData) => {
     setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
    setIsTriggerModalOpen(false);
    setEditingNode(null);
  };
  
  const handleTriggerModalClose = () => {
    setIsTriggerModalOpen(false);
    setEditingNode(null);
  };

  return (
    <>
    <div className="h-full w-full border-none rounded-2xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          className="h-full max-w-[500px] min-w-[220px]"
        >
          <ResizablePanelGroup
            direction="vertical"
            className="h-full p-1 gap-1 "
          >
            {/* --- Top Section --- */}
            <ResizablePanel defaultSize={45} className="h-full">
              <div className="p-2 flex flex-col h-full bg-secondary rounded-2xl border border-primary/10">
                <h5 className="font-medium tracking-tight mb-1 ml-2">
                  Import <span className="font-bold">YAML</span>
                </h5>
                <div className="flex-1 flex flex-col items-center">
                  <Textarea
                    className="flex-1 w-full border resize-none"
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    placeholder="Paste your .yml file content here..."
                  />
                  <Button
                    variant="accent"
                    className="w-full mt-1.5 max-w-60 min-w-30"
                    onClick={handleImport}
                  >
                    <UploadIcon className="size-4" />
                    Import
                  </Button>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandleWrapper direction="vertical" />

            {/* --- Bottom Section --- */}
            <ResizablePanel defaultSize={55} className="h-full">
              <div className="p-2 flex flex-col h-full bg-secondary rounded-2xl border border-primary/10">
                <div className="flex justify-between items-center mb-1">
                <h5 className="font-medium tracking-tight ml-2">
                  Generated <span className="font-bold">YAML</span>
                </h5>
                <Button 
                  className="w-fit"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(yamlOutput);
                      toast.success("YAML Copied to Clipboard")
                    } catch (err) {
                      console.error("Failed to copy", err);
                      toast.error("Failed to copy")
                    }
                  }}
                >
                  <CopyIcon className="size-3.5" />
                </Button>
                </div>
                <Textarea
                  className="flex-1 w-full border resize-none"
                  value={yamlOutput}
                  readOnly
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandleWrapper direction="horizontal" />

        <ResizablePanel defaultSize={65} className="p-1 rounded-2xl">
          <div className="relative w-full h-full">
            {/* Add Node Button */}
            <div className="absolute top-6 left-22 transform -translate-x-1/2 z-10">
              <Toolbox onAddNode={addNode} />
            </div>

            {/* Canvas */}
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeDoubleClick={handleNodeDoubleClick} // Pass the handler
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

   
      {isJobModalOpen && editingNode && (
        <JobModal
          node={editingNode as Node<JobNodeData>}
          onClose={handleJobModalClose}
          onSave={handleJobModalSave}
        />
      )}

      {isTriggerModalOpen && editingNode && (
        <TriggerModal
          node={editingNode as Node<TriggerNodeData>}
          onClose={handleTriggerModalClose}
          onSave={handleTriggerModalSave}
        />
      )}
    </>
  );
}
