"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface PdfExportProps {
  content: string;
}

export function PdfExport({ content }: PdfExportProps) {
  const handleExportToPdf = async () => {
    // This is a placeholder for PDF export functionality
    // In a real implementation, you would use a library like jsPDF or html2pdf
    // or send the content to a server-side API for PDF generation
    
    alert("PDF export functionality will be implemented here");
    
    // Example implementation with jsPDF would look like:
    // const doc = new jsPDF();
    // doc.text(content, 10, 10);
    // doc.save('notedown-document.pdf');
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExportToPdf}>
      <FileDown className="h-4 w-4 mr-2" />
      Export to PDF
    </Button>
  );
}