"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAutosave } from "@/components/autosave/useAutosave";

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({ initialValue = "", onChange }: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);

  // Connect to autosave functionality
  useAutosave(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Textarea
      className="min-h-[500px] h-full font-mono resize-none p-4 focus-visible:ring-1 overflow-y-auto"
      placeholder="Write your markdown here..."
      value={value}
      onChange={handleChange}
    />
  );
}