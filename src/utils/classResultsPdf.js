import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateClassResultsPDF = (groupedResults, className, examinationType) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("ST. MARY'S JUNIOR SEMINARY - VISIGA", pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('CLASS RESULTS REPORT', pageWidth / 2, 23, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Class: ${className || ''}`, 20, 30);
  doc.text(`Examination: ${examinationType || ''}`, pageWidth - 60, 30);

  // ────────────── Column checks ──────────────
  const checkColumnEmpty = (columnKey, getValue) => {
    return groupedResults.every(student => {
      const value = getValue(student);
      return !value || value === 'N/A' || value === '' || value === null || value === undefined;
    });
  };

  const isIndexEmpty = checkColumnEmpty('Index', (student) => student.studentNumber);
  const isCombinationEmpty = checkColumnEmpty('Combination', (student) => student.combination);
  const isDivisionEmpty = checkColumnEmpty('Division', (student) => student.division);

  // ────────────── Subjects ──────────────
  const subjectSet = new Set();
  groupedResults.forEach((student) => {
    Object.keys(student.subjects || {}).forEach((subj) => subjectSet.add(subj));
  });
  const subjectNames = Array.from(subjectSet);

  const getSubjectMarks = (subj) => subj?.final?.value || '';

  // ────────────── Headers ──────────────
  const baseHeaders = ['No', 'Student Name'];
  if (!isIndexEmpty) baseHeaders.push('Index Number');
  if (!isCombinationEmpty) baseHeaders.push('Combination');
  baseHeaders.push(...subjectNames);
  baseHeaders.push('Total Marks', 'Average');
  if (!isDivisionEmpty) baseHeaders.push('Division');
  baseHeaders.push('Position');

  // ────────────── Rows ──────────────
  const tableData = groupedResults.map((student, index) => {
    const rowData = [index + 1, student.studentName || ''];

    if (!isIndexEmpty) rowData.push(student.studentNumber || '');
    if (!isCombinationEmpty) rowData.push(student.combination || '');

    subjectNames.forEach((subject) => {
      const subj = student.subjects?.[subject];
      rowData.push(getSubjectMarks(subj));
    });

    rowData.push(student.totalMarks || 0);
    rowData.push(student.average || 0);

    if (!isDivisionEmpty) rowData.push(student.division || '');
    rowData.push(student.position || '');

    return rowData;
  });

  // ────────────── Widths ──────────────
  const fixedWidths = {
    'No': 15,
    'Student Name': 50,
  };
  if (!isIndexEmpty) fixedWidths['Index Number'] = 25;
  if (!isCombinationEmpty) fixedWidths['Combination'] = 30;
  if (!isDivisionEmpty) fixedWidths['Division'] = 25;

  const subjectWidth = Math.max(20, Math.min(30, (pageWidth - 200) / subjectNames.length));
  subjectNames.forEach(subject => (fixedWidths[subject] = subjectWidth));

  fixedWidths['Total Marks'] = 25;
  fixedWidths['Average'] = 20;
  fixedWidths['Position'] = 25;

  // ────────────── Table ──────────────
  doc.autoTable({
    head: [baseHeaders],
    body: tableData,
    startY: 37, // ✅ Reduced from 55 → tighter spacing between header and table
    styles: {
      fontSize: 8,
      cellPadding: 2,
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
      fillColor: [245, 245, 245],
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
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
    },
  });

  // ────────────── Save ──────────────
  const fileName = `Class_Results_${className || 'Class'}_${examinationType || 'Exam'}_${new Date()
    .toISOString()
    .split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default generateClassResultsPDF;
