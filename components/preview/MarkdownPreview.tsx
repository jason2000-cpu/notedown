"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none p-4 min-h-[500px] border rounded-md">
      {content ? (
        <ReactMarkdown>{content}</ReactMarkdown>
      ) : (
        <p className="text-muted-foreground">Preview will appear here...</p>
      )}
    </div>
  );
}