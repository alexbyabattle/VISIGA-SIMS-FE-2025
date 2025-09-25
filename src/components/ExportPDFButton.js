import React from "react";
import { jsPDF } from "jspdf";
import generateClassResultsPDF from "../utils/classResultsPdf";

const ExportPDFButton = ({ groupedResults, className, examinationType, isClassResults = false }) => {
  const handleGeneratePDF = () => {
    // Use class results PDF generator for Class_Results
    if (isClassResults) {
      generateClassResultsPDF(groupedResults, className, examinationType);
      return;
    }

    const doc = new jsPDF("l", "mm", "a3");

    doc.setFontSize(16); // Reduced from 18
    doc.text("RESULTS OF ALL  STUDENTS  IN A CLASS", 14, 15);

    if (!groupedResults || groupedResults.length === 0) {
      alert("No results to export");
      return;
    }

    const firstStudent = groupedResults[0];
    const subjectKeys = Object.keys(firstStudent.subjects || {});

    // Check which columns have all N/A or empty values
    const checkColumnEmpty = (columnKey, getValue) => {
      return groupedResults.every(student => {
        const value = getValue(student);
        return !value || value === 'N/A' || value === '' || value === null || value === undefined;
      });
    };

    // Check if Index column is empty
    const isIndexEmpty = checkColumnEmpty('Index', (student) => student.studentNumber);
    
    // Check if Division column is empty
    const isDivisionEmpty = checkColumnEmpty('Division', (student) => student.division);

    // Build headers dynamically based on empty columns
    const baseHeaders = ["No", "Name"];
    
    // Add Index only if not empty
    if (!isIndexEmpty) {
      baseHeaders.push("Index");
    }
    
    // Add subject columns
    baseHeaders.push(...subjectKeys);
    
    // Add remaining columns
    baseHeaders.push("Total", "Average");
    
    // Add Division only if not empty
    if (!isDivisionEmpty) {
      baseHeaders.push("Division");
    }
    
    baseHeaders.push("Position");

    const headers = baseHeaders;

    const startX = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - startX * 2;
    const cellPadding = 2;

    const rowHeight = 10;     
    const headerHeight = 12; 

    const fixedWidths = {
      No: 10,   
      Name: 50, 
    };
    
    // Add Index width only if column exists
    if (!isIndexEmpty) {
      fixedWidths.Index = 31;
    }
    
    // Add Division width only if column exists
    if (!isDivisionEmpty) {
      fixedWidths.Division = 25;
    }

    const remainingCols = headers.filter((h) => !fixedWidths[h]);
    const remainingWidth =
      usableWidth - Object.values(fixedWidths).reduce((sum, w) => sum + w, 0);

    const dynamicWidth = remainingWidth / remainingCols.length;
    const columnWidths = headers.map((h) => fixedWidths[h] || dynamicWidth);

    // ✅ Reusable function for drawing headers
    const drawHeaderRow = (yPos) => {
      let x = startX;
      doc.setFontSize(9); // Reduced header font size
      headers.forEach((header, i) => {
        // White background with border
        doc.setFillColor(255, 255, 255); 
        doc.setDrawColor(0, 0, 0);       
        doc.rect(x, yPos, columnWidths[i], headerHeight, "FD");

        // Bold black text
        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);

        // Vertically center text inside the header cell
        const textY = yPos + headerHeight / 2 + 2; // Adjusted from +3
        doc.text(header, x + cellPadding, textY, {
          maxWidth: columnWidths[i] - 2 * cellPadding,
        });

        x += columnWidths[i];
      });

      doc.setFont(undefined, "normal");
      return yPos + headerHeight;
    };

    let y = 25; // Start a bit higher

    // --- Draw first header ---
    y = drawHeaderRow(y);

    // --- Draw student rows ---
    doc.setFontSize(8); // Reduced font size for data rows
    groupedResults.forEach((student, index) => {
      const subjectData = subjectKeys.map((subj) => {
        const s = student.subjects[subj];
        return `${s.marks}`;
      });

      // Build row data dynamically based on headers
      const rowData = [index + 1, student.studentName];
      
      // Add Index only if column exists
      if (!isIndexEmpty) {
        rowData.push(student.studentNumber);
      }
      
      // Add subject data
      rowData.push(...subjectData);
      
      // Add Total and Average
      rowData.push(String(student.totalMarks), String(student.average));
      
      // Add Division only if column exists
      if (!isDivisionEmpty) {
        rowData.push(student.division);
      }
      
      // Add Position
      rowData.push(String(student.position));

      const row = rowData;

      let rowX = startX;
      row.forEach((cell, i) => {
        // Draw cell border
        doc.rect(rowX, y, columnWidths[i], rowHeight);
        
        // Center text vertically with smaller offset
        doc.text(String(cell), rowX + cellPadding, y + rowHeight / 2 + 2, {
          maxWidth: columnWidths[i] - 2 * cellPadding,
        });
        rowX += columnWidths[i];
      });

      y += rowHeight;

      // --- Page break ---
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 25;
        y = drawHeaderRow(y);
        doc.setFontSize(8); // Reset font size after page break
      }
    });

    doc.save("class_results.pdf");
  };

  return (
    <button
      onClick={handleGeneratePDF}
      style={{
        padding: "5px 10px",
        backgroundColor: "#502eccff",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "1px",
        boxShadow: "0 4px 6px rgba(248, 244, 244, 0.9)",
      }}
    >
      📄 Export as PDF
    </button>
  );
};

export default ExportPDFButton;