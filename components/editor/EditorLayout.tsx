"use client";

import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { ImportExport } from "@/components/import-export/ImportExport";
import { PdfExport } from "@/components/pdf-export/PdfExport";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function EditorLayout() {
  const [markdown, setMarkdown] = useState<string>("");

  const handleToolbarAction = (action: string) => {
    // Implement toolbar actions (bold, italic, etc.)
    console.log(`Toolbar action: ${action}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">NoteDown</h1>
        <div className="flex items-center gap-2">
          <ImportExport content={markdown} onImport={setMarkdown} />
          <PdfExport content={markdown} />
          <ThemeToggle />
        </div>
      </header>
      
      <Toolbar onAction={handleToolbarAction} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <MarkdownEditor 
            initialValue={markdown} 
            onChange={setMarkdown} 
          />
        </ResizablePanel>
        <ResizablePanel defaultSize={50}>
          <MarkdownPreview content={markdown} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}