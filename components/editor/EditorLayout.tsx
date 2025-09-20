"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";
import { Toolbar } from "@/components/toolbar/Toolbar";
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

  const applyFormatting = useCallback((action: string) => {
    // Get the current selection
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    let replacement = "";

    // Apply the formatting based on the action
    switch (action) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "h1":
        replacement = `# ${selectedText || "Heading 1"}`;
        break;
      case "h2":
        replacement = `## ${selectedText || "Heading 2"}`;
        break;
      case "ul":
        replacement = `- ${selectedText || "List item"}`;
        break;
      case "ol":
        replacement = `1. ${selectedText || "List item"}`;
        break;
      case "link":
        replacement = `[${selectedText || "Link text"}](url)`;
        break;
      case "image":
        replacement = `![${selectedText || "Alt text"}](image-url)`;
        break;
      case "code":
        replacement = `\`\`\`\n${selectedText || "code"}\n\`\`\``;
        break;
      default:
        return;
    }

    // Update the markdown with the replacement
    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Focus the textarea and set the cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [markdown]);

  const handleToolbarAction = (action: string) => {
    applyFormatting(action);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if Ctrl key is pressed
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'b': // Bold
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i': // Italic
            e.preventDefault();
            applyFormatting('italic');
            break;
          case 'k': // Link
            e.preventDefault();
            applyFormatting('link');
            break;
          case '1': // Heading 1
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('h1');
            }
            break;
          case '2': // Heading 2
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('h2');
            }
            break;
          case 'l': // List (unordered)
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('ul');
            }
            break;
          case 'o': // List (ordered)
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('ol');
            }
            break;
          case 'e': // Code block
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('code');
            }
            break;
          case 'm': // Image
            if (e.shiftKey) {
              e.preventDefault();
              applyFormatting('image');
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [applyFormatting]);

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
      
      <Toolbar onAction={handleToolbarAction} />
      
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