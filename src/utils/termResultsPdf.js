import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateTermResultsPDF = (results, termName, className) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ===== HEADER =====
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("ST. MARY'S JUNIOR SEMINARY - VISIGA", pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(15);
  doc.setFont('helvetica', 'normal');
  doc.text('CLASS TERM RESULTS REPORT', pageWidth / 2, 19, { align: 'center' });

  doc.setFontSize(11);
doc.setFont('helvetica', 'normal');

// Left side: Class name
doc.text(`Class: ${className || ''}`, 15, 25);

// Right side: Generated on (aligned to right edge)
const generatedOn = new Date().toLocaleString();
const generatedText = `Generated on: ${generatedOn}`;

// Calculate text width to align it from the right margin
const textWidth = doc.getTextWidth(generatedText);
doc.text(generatedText, pageWidth - textWidth - 15, 25);


  
  

  // ===== SUBJECTS (excluding papers) =====
  const excludedSubjects = [
    "CHEMISTRY-1", "CHEMISTRY-2", "CHEMISTRY-3",
    "PHYSICS-1", "PHYSICS-2", "PHYSICS-3",
    "BIOLOGY-1", "BIOLOGY-2", "BIOLOGY-3",
    "HISTORY-1", "HISTORY-2",
    "GEOGRAPHY-1", "GEOGRAPHY-2",
    "MATHEMATICS-1", "MATHEMATICS-2",
    "ECONOMICS-1", "ECONOMICS-2"
  ];

  const subjectSet = new Set();
  results.forEach((student) => {
    Object.keys(student.subjects || {}).forEach((subj) => {
      if (!excludedSubjects.includes(subj)) subjectSet.add(subj);
    });
  });
  const subjectNames = Array.from(subjectSet);

  // ===== HELPERS =====
  const hasSubjectResults = (subj) =>
    subj.exam10Average > 0 || subj.exam40Average > 0 || subj.exam50Marks > 0;

  const getSubjectMarks = (subj) => {
    if (!subj || !hasSubjectResults(subj)) return '';
    return subj.totalMarks || '';
  };

  const checkColumnEmpty = (key, getValue) =>
    results.every(student => {
      const value = getValue(student);
      return !value || value === 'N/A' || value === '';
    });

  const isIndexEmpty = checkColumnEmpty('Index', s => s.studentNumber);
  const isCombinationEmpty = checkColumnEmpty('Combination', s => s.combination);
  const isDivisionEmpty = checkColumnEmpty('Division', s => s.division);

  // ===== HEADERS =====
  const baseHeaders = ['No', 'Student Name'];
  if (!isIndexEmpty) baseHeaders.push('Index Number');
  if (!isCombinationEmpty) baseHeaders.push('Combination');
  baseHeaders.push(...subjectNames);
  baseHeaders.push('Total Marks', 'Average');
  if (!isDivisionEmpty) baseHeaders.push('Division');
  baseHeaders.push('Position');

  // ===== ROWS =====
  const tableData = results.map((student, index) => {
    const row = [index + 1, student.studentName || ''];

    if (!isIndexEmpty) row.push(student.studentNumber || '');
    if (!isCombinationEmpty) row.push(student.combination || '');

    subjectNames.forEach(subject => {
      const subj = student.subjects?.[subject];
      row.push(getSubjectMarks(subj));
    });

    row.push(student.totalMarks || 0);
    row.push(student.average || 0);
    if (!isDivisionEmpty) row.push(student.division || '');
    row.push(student.positionText || '');

    return row;
  });

  // ===== COLUMN WIDTHS =====
  const fixedWidths = {
    'No': 12,
    'Student Name': 45,
  };
  if (!isIndexEmpty) fixedWidths['Index Number'] = 25;
  if (!isCombinationEmpty) fixedWidths['Combination'] = 30;
  if (!isDivisionEmpty) fixedWidths['Division'] = 22;

  const subjectWidth = Math.max(18, Math.min(25, (pageWidth - 200) / subjectNames.length));
  subjectNames.forEach(subj => (fixedWidths[subj] = subjectWidth));

  fixedWidths['Total Marks'] = 22;
  fixedWidths['Average'] = 18;
  fixedWidths['Position'] = 22;

  // ===== TABLE (reduced spacing) =====
  doc.autoTable({
    head: [baseHeaders],
    body: tableData,
    startY: 33, // Adjusted to leave room for “Generated on”
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    columnStyles: {
      'No': { halign: 'center', cellWidth: fixedWidths['No'] },
      'Student Name': { halign: 'left', cellWidth: fixedWidths['Student Name'] },
      'Index Number': { halign: 'center', cellWidth: fixedWidths['Index Number'] },
      'Combination': { halign: 'center', cellWidth: fixedWidths['Combination'] },
      'Total Marks': { halign: 'center', cellWidth: fixedWidths['Total Marks'] },
      'Average': { halign: 'center', cellWidth: fixedWidths['Average'] },
      'Division': { halign: 'center', cellWidth: fixedWidths['Division'] },
      'Position': { halign: 'center', cellWidth: fixedWidths['Position'] },
    },
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
    },
  });

  // ===== SAVE FILE =====
  const fileName = `Term_Results_${className || 'Class'}_${termName || 'Term'}_${new Date()
    .toISOString()
    .split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default generateTermResultsPDF;
