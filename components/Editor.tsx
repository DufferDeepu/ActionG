import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ReactFlow } from "@xyflow/react";
import FlowCanvas from "./FlowCanvas";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import ResizableHandleWrapper from "./ResizableHandleWrapper";
import { UploadIcon } from "lucide-react";

const Editor = () => {
  return (
    <div className="h-full w-full border-none rounded-2xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="h-full max-w-[720px] min-w-[220px]">
          <ResizablePanelGroup
            direction="vertical"
            className="h-full p-1 gap-1 "
          >
            {/* --- Top Section --- */}
            <ResizablePanel defaultSize={45} className="h-full">
              <div className="p-2 flex flex-col h-full bg-secondary rounded-2xl border border-primary/10">
                <h5 className="font-medium tracking-tight mb-1">
                  Import <span className="font-bold">YAML</span>
                </h5>
                <div className="flex-1 flex flex-col items-center">
                  <Textarea className="flex-1 w-full border resize-none" />
                  <Button variant="accent" className="w-full mt-1.5 max-w-60 min-w-30">
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
                <h5 className="font-medium tracking-tight mb-1">
                  Generated <span className="font-bold">YAML</span>
                </h5>
                <Textarea className="flex-1 w-full border resize-none" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandleWrapper direction="horizontal" />

        <ResizablePanel defaultSize={65} className="p-1 rounded-2xl">
          <FlowCanvas
          //   nodes={nodes}
          //   edges={edges}
          //   onNodesChange={onNodesChange}
          //   onEdgesChange={onEdgesChange}
          //   nodeTypes={nodeTypes}
          //   onNodeDoubleClick={handleNodeDoubleClick} // Pass the handler
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
