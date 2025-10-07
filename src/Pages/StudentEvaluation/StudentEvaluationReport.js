import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import * as image from "../../assets";
import useStudentEvaluationService from "../../api/services/StudentEvaluationService";
import PrintIcon from "@mui/icons-material/Print";

const StudentEvaluationReport = () => {
  const { studentId, termId } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "white" : "black";
  const colors = tokens(theme.palette.mode);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getEvaluationByTermIdAndStudentId } = useStudentEvaluationService();

  const handlePrint = () => {
    // Add print-specific styles
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        .printable-content, .printable-content * {
          visibility: visible;
        }
        .printable-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        @page {
          margin: 0.5in;
          size: A4;
        }
      }
    `;
    
    // Create and inject print styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
    
    // Clean up
    document.head.removeChild(styleSheet);
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await getEvaluationByTermIdAndStudentId(termId, studentId);
        console.log("Student evaluation data:", data);
        console.log("Student photo URL:", data.studentPhotoUrl);
        console.log("Student name:", data.studentName);
        console.log("All data fields:", Object.keys(data));
        setReport(data);
      } catch (error) {
        console.error("Error loading student evaluation report:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (termId && studentId) {
      loadReport();
    }
  }, [termId, studentId]);

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

  return (
    <Box 
      className="printable-content"
      sx={{ 
        ml: '20px', 
        mr: '20px',
        '@media print': {
          ml: 0,
          mr: 0,
          width: '100%',
          maxWidth: 'none',
          padding: '20px',
          backgroundColor: 'white',
          color: 'black',
          '& *': {
            color: 'black !important',
            backgroundColor: 'transparent !important',
            boxShadow: 'none !important',
          }
        }
      }}
    >
      {/* Print Button - Hidden in print */}
      <Box 
        sx={{ 
          mb: 2, 
          display: 'flex', 
          justifyContent: 'flex-end',
          '@media print': { display: 'none' }
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: colors.blueAccent[500],
            '&:hover': {
              backgroundColor: colors.blueAccent[600],
            }
          }}
        >
          Print Report
        </Button>
      </Box>
      {/* Header */}
      <Box
        height="auto"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        border={`2px solid ${borderColor}`}
        mb={3}
        flexWrap="wrap"
        sx={{
          '@media print': {
            border: '2px solid black',
            pageBreakInside: 'avoid',
            marginBottom: '20px'
          }
        }}
      >
        {/* Left Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={1}
          overflow="hidden"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Box
              component="img"
              src={image.visigalogo}
              alt="logo"
              sx={{
                height: 80,
                width: 80,
                mb: { xs: 1, md: 0 },
                mr: { xs: 0, md: 2 },
              }}
            />
            <Typography
              variant="h7"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              St Mary's Junior Seminary (VISIGA SEMINARY)
            </Typography>
          </Box>
        </Box>

        {/* Center Section */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={2}
          textAlign="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.4rem' } }}
          >
            TATHMINI YA MWENDENDO WA MSEMINARI
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          p={1}
          overflow="hidden"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Box
              component="img"
              src={image.cathedral5}
              alt="arch"
              sx={{
                height: 80,
                width: 80,
                mb: { xs: 1, md: 0 },
                mr: { xs: 0, md: 2 },
              }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              Seminary under Archdiocese of Dar es Salaam
            </Typography>
          </Box>
        </Box>
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading report..." />
      ) : report ? (
        <>
          {/* Profile Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Box
                component="img"
                src={
                  report.studentPhotoUrl 
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${report.studentPhotoUrl}` 
                    : report.student?.photoUrl 
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${report.student.photoUrl}`
                    : report.photoUrl
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${report.photoUrl}`
                    : image.books
                }
                alt={report.studentName || 'Student Picture'}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%',
                  border: (report.studentPhotoUrl || report.student?.photoUrl || report.photoUrl) ? '2px solid #ccc' : '2px solid red',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  console.log('Image failed to load, falling back to default');
                  e.target.src = image.books;
                }}
              />
            </Box>
            <Box ml={3} mb={3}>
              <Typography variant="body1">
                <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  <strong>STUDENT :</strong>{' '}
                </Box>
                <Box component="span" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {report.studentName || 'NOT ASSIGNED'}
                </Box>
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 1 }}>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>
                  <strong>TERM :</strong> {report.termName || 'N/A'}
                </Box>
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4" align="start">
              STUDENT EVALUATION REPORT
            </Typography>
          </Box>

          {report.rectorComments && (
            <Card sx={{ p: 2, mb: 3, mt: 2 }}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Maoni ya Rector:
              </Typography>
              <Typography>{report.rectorComments}</Typography>
            </Card>
          )}

          {/* Evaluation Sections */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gridAutoRows="auto"
            gap="20px"
            mt={2}
            sx={{
              '@media print': {
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                pageBreakInside: 'avoid'
              }
            }}
          >
            {sections.map((section, index) => (
              <Box
                key={index}
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                p={2}
                borderRadius={1}
                border={`1px solid ${borderColor}`}
                sx={{
                  '@media print': {
                    backgroundColor: 'white',
                    border: '1px solid black',
                    pageBreakInside: 'avoid',
                    marginBottom: '10px'
                  }
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ 
                    mb: 1, 
                    color: colors.greenAccent[600],
                    fontSize: '1rem',
                    textAlign: 'center'
                  }}
                >
                  {section.title}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  flex={1}
                >
                  {section.items.map((item, idx) => (
                    <Typography 
                      key={idx}
                      sx={{ 
                        fontSize: '0.85rem',
                        lineHeight: 1.3
                      }}
                    >
                      • {item}
                    </Typography>
                  ))}
                </Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  mt={2}
                >
                  <Typography
                    sx={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: "bold",
                      fontSize: '1.2rem',
                      backgroundColor:
                        report[section.field] === "A"
                          ? colors.greenAccent[500]
                          : report[section.field] === "B"
                          ? colors.blueAccent[500]
                          : report[section.field] === "F"
                          ? colors.redAccent[500]
                          : colors.grey[500],
                      color: 'white',
                      boxShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {report[section.field] || "?"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Financial Information */}
          {(report.debts || report.firstTermFee || report.secondTermFee || report.firstTermOtherContribution || report.secondTermOtherContribution) && (
            <Box 
              mt={3}
              sx={{
                '@media print': {
                  pageBreakBefore: 'auto',
                  pageBreakInside: 'avoid'
                }
              }}
            >
              <Typography 
                variant="h4" 
                align="start" 
                sx={{ 
                  mb: 2,
                  '@media print': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'black'
                  }
                }}
              >
                TAARIFA ZA KIFEDHA
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
                gridAutoRows="auto"
                gap="20px"
                sx={{
                  '@media print': {
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px'
                  }
                }}
              >
                {report.debts && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                    sx={{
                      '@media print': {
                        backgroundColor: 'white',
                        border: '1px solid black',
                        pageBreakInside: 'avoid'
                      }
                    }}
                  >
                    <Typography 
                      fontWeight="bold" 
                      sx={{ 
                        color: colors.greenAccent[600], 
                        mb: 1,
                        '@media print': {
                          color: 'black',
                          fontWeight: 'bold'
                        }
                      }}
                    >
                      Deni
                    </Typography>
                    <Typography 
                      sx={{
                        '@media print': {
                          color: 'black'
                        }
                      }}
                    >
                      {report.debts}
                    </Typography>
                  </Box>
                )}
                {report.firstTermFee && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Ada ya Muhula wa Kwanza
                    </Typography>
                    <Typography>{report.firstTermFee}</Typography>
                  </Box>
                )}
                {report.secondTermFee && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Ada ya Muhula wa Pili
                    </Typography>
                    <Typography>{report.secondTermFee}</Typography>
                  </Box>
                )}
                {report.firstTermExamFee && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Ada ya Mtihani wa Kwanza
                    </Typography>
                    <Typography>{report.firstTermExamFee}</Typography>
                  </Box>
                )}
                {report.secondTermExamFee && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Ada ya Mtihani wa Pili
                    </Typography>
                    <Typography>{report.secondTermExamFee}</Typography>
                  </Box>
                )}
                {report.firstTermOtherContribution && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Mchango Mwingine wa Muhula wa Kwanza
                    </Typography>
                    <Typography>{report.firstTermOtherContribution}</Typography>
                  </Box>
                )}
                {report.secondTermOtherContribution && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius={1}
                    border={`1px solid ${borderColor}`}
                  >
                    <Typography fontWeight="bold" sx={{ color: colors.greenAccent[600], mb: 1 }}>
                      Mchango Mwingine wa Muhula wa Pili
                    </Typography>
                    <Typography>{report.secondTermOtherContribution}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Legend */}
          <Box 
            mt={3}
            sx={{
              '@media print': {
                pageBreakBefore: 'auto',
                pageBreakInside: 'avoid'
              }
            }}
          >
            <Typography 
              variant="h4" 
              align="start" 
              sx={{ 
                mb: 2,
                '@media print': {
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'black'
                }
              }}
            >
              MAANA YA MADARAJA
            </Typography>
            <Box
              backgroundColor={colors.primary[400]}
              p={3}
              borderRadius={1}
              border={`1px solid ${borderColor}`}
              sx={{
                '@media print': {
                  backgroundColor: 'white',
                  border: '1px solid black',
                  pageBreakInside: 'avoid'
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: colors.greenAccent[600] }}>
                MAANA YA MADARAJA:
              </Typography>
              <Box display="flex" gap={3} mb={2} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: colors.greenAccent[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    A
                  </Box>
                  <Typography>= Vizuri</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: colors.blueAccent[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    B
                  </Box>
                  <Typography>= Wastani</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: colors.redAccent[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    F
                  </Box>
                  <Typography>= Dhaifu</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: "0.9rem", fontStyle: 'italic' }}>
                Kwa mujibu wa sheria na taratibu za Seminari, kupata "F" kwenye
                kipengele cha Maisha ya Kiroho au Tabia kunaweza kuashiria changamoto
                kubwa kwa malezi.
              </Typography>
            </Box>
          </Box>
          </>
        ) : (
          <Typography textAlign="center" mt={4} color="text.secondary">
            Hakuna taarifa za mwendendo zilizopatikana.
          </Typography>
        )}
    </Box>
  );
};

export default StudentEvaluationReport;
