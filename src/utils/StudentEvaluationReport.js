import jsPDF from "jspdf";
import "jspdf-autotable";

const COLORS = {
  primary: { main: [41, 128, 185] },
  text: { dark: [44, 62, 80], light: [236, 240, 241] },
};

const generateStudentEvaluationReport = (report) => {
  if (!report) return;

  try {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ST. MARY'S JUNIOR SEMINARY - VISIGA", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text("TATHMINI YA MWENDENDO WA MSEMINARI", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 10;
    doc.setDrawColor(...COLORS.primary.main);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, pageWidth - 15, currentY);

    // ===== STUDENT INFORMATION =====
    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TAARIFA ZA MSEMINARI", 15, currentY);

    currentY += 8;
    const info = [
      ["Seminarian Name:", report.studentName || "NOT ASSIGNED"],
      ["Term:", report.termName || "N/A"],
      
    ];

    doc.setFontSize(10);
    info.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, currentY);
      currentY += 6;
    });

    currentY += 5;

    // ===== EVALUATION GRID =====
    const sections = [
      {
        title: "MAISHA YA KIROHO",
        field: "spiritualLife",
        items: [
          "Ushiriki wake katika Misa, Ibada mbalimbali, na mazoezi ya kiroho.",
          "Ushiriki katika vikundi mbalimbali vya sala.",
          "Kuongoza sala, kuimba, kushiriki Misa na kusoma Neno la Mungu.",
          "Kuwa na nidhamu na heshima kanisani.",
        ],
      },
      {
        title: "MAISHA YA KITAALUMA",
        field: "academicLife",
        items: [
          "Kuhudhuria darasani na kutumia muda vizuri.",
          "Kufanya mazoezi na majaribio kwa wakati.",
          "Utulivu, umakini, usikivu na ushiriki darasani.",
          "Bidii ya kuzungumza Kiingereza.",
        ],
      },
      {
        title: "KAZI ZA MIKONO",
        field: "manualWork",
        items: [
          "Kufika kazini kwa wakati akiwa na vifaa sahihi.",
          "Bidii na juhudi katika kazi.",
          "Kufanya kazi nzuri.",
          "Moyo wa kujitolea katika kazi.",
          "Utiifu na kufanya kazi kwa wakati.",
        ],
      },
      {
        title: "AFYA",
        field: "health",
        items: [
          "Kuzingatia usafi wa mwili, mavazi na kupasi nguo.",
          "Uwepesi wa kwenda zahanati anapoumwa.",
          "Kutumia dawa kwa wakati na kwa ukamilifu.",
        ],
      },
      {
        title: "UONGOZI",
        field: "leadershipSkills",
        items: [
          "Kipaji cha kuwa kiongozi bora.",
          "Kushawishi wenzake kufuata sheria.",
          "Kuheshimu na kushirikiana na viongozi.",
        ],
      },
      {
        title: "MICHEZO",
        field: "sports",
        items: [
          "Kupenda kushiriki michezo (mpira, mazoezi, kukimbia).",
          "Kushiriki sanaa mbalimbali.",
          "Kutunza vifaa vya michezo.",
        ],
      },
    ];

    const columns = 3;
    const marginX = 15;
    const sectionWidth = (pageWidth - 2 * marginX - (columns - 1) * 5) / columns;

    for (let i = 0; i < sections.length; i += columns) {
      if (currentY > pageHeight - 100) {
        doc.addPage();
        currentY = 20;
      }

      let maxHeight = 0;
      const sectionRow = sections.slice(i, i + columns);

      sectionRow.forEach((section) => {
        const textHeights =
          section.items.reduce((sum, item) => {
            const lines = doc.splitTextToSize(item, sectionWidth - 10).length;
            return sum + lines * 3;
          }, 0) + 20;
        maxHeight = Math.max(maxHeight, textHeights);
      });

      sectionRow.forEach((section, index) => {
        const x = marginX + index * (sectionWidth + 5);
        const y = currentY;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(section.title, x + 2, y);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y + 2, sectionWidth, maxHeight);

        let textY = y + 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        section.items.forEach((item) => {
          const wrappedText = doc.splitTextToSize(`• ${item}`, sectionWidth - 8);
          doc.text(wrappedText, x + 4, textY);
          textY += wrappedText.length * 3;
        });

        const grade = report[section.field] || "?";
        const gradeX = x + sectionWidth - 10;
        const gradeY = y + maxHeight - 10;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.circle(gradeX, gradeY, 6);
        if (grade === "A") doc.setFillColor(76, 175, 80);
        else if (grade === "B") doc.setFillColor(33, 150, 243);
        else if (grade === "F") doc.setFillColor(244, 67, 54);
        else doc.setFillColor(158, 158, 158);
        doc.circle(gradeX, gradeY, 6, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(grade, gradeX, gradeY + 1, { align: "center" });
        doc.setTextColor(0, 0, 0);
      });

      currentY += maxHeight + 8;
    }

    // ===== RECTOR'S COMMENTS (NEW PAGE) =====
    if (report.rectorComments) {
      doc.addPage();
      currentY = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("RECTOR'S COMMENTS", pageWidth / 2, currentY, { align: "center" });

      currentY += 10;
      doc.setLineWidth(0.3);
      doc.line(15, currentY, pageWidth - 15, currentY);
      currentY += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const wrappedText = doc.splitTextToSize(report.rectorComments, pageWidth - 30);
      doc.text(wrappedText, 20, currentY);
      currentY += wrappedText.length * 5;
    }

    // ===== FINANCIAL INFO (NEW PAGE with Payment Instructions + Grade Legend) =====
    const financialData = [];
    const financialFields = [
      { key: "debts", label: "Deni la muhula uliopita" },
      { key: "firstTermFee", label: "Ada ya muhula wa kwanza" },
      { key: "secondTermFee", label: "Ada ya muhula wa pili" },
      { key: "firstTermExamFee", label: "Mchango wa Mitihani Muhula wa kwanza" },
      { key: "secondTermExamFee", label: "Mchango wa mitihani muhula wa pili" },
      { key: "firstTermOtherContribution", label: "Michango mingineyo muhula wa kwanza" },
      { key: "secondTermOtherContribution", label: "Michango  mingineyo muhula wa pili" },
    ];

    financialFields.forEach((f) => {
      if (report[f.key]) financialData.push([f.label, report[f.key]]);
    });

    if (financialData.length > 0) {
      doc.addPage();
      currentY = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("TAARIFA ZA KIFEDHA", pageWidth / 2, currentY, { align: "center" });

      currentY += 10;
      doc.autoTable({
        startY: currentY,
        head: [["Maelezo", "Kiasi (TZS)"]],
        body: financialData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: { 0: { cellWidth: 100 }, 1: { halign: "center" } },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // ===== PAYMENT INSTRUCTIONS =====
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("MAELEKEZO YA MALIPO:", 15, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const instructions = [
        "• Malipo yote yafanyike kwenye akaunti ya Seminari.",
        "• Hakikisha unapokea risiti ya malipo.",
        "• Wasiliana na ofisi ya fedha kwa maelekezo zaidi.",
        "• Malipo ya ada ya muhula yafanyike kabla ya kuanza kwa muhula.",
      ];
      instructions.forEach((line) => {
        doc.text(line, 20, currentY);
        currentY += 6;
      });

      currentY += 8;

      // ===== GRADE LEGEND ON SAME PAGE =====
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("MAANA YA MADARAJA", 15, currentY);
      currentY += 8;

      const legend = [
        { grade: "A", meaning: "Excellent (Vizuri)", color: [76, 175, 80] },
        { grade: "B", meaning: "Good (Wastani)", color: [33, 150, 243] },
        { grade: "F", meaning: "Poor (Dhaifu)", color: [244, 67, 54] },
      ];

      legend.forEach((item, i) => {
        const x = 20 + i * 55;
        const y = currentY + 5;
        doc.setDrawColor(0, 0, 0);
        doc.circle(x, y, 5);
        doc.setFillColor(...item.color);
        doc.circle(x, y, 5, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(item.grade, x, y + 1, { align: "center" });
        doc.setTextColor(0, 0, 0);
        doc.text(`= ${item.meaning}`, x + 10, y + 1);
      });

      currentY += 25;
      const explanation =
        "Note: Kulingana na sheria za semianri, kupata 'F' kwenye Maisha ya kiroho au Tabia inaashiria changamoto kubwa katika malezi";
      const wrap = doc.splitTextToSize(explanation, pageWidth - 30);
      doc.setFontSize(9);
      doc.text(wrap, 20, currentY);
    }

    // ===== FOOTER =====
    const totalPages = doc.internal.getNumberOfPages();
    for (let n = 1; n <= totalPages; n++) {
      doc.setPage(n);
      const pageNum = `${n} / ${totalPages}`;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.text(
        "St. Mary's Junior Seminary - Visiga | Confidential Seminarian Report",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 5, { align: "center" });
    }

    const fileName = `Seminarian_Evaluation_${report.studentName
      ?.replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "") || "Unknown"}_${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;

    doc.save(fileName);
    return fileName;
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};

export default generateStudentEvaluationReport;
