import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateClassResultsPDF = (groupedResults, className, examinationType) => {
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Set up the document
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ST. MARY\'S JUNIOR SEMINARY - VISIGA', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('CLASS RESULTS REPORT', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Class: ${className || ''}`, 20, 35);
  doc.text(`Examination: ${examinationType || ''}`, pageWidth - 60, 35);
  
  // Get current date
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Generated on: ${currentDate}`, pageWidth - 60, 45);
  
  // Check if Index, Combination, and Division columns should be shown
  const checkColumnEmpty = (columnKey, getValue) => {
    return groupedResults.every(student => {
      const value = getValue(student);
      return !value || value === 'N/A' || value === '' || value === null || value === undefined;
    });
  };
  
  const isIndexEmpty = checkColumnEmpty('Index', (student) => student.studentNumber);
  const isCombinationEmpty = checkColumnEmpty('Combination', (student) => student.combination);
  const isDivisionEmpty = checkColumnEmpty('Division', (student) => student.division);
  
  // Collect all subject names
  const subjectSet = new Set();
  groupedResults.forEach((student) => {
    Object.keys(student.subjects || {}).forEach((subj) => {
      subjectSet.add(subj);
    });
  });
  
  const subjectNames = Array.from(subjectSet);
  
  // Helper function to get subject marks for PDF
  const getSubjectMarks = (subj) => {
    if (!subj || !subj.final?.value) return '';
    return subj.final.value;
  };
  
  // Prepare headers
  const baseHeaders = ["No", "Student Name"];
  if (!isIndexEmpty) { baseHeaders.push("Index Number"); }
  if (!isCombinationEmpty) { baseHeaders.push("Combination"); }
  baseHeaders.push(...subjectNames);
  baseHeaders.push("Total Marks", "Average");
  if (!isDivisionEmpty) { baseHeaders.push("Division"); }
  baseHeaders.push("Position");
  
  // Prepare data rows
  const tableData = groupedResults.map((student, index) => {
    const rowData = [index + 1, student.studentName || ''];
    
    if (!isIndexEmpty) { 
      rowData.push(student.studentNumber || ''); 
    }
    
    if (!isCombinationEmpty) { 
      rowData.push(student.combination || ''); 
    }
    
    // Add subject marks
    subjectNames.forEach(subject => {
      const subj = student.subjects?.[subject];
      const marks = getSubjectMarks(subj);
      rowData.push(marks);
    });
    
    // Add summary data
    rowData.push(student.totalMarks || 0);
    rowData.push(student.average || 0);
    
    if (!isDivisionEmpty) { 
      rowData.push(student.division || ''); 
    }
    
    rowData.push(student.position || '');
    
    return rowData;
  });
  
  // Set up column widths
  const fixedWidths = { 
    'No': 15, 
    'Student Name': 50 
  };
  
  if (!isIndexEmpty) { 
    fixedWidths['Index Number'] = 25; 
  }
  
  if (!isCombinationEmpty) { 
    fixedWidths['Combination'] = 30; 
  }
  
  if (!isDivisionEmpty) { 
    fixedWidths['Division'] = 25; 
  }
  
  // Calculate dynamic widths for subjects
  const subjectWidth = Math.max(20, Math.min(30, (pageWidth - 200) / subjectNames.length));
  subjectNames.forEach(subject => {
    fixedWidths[subject] = subjectWidth;
  });
  
  fixedWidths['Total Marks'] = 25;
  fixedWidths['Average'] = 20;
  fixedWidths['Position'] = 25;
  
  // Generate the table
  doc.autoTable({
    head: [baseHeaders],
    body: tableData,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      'No': { halign: 'center', cellWidth: fixedWidths['No'] },
      'Student Name': { halign: 'left', cellWidth: fixedWidths['Student Name'] },
      'Index Number': { halign: 'center', cellWidth: fixedWidths['Index Number'] },
      'Combination': { halign: 'center', cellWidth: fixedWidths['Combination'] },
      'Total Marks': { halign: 'center', cellWidth: fixedWidths['Total Marks'] },
      'Average': { halign: 'center', cellWidth: fixedWidths['Average'] },
      'Division': { halign: 'center', cellWidth: fixedWidths['Division'] },
      'Position': { halign: 'center', cellWidth: fixedWidths['Position'] }
    },
    didDrawPage: (data) => {
      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
    }
  });
  
  // Add footer information
  const finalY = doc.lastAutoTable.finalY || 55;
  const footerY = Math.min(finalY + 20, pageHeight - 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Report Summary:', 20, footerY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Students: ${groupedResults.length}`, 20, footerY + 8);
  
  // Calculate statistics
  const studentsWithResults = groupedResults.filter(student => 
    Object.values(student.subjects || {}).some(subj => subj?.final?.value && subj.final.value > 0)
  );
  
  if (studentsWithResults.length > 0) {
    const totalMarks = studentsWithResults.reduce((sum, student) => sum + (student.totalMarks || 0), 0);
    const averageMarks = totalMarks / studentsWithResults.length;
    
    doc.text(`Students with Results: ${studentsWithResults.length}`, 20, footerY + 16);
    doc.text(`Average Total Marks: ${averageMarks.toFixed(1)}`, 20, footerY + 24);
  }
  
  // Add legend
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Legend:', pageWidth - 60, footerY);
  
  doc.setFont('helvetica', 'normal');
  doc.text('• Marks: Individual subject marks', pageWidth - 60, footerY + 8);
  doc.text('• Total: Sum of all subject marks', pageWidth - 60, footerY + 16);
  doc.text('• Average: Total marks divided by subjects', pageWidth - 60, footerY + 24);
  doc.text('• Position: Student ranking in class', pageWidth - 60, footerY + 32);
  
  // Save the PDF
  const fileName = `Class_Results_${className || 'Class'}_${examinationType || 'Exam'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default generateClassResultsPDF;

