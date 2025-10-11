import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  useTheme,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import * as image from "../../assets";
import useStudentEvaluationService from "../../api/services/StudentEvaluationService";
import PrintIcon from "@mui/icons-material/Print";
import generateStudentEvaluationReport from "../../utils/StudentEvaluationReport";

const StudentEvaluationReport = () => {
  const { studentId, termId } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "white" : "black";
  const colors = tokens(theme.palette.mode);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getEvaluationByTermIdAndStudentId } = useStudentEvaluationService();

  const handlePrint = () => {
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
          max-width: none;
          margin: 0;
          padding: 10px;
          background: white !important;
          color: black !important;
          font-size: 10px;
          line-height: 1.2;
        }
        .printable-content * {
          color: black !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .printable-content .MuiBox-root {
          page-break-inside: avoid;
          margin-bottom: 8px;
        }
        .printable-content .MuiTypography-root {
          color: black !important;
        }
        .printable-content .MuiTable-root {
          border-collapse: collapse;
          width: 100%;
          font-size: 9px;
        }
        .printable-content .MuiTableCell-root {
          border: 1px solid black !important;
          padding: 4px;
          background: white !important;
          color: black !important;
          font-size: 9px;
        }
        .printable-content .MuiTableHead-root .MuiTableCell-root {
          background: #f0f0f0 !important;
          font-weight: bold;
          font-size: 9px;
        }
        .printable-content .MuiCard-root {
          border: 1px solid black !important;
          background: white !important;
          margin-bottom: 8px;
          padding: 8px;
        }
        .printable-content .MuiButton-root {
          display: none !important;
        }
        .printable-content h1, .printable-content h2, .printable-content h3, .printable-content h4, .printable-content h5, .printable-content h6 {
          font-size: 12px !important;
          margin: 5px 0 !important;
        }
        .printable-content .MuiTypography-h4 {
          font-size: 11px !important;
          margin: 5px 0 !important;
        }
        .printable-content .MuiTypography-h6 {
          font-size: 10px !important;
          margin: 3px 0 !important;
        }
        .printable-content .MuiTypography-body1 {
          font-size: 9px !important;
          line-height: 1.2 !important;
        }
        .printable-content .MuiTypography-body2 {
          font-size: 8px !important;
          line-height: 1.2 !important;
        }
        @page {
          margin: 0.3in;
          size: A4;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    window.print();
    document.head.removeChild(styleSheet);
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await getEvaluationByTermIdAndStudentId(termId, studentId);
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

  // Financial data configuration
  const financialData = [
    {
      description: "Deni",
      field: "debts",
      amount: report?.debts || 0,
    },
    {
      description: "Ada ya Muhula wa Kwanza",
      field: "firstTermFee",
      amount: report?.firstTermFee || 0,
    },
    {
      description: "Ada ya Muhula wa Pili",
      field: "secondTermFee",
      amount: report?.secondTermFee || 0,
    },
    {
      description: "Mchango wa Mitihani ya muhula wa Kwanza",
      field: "firstTermExamFee",
      amount: report?.firstTermExamFee || 0,
    },
    {
      description: "Mchango  wa Mitihani ya muhula Pili",
      field: "secondTermExamFee",
      amount: report?.secondTermExamFee || 0,
    },
    {
      description: "Michango mingine ya Muhula wa Kwanza",
      field: "firstTermOtherContribution",
      amount: report?.firstTermOtherContribution || 0,
    },
    {
      description: "Michango Mingine ya Muhula wa Pili",
      field: "secondTermOtherContribution",
      amount: report?.secondTermOtherContribution || 0,
    },
  ];

  // Calculate totals
  const totalAmount = financialData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const hasFinancialData = financialData.some(item => parseFloat(item.amount) > 0);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount) || 0);
  };

  return (
    <Box 
      className="printable-content"
      sx={{ 
        ml: "20px",
        mr: "20px",
        "@media print": {
          ml: 0,
          mr: 0,
          width: "100%",
          maxWidth: "none",
          padding: "10px",
          backgroundColor: "white",
          color: "black",
          fontSize: "10px",
          lineHeight: 1.2,
          "& *": {
            color: "black !important",
            backgroundColor: "transparent !important",
            boxShadow: "none !important",
          },
          "& .MuiBox-root": {
            pageBreakInside: "avoid",
            marginBottom: "8px",
          },
          "& .MuiTypography-root": {
            color: "black !important",
          },
          "& .MuiTable-root": {
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "9px",
          },
          "& .MuiTableCell-root": {
            border: "1px solid black !important",
            padding: "4px",
            background: "white !important",
            color: "black !important",
            fontSize: "9px",
          },
          "& .MuiTableHead-root .MuiTableCell-root": {
            background: "#f0f0f0 !important",
            fontWeight: "bold",
            fontSize: "9px",
          },
          "& .MuiCard-root": {
            border: "1px solid black !important",
            background: "white !important",
            marginBottom: "8px",
            padding: "8px",
          },
          "& .MuiButton-root": {
            display: "none !important",
          },
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            fontSize: "12px !important",
            margin: "5px 0 !important",
          },
          "& .MuiTypography-h4": {
            fontSize: "11px !important",
            margin: "5px 0 !important",
          },
          "& .MuiTypography-h6": {
            fontSize: "10px !important",
            margin: "3px 0 !important",
          },
          "& .MuiTypography-body1": {
            fontSize: "9px !important",
            lineHeight: "1.2 !important",
          },
          "& .MuiTypography-body2": {
            fontSize: "8px !important",
            lineHeight: "1.2 !important",
          },
        },
      }}
    >
      {/* Print and Download Buttons */}
      <Box 
        sx={{ 
          mb: 2, 
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          "@media print": { display: "none" },
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: colors.blueAccent[500],
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
        >
          Print Report
        </Button>
        <Button
          variant="contained"
          onClick={() => generateStudentEvaluationReport(report)}
          sx={{
            backgroundColor: "#502eccff",
            "&:hover": {
              backgroundColor: "#3d2399",
            },
          }}
        >
          📄 Download PDF
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
          "@media print": {
            border: "1px solid black",
            pageBreakInside: "avoid",
            marginBottom: "10px",
            padding: "5px",
            backgroundColor: "white",
            "& *": {
              color: "black !important",
              backgroundColor: "transparent !important",
            },
            "& .MuiTypography-root": {
              fontSize: "8px !important",
              lineHeight: "1.1 !important",
            },
            "& img": {
              width: "40px !important",
              height: "40px !important",
            },
          },
        }}
      >
        {/* Left Section */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          borderRight={{ xs: "none", md: `1px solid ${borderColor}` }}
          p={1}
          overflow="hidden"
          justifyContent="center"
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            textAlign={{ xs: "center", md: "left" }}
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
              sx={{ fontSize: { xs: "0.7rem", sm: "1.1rem", md: "1.5rem" } }}
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
          borderRight={{ xs: "none", md: `1px solid ${borderColor}` }}
          p={2}
          textAlign="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.4rem" } }}
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
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            textAlign={{ xs: "center", md: "left" }}
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
              sx={{ fontSize: { xs: "0.7rem", sm: "1.1rem", md: "1.5rem" } }}
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
          {/* === Simplified Profile Section (No Avatar) === */}
          <Box 
            display="flex" 
            flexDirection="column" 
            mb={3}
                sx={{ 
              "@media print": {
                marginBottom: "8px",
                "& .MuiTypography-root": {
                  fontSize: "9px !important",
                  lineHeight: "1.2 !important",
                },
              },
            }}
          >
            <Typography variant="body1">
              <Box
                component="span"
                sx={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "bold",
                  "@media print": {
                    fontSize: "9px !important",
                  }
                }}
              >
                <strong>JINA LA MSEMINARI :</strong>{" "}
            </Box>
              <Box
                component="span"
                sx={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "bold",
                  "@media print": {
                    fontSize: "9px !important",
                  }
                }}
              >
                {report.studentName || "NOT ASSIGNED"}
                </Box>
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 1 }}>
              <Box 
                component="span" 
                sx={{ 
                  fontSize: "1.2rem",
                  "@media print": {
                    fontSize: "9px !important",
                  }
                }}
              >
                <strong>TERM :</strong> {report.termName || "N/A"}
                </Box>
              </Typography>
          </Box>

          <Box>
            <Typography variant="h4" align="left">
              STUDENT EVALUATION REPORT
            </Typography>
          </Box>

          {/* === Enhanced Rector's Comments in Letter Format === */}
          {report.rectorComments && (
            <Card
              sx={{
                p: 3,
                mb: 4,
                mt: 3,
                backgroundColor: colors.primary[400],
                border: `1px solid ${borderColor}`,
                "@media print": {
                  backgroundColor: "white",
                  border: "1px solid black",
                  pageBreakInside: "avoid",
                },
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                align="center"
                sx={{ 
                  mb: 2, 
                  textDecoration: "underline",
                  color: colors.greenAccent[600],
                  fontSize: "1.2rem"
                }}
              >
                MAONI YA RECTOR
              </Typography>

              <Box sx={{ pl: { xs: 2, md: 4 }, pr: { xs: 2, md: 4 } }}>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "justify",
                    whiteSpace: "pre-line",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    fontFamily: "serif",
                    mb: 3,
                  }}
                >
                  {report.rectorComments}
                </Typography>

                <Box sx={{ mt: 4, textAlign: "right" }}>
                  <Typography sx={{ fontStyle: "italic", mb: 1 }}>
                    Yours faithfully,
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography sx={{ fontWeight: "bold", mt: 2 }}>
                    Rector
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    St. Mary's Junior Seminary – Visiga
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: colors.grey[600] }}>
                    Archdiocese of Dar es Salaam
                  </Typography>
                </Box>
              </Box>
            </Card>
          )}

          {/* Evaluation Sections */}
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gridAutoRows="auto"
            gap="20px"
            mt={2}
            sx={{
              "@media print": {
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                pageBreakInside: "avoid",
                "& .MuiBox-root": {
                  backgroundColor: "white !important",
                  border: "1px solid black !important",
                  padding: "10px",
                  marginBottom: "10px",
                  "& *": {
                    color: "black !important",
                    backgroundColor: "transparent !important",
                  },
                },
              },
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
                  "@media print": {
                    backgroundColor: "white",
                    border: "1px solid black",
                    pageBreakInside: "avoid",
                    marginBottom: "10px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ 
                    mb: 1, 
                    color: colors.greenAccent[600],
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  {section.title}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box display="flex" flexDirection="column" gap={1} flex={1}>
                  {section.items.map((item, idx) => (
                    <Typography 
                      key={idx}
                      sx={{ 
                        fontSize: "0.85rem",
                        lineHeight: 1.3,
                      }}
                    >
                      • {item}
                    </Typography>
                  ))}
                </Box>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Typography
                    sx={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      backgroundColor:
                        report[section.field] === "A"
                          ? colors.greenAccent[500]
                          : report[section.field] === "B"
                          ? colors.blueAccent[500]
                          : report[section.field] === "F"
                          ? colors.redAccent[500]
                          : colors.grey[500],
                      color: "white",
                    }}
                  >
                    {report[section.field] || "?"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Enhanced Financial Information Section */}
          {hasFinancialData && (
            <Box mt={4}>
              <Typography 
                variant="h4" 
                align="left" 
              sx={{
                  mb: 3,
                  color: colors.greenAccent[600],
                  "@media print": {
                    color: 'black',
                    fontWeight: 'bold'
                  }
                }}
              >
                TAARIFA ZA KIFEDHA
              </Typography>
              
              <TableContainer 
                component={Paper}
                sx={{ 
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${borderColor}`,
                  mb: 3,
                  "@media print": {
                    backgroundColor: "white",
                    border: "1px solid black",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                    fontWeight: 'bold',
                          backgroundColor: colors.primary[400],
                          color: colors.greenAccent[600],
                          fontSize: '1rem',
                          border: `1px solid ${borderColor}`,
                          "@media print": {
                            backgroundColor: 'white',
                            color: 'black',
                            border: '1px solid black',
                          }
                        }}
                      >
                        Maelezo
                      </TableCell>
                      <TableCell 
                        align="right"
                sx={{
                          fontWeight: 'bold', 
                          backgroundColor: colors.primary[400],
                          color: colors.greenAccent[600],
                          fontSize: '1rem',
                          border: `1px solid ${borderColor}`,
                          "@media print": {
                            backgroundColor: 'white',
                            color: 'black',
                            border: '1px solid black',
                          }
                        }}
                      >
                        Kiasi (TZS)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financialData.map((item, index) => (
                      parseFloat(item.amount) > 0 && (
                        <TableRow 
                          key={index}
                    sx={{
                            backgroundColor: colors.primary[400],
                            border: `1px solid ${borderColor}`,
                            "@media print": {
                        backgroundColor: 'white',
                        border: '1px solid black',
                      }
                    }}
                  >
                          <TableCell 
                            component="th" 
                            scope="row"
                      sx={{ 
                              fontWeight: 'medium',
                              backgroundColor: colors.primary[400],
                        color: colors.greenAccent[600], 
                              border: `1px solid ${borderColor}`,
                              "@media print": {
                                backgroundColor: 'white',
                                border: '1px solid black',
                                color: 'black'
                              }
                            }}
                          >
                            {item.description}
                          </TableCell>
                          <TableCell 
                            align="right"
                      sx={{
                              fontWeight: 'bold',
                              backgroundColor: colors.primary[400],
                              color: colors.greenAccent[600],
                              border: `1px solid ${borderColor}`,
                              "@media print": {
                                backgroundColor: 'white',
                                border: '1px solid black',
                          color: 'black'
                        }
                      }}
                    >
                            {formatCurrency(item.amount)}
                          </TableCell>
                        </TableRow>
                      )
                    ))}
                    {/* Total Row */}
                    <TableRow
                      sx={{
                        backgroundColor: colors.primary[400],
                        border: `2px solid ${borderColor}`,
                        '& td': {
                          fontWeight: 'bold',
                          backgroundColor: colors.primary[400],
                          color: colors.greenAccent[600],
                          fontSize: '1.1rem',
                          border: `1px solid ${borderColor}`,
                          "@media print": {
                            backgroundColor: 'white',
                            color: 'black',
                            border: '1px solid black',
                          }
                        }
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>JUMLA</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Additional Financial Notes */}
              <Box
            sx={{
                  p: 2,
                  backgroundColor: colors.primary[400],
                  border: `1px solid ${borderColor}`,
                  borderRadius: 1,
                  "@media print": {
                    backgroundColor: 'white',
                    border: "1px solid black",
                  },
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 1,
                    color: colors.greenAccent[600],
                    "@media print": {
                      color: 'black',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  Maelekezo ya Malipo:
                </Typography>
            <Typography 
                  variant="body2" 
              sx={{ 
                    fontStyle: 'italic',
                    "@media print": {
                  color: 'black'
                }
              }}
            >
                  • Malipo yote yafanyike kwenye akaunti ya Seminari<br/>
                  • Hakikisha unapokea risiti ya malipo<br/>
                  • Wasiliana na ofisi ya fedha kwa maelekezo zaidi<br/>
                  • Malipo ya ada ya muhula yafanyike kabla ya kuanza kwa muhula
                </Typography>
              </Box>
            </Box>
          )}

          {/* Legend */}
          <Box mt={3}>
            <Typography variant="h4" align="left" sx={{ mb: 2 }}>
              MAANA YA MADARAJA
            </Typography>
            <Box
              backgroundColor={colors.primary[400]}
              p={3}
              borderRadius={1}
              border={`1px solid ${borderColor}`}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2, color: colors.greenAccent[600] }}
              >
                MAANA YA MADARAJA:
              </Typography>
              <Box display="flex" gap={3} mb={2} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: colors.greenAccent[500],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
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
                      borderRadius: "50%",
                      backgroundColor: colors.blueAccent[500],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
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
                      borderRadius: "50%",
                      backgroundColor: colors.redAccent[500],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    F
                  </Box>
                  <Typography>= Dhaifu</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                Kwa mujibu wa sheria na taratibu za Seminari, kupata "F" kwenye
                kipengele cha Maisha ya Kiroho au Tabia kunaweza kuashiria
                changamoto kubwa kwa malezi.
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