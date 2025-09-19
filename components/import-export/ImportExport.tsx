"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface ImportExportProps {
  content: string;
  onImport: (content: string) => void;
}

export function ImportExport({ content, onImport }: ImportExportProps) {
  // Export functionality
  const handleExport = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notedown-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import functionality
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImport(content);
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm" asChild>
        <label>
          <Upload className="h-4 w-4 mr-2" />
          Import
          <input
            type="file"
            accept=".md,.markdown,.txt"
            className="sr-only"
            onChange={handleImport}
          />
        </label>
      </Button>
    </div>
  );
}