"use client";

import { useEffect, useRef } from "react";

export function useAutosave(content: string, delay = 2000) {
  const lastSaved = useRef(content);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip if content hasn't changed
    if (content === lastSaved.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Save to localStorage
      localStorage.setItem("notedown-autosave", content);
      lastSaved.current = content;
      console.log("Content autosaved");
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay]);

  // Function to load autosaved content
  const loadAutosaved = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("notedown-autosave");
  };

  return { loadAutosaved };
}