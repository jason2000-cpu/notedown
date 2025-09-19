"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link, Image, Code } from "lucide-react";

interface ToolbarProps {
  onAction: (action: string) => void;
}

export function Toolbar({ onAction }: ToolbarProps) {
  const tools = [
    { icon: <Bold size={18} />, action: "bold", tooltip: "Bold (Ctrl+B)" },
    { icon: <Italic size={18} />, action: "italic", tooltip: "Italic (Ctrl+I)" },
    { icon: <Heading1 size={18} />, action: "h1", tooltip: "Heading 1" },
    { icon: <Heading2 size={18} />, action: "h2", tooltip: "Heading 2" },
    { icon: <List size={18} />, action: "ul", tooltip: "Bullet List" },
    { icon: <ListOrdered size={18} />, action: "ol", tooltip: "Numbered List" },
    { icon: <Link size={18} />, action: "link", tooltip: "Link (Ctrl+K)" },
    { icon: <Image size={18} />, action: "image", tooltip: "Image" },
    { icon: <Code size={18} />, action: "code", tooltip: "Code Block" },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 p-1 border-b">
        {tools.map((tool) => (
          <Tooltip key={tool.action}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAction(tool.action)}
                className="h-8 w-8"
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}