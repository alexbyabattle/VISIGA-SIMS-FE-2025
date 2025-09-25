import React from "react";
import jsPDF from "jspdf";
import { Button, useTheme } from "@mui/material";


const AlevelExportPDFButton = ({ groupedResults }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleGeneratePDF = () => {
    const doc = new jsPDF("l", "mm", "a3");

    doc.setFontSize(16);
    doc.text("RESULTS OF ALL STUDENTS IN A CLASS", 14, 15);

    if (!groupedResults || groupedResults.length === 0) {
      alert("No results to export");
      return;
    }

    // ✅ Collect all unique subjects across all students
    const subjectSet = new Set();
    groupedResults.forEach((student) => {
      Object.keys(student.subjects || {}).forEach((subj) =>
        subjectSet.add(subj)
      );
    });
    const subjectKeys = Array.from(subjectSet);

    const headers = [
      "No",
      "Name",
      "Index",
      ...subjectKeys,
      "Total",
      "Average",
      "Division",
      "Position",
    ];

    const startX = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - startX * 2;
    const cellPadding = 2;

    const headerHeight = 12;

    const fixedWidths = {
      No: 10,
      Name: 50,
      Index: 31,
      Division: 25,
      Position: 20,
    };

    const remainingCols = headers.filter((h) => !fixedWidths[h]);
    const remainingWidth =
      usableWidth - Object.values(fixedWidths).reduce((sum, w) => sum + w, 0);

    const dynamicWidth = remainingWidth / remainingCols.length;
    const columnWidths = headers.map((h) => fixedWidths[h] || dynamicWidth);

    // ✅ Draw header row
    const drawHeaderRow = (yPos) => {
      let x = startX;
      doc.setFontSize(9);
      headers.forEach((header, i) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, yPos, columnWidths[i], headerHeight, "FD");

        doc.setFont(undefined, "bold");
        doc.setTextColor(0, 0, 0);

        const textY = yPos + headerHeight / 2 + 2;
        doc.text(header, x + cellPadding, textY, {
          maxWidth: columnWidths[i] - 2 * cellPadding,
        });

        x += columnWidths[i];
      });

      doc.setFont(undefined, "normal");
      return yPos + headerHeight;
    };

    let y = 25;
    y = drawHeaderRow(y);

    // ✅ Student rows (with auto row height + wrapping)
    doc.setFontSize(8);
    groupedResults.forEach((student, index) => {
      const subjectData = subjectKeys.map((subj) => {
        const s = student.subjects[subj];
        if (!s) return "";

        // Parts ✅ only show marks (skip empty)
        let partsStr = "";
        if (s.parts && s.parts.length > 0) {
          const validParts = s.parts.filter(
            (p) => p.marks !== undefined && p.marks !== null && p.marks !== ""
          );
          if (validParts.length > 0) {
            partsStr = validParts
              .map((p) => `${p.name}${p.marks ? `: ${p.marks}` : ""}`)
              .join(" | ");
          }
        }

        // Final ✅ only include if it has a non-empty, non-zero value
        let finalStr = "";
        if (
          s.final &&
          s.final.value !== undefined &&
          s.final.value !== null &&
          s.final.value !== "" &&
          parseFloat(s.final.value) !== 0
        ) {
          finalStr = `Final: ${s.final.value}\n`;
        }

        // ✅ If no parts and no final -> return empty
        if (!partsStr && !finalStr) return "";

        return [partsStr, finalStr].filter(Boolean).join("\n");
      });

      const row = [
        index + 1,
        student.studentName,
        student.studentNumber,
        ...subjectData,
        String(student.totalMarks ?? ""),
        String(student.average ?? ""),
        student.division ?? "",
        String(student.position ?? ""),
      ];

      // ✅ Calculate row height based on max lines
      let maxLines = 1;
      const wrappedCells = row.map((cell, i) => {
        const lines = doc.splitTextToSize(
          String(cell || ""),
          columnWidths[i] - 2 * cellPadding
        );
        if (lines.length > maxLines) maxLines = lines.length;
        return lines;
      });
      const rowHeight = maxLines * 5; // 5mm per line

      // ✅ Draw row
      let rowX = startX;
      wrappedCells.forEach((lines, i) => {
        doc.rect(rowX, y, columnWidths[i], rowHeight);

        lines.forEach((line, lineIndex) => {
          doc.text(line, rowX + cellPadding, y + 5 + lineIndex * 5, {
            maxWidth: columnWidths[i] - 2 * cellPadding,
          });
        });

        rowX += columnWidths[i];
      });

      y += rowHeight;

      // ✅ Page break
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 25;
        y = drawHeaderRow(y);
        doc.setFontSize(8);
      }
    });

    doc.save("class_results.pdf");
  };

  return (
    <Button
      variant="contained"
      onClick={handleGeneratePDF}
      sx={{
        backgroundColor: colors.blueAccent[500],
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        borderRadius: "8px",
        padding: "6px 14px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        "&:hover": {
          backgroundColor: colors.blueAccent[600],
        },
      }}
    >
      📄 Export as PDF
    </Button>
  );
};

export default AlevelExportPDFButton;
