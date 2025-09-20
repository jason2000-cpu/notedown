"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import jsPDF and html2canvas to avoid hydration issues
const jsPDF = dynamic(() => import('jspdf').then(mod => mod.jsPDF), { ssr: false });
const html2canvas = dynamic(() => import('html2canvas'), { ssr: false });

interface PdfExportProps {
  content: string;
}

export function PdfExport({ content }: PdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleExportToPdf = async () => {
    if (!content.trim()) {
      alert("There is no content to export. Please add some content first.");
      return;
    }
    
    if (!isClient) {
      alert("PDF export is only available in the browser.");
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Get the actual HTML2Canvas and jsPDF modules
      const HTML2Canvas = await import('html2canvas').then(mod => mod.default);
      const { jsPDF } = await import('jspdf');
      
      // Find the preview container
      const previewContainer = document.querySelector('.prose');
      
      if (!previewContainer) {
        throw new Error('Preview content not found');
      }
      
      // Use html2canvas to capture the rendered content
      const canvas = await HTML2Canvas(previewContainer as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Make sure all styles are applied to the cloned document
          const clonedElement = clonedDoc.querySelector('.prose');
          if (clonedElement) {
            clonedElement.classList.add('pdf-export');
            
            // Add a style element to override any lab() color functions with standard RGB colors
            const styleElement = clonedDoc.createElement('style');
            styleElement.textContent = `
              /* Override lab() color functions with standard colors */
              * {
                color: #000000 !important;
                background-color: #ffffff !important;
                border-color: #cccccc !important;
              }
              pre, code {
                background-color: #f5f5f5 !important;
                color: #333333 !important;
              }
              a {
                color: #0000EE !important;
              }
              hr {
                border-color: #cccccc !important;
              }
            `;
            clonedDoc.head.appendChild(styleElement);
          }
        }
      });
      
      // Initialize jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Save the PDF
      pdf.save('notedown-document.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Please try again'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExportToPdf}
      disabled={isExporting}
    >
      <FileDown className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export to PDF'}
    </Button>
  );
}