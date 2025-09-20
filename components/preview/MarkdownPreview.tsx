"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  // Use memoization to prevent unnecessary re-renders
  const memoizedContent = useMemo(() => content, [content]);

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none p-4 min-h-[500px] h-full border rounded-md overflow-y-auto ${className}`}>
      {memoizedContent ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize, [rehypeHighlight, { ignoreMissing: true }]]}
          components={{
            // Apply the markdown-body class to the wrapper div
            div: ({node, ...props}) => <div className="markdown-body" {...props} />
          }}
        >
          {memoizedContent}
        </ReactMarkdown>
      ) : (
        <p className="text-muted-foreground">Preview will appear here...</p>
      )}
    </div>
  );
}