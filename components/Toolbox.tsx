// Create new file: app/Toolbox.tsx
"use client";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";

// 1. Define the props. It will receive a function to call
type ToolboxProps = {
  onAddNode: () => void;
};

export default function Toolbox({ onAddNode }: ToolboxProps) {
  return (
    <Button 
        className="px-4 py-2" 
        variant={"accent"}
        onClick={onAddNode}
    >
      <Plus className="size-4" />
      Add Node
    </Button>
  );
}
