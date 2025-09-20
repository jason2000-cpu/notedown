"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";
import { ImportExport } from "@/components/import-export/ImportExport";
import { PdfExport } from "@/components/pdf-export/PdfExport";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";

export function EditorLayout() {
  const [markdown, setMarkdown] = useState<string>(`# Markdown Preview Example

## Features

- **GitHub Flavored Markdown** support
- **Syntax highlighting** for code blocks
- **XSS protection** with rehype-sanitize
- **Dark mode** compatible styling

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| GFM | ✅ |
| Syntax Highlighting | ✅ |
| Dark Mode | ✅ |
| Responsive | ✅ |

## Task List

- [x] Implement Markdown preview
- [x] Add syntax highlighting
- [x] Support dark mode
- [ ] Add math support (future)
- [ ] Add diagram support (future)
`);
  const [debouncedMarkdown, setDebouncedMarkdown] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"split" | "preview-only">("split");

  // Debounce markdown changes for performance
  const debouncedSetMarkdown = useCallback(
    debounce((value: string) => {
      setDebouncedMarkdown(value);
    }, 300),
    []
  );

  // Update debounced markdown when markdown changes
  useEffect(() => {
    debouncedSetMarkdown(markdown);
    return () => {
      debouncedSetMarkdown.cancel();
    };
  }, [markdown, debouncedSetMarkdown]);



  const togglePreviewMode = () => {
    setPreviewMode(previewMode === "split" ? "preview-only" : "split");
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">NoteDown</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePreviewMode}
            className="mr-2"
          >
            {previewMode === "split" ? "Preview Only" : "Split View"}
          </Button>
          <ImportExport content={markdown} onImport={setMarkdown} />
          <PdfExport content={markdown} />
          <ThemeToggle />
        </div>
      </header>
      
      {previewMode === "split" ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={50}>
            <MarkdownEditor 
              initialValue={markdown} 
              onChange={setMarkdown} 
            />
          </ResizablePanel>
          <ResizablePanel defaultSize={50}>
            <MarkdownPreview content={debouncedMarkdown} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 overflow-auto">
          <MarkdownPreview content={debouncedMarkdown} className="min-h-screen" />
        </div>
      )}
    </div>
  );
}