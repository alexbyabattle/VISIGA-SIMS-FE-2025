import jsPDF from "jspdf";
import "jspdf-autotable";

const generateStudentTermResultsReport = (studentResult, totalStudents) => {
  if (!studentResult) return;

  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ====== HEADER ======
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ST. MARY'S JUNIOR SEMINARY - VISIGA", pageWidth / 2, 14, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("STUDENT TERM RESULTS REPORT", pageWidth / 2, 20, { align: "center" });

  // ====== STUDENT INFORMATION ======
  let y = 32;
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.line(15, y - 4, pageWidth - 15, y - 4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("STUDENT INFORMATION", 15, y);

  const info = [
    ["Student Name:", studentResult.studentName],
    ["Class:", studentResult.className],
    ["Index Number:", studentResult.studentNumber],
    ["Combination:", studentResult.combination],
    ["Total Marks:", studentResult.totalMarks?.toString()],
    ["Average:", studentResult.average?.toString()],
   // ["GPA:", studentResult.gpa?.toString()],
    [
      "Position:",
      `${studentResult.positionText || "N/A"} out of ${totalStudents}`,
    ],
  ];

  y += 8;
  doc.setFontSize(11);

  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "N/A", 60, y);
    y += 7; // line spacing per row
  });

  // ====== SUBJECT RESULTS TABLE ======
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("SUBJECT RESULTS", 15, y);

  y += 5;
  const tableData = [];

  if (studentResult.subjects) {
    Object.entries(studentResult.subjects).forEach(([subject, details]) => {
      const hasData =
        details.exam10Average > 0 ||
        details.exam40Average > 0 ||
        details.exam50Marks > 0 ||
        details.totalMarks > 0;

      if (hasData) {
        tableData.push([
          subject,
          details.exam10Average?.toString() || "0",
          details.exam40Average?.toString() || "0",
          details.exam50Marks?.toString() || "0",
          details.totalMarks?.toString() || "0",
          details.grade || "N/A",
        ]);
      }
    });
  }

  doc.autoTable({
    startY: y,
    head: [
      ["Subject", "Exercise (10)", "Tests (40)", "Exam (50)", "Total (100)", "Grade"],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 2.5,
      halign: "center",
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 55 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
    },
  });

  // ====== FOOTER ======
  const finalY = doc.lastAutoTable.finalY || y + 60;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(
    "St mary's junior seminary visiga (SIMS) ",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );
  doc.text(
    `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // ====== SAVE FILE ======
  const fileName = `Student_Report_${
    studentResult.studentName?.replace(/\s+/g, "_") || "Unknown"
  }_${new Date().toISOString().split("T")[0]}.pdf`;

  doc.save(fileName);
};

export default generateStudentTermResultsReport;
