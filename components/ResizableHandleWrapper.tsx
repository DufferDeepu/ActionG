"use client";
import React from "react";
import { ResizableHandle } from "./ui/resizable";

interface ResizableHandleWrapperProps {
  direction?: "horizontal" | "vertical";
  hoverColorClass?: string; // Use complete class like "group-hover:bg-blue-500"
}

const ResizableHandleWrapper: React.FC<ResizableHandleWrapperProps> = ({
  direction = "horizontal",
  hoverColorClass = "group-hover:bg-slate-400",
}) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={`
        group relative transition-all duration-300
        ${isHorizontal ? "w-2 h-full cursor-col-resize" : "h-2 w-full cursor-row-resize"}
      `}
    >
      <div
        className={`
          absolute transition-all duration-300 rounded-sm 
          ${isHorizontal
            ? "top-0 left-1/2 -translate-x-1/2 w-0.5 h-full"
            : "left-0 top-1/2 -translate-y-1/2 w-full h-0.5"}
          ${hoverColorClass}
        `}
      />
      <ResizableHandle className="absolute inset-0 opacity-0" />
    </div>
  );
};

export default ResizableHandleWrapper;