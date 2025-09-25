import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme, CircularProgress } from "@mui/material";
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useResultService from '../../api/services/ResultsService';
import { toast } from 'react-hot-toast';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Header from "../../components/Header";

const Subject_Results = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { teacherId, subjectId, clazzId, examinationTypeId } = useParams();

  const {
    subject_results,
    fetch_subject_results,
    updateSubjectResultsDetails,
    loadResultsDetails,
  } = useResultService();

  const [editedRows, setEditedRows] = useState({});

  useEffect(() => {
    const loadData = async () => {
      if (teacherId && subjectId && clazzId && examinationTypeId) {
        setIsLoading(true);
        await fetch_subject_results({
          teacherId,
          subjectId,
          clazzId,
          examinationTypeId,
        });
        setIsLoading(false);
      }
    };
    loadData();
  }, [teacherId, subjectId, clazzId, examinationTypeId]);

  const handleSaveAll = async () => {
    if (Object.keys(editedRows).length === 0) return;

    setIsSaving(true);
    try {
      for (const id in editedRows) {
        const originalData = await loadResultsDetails(id);
        const updatedData = { ...originalData, ...editedRows[id] };
        await updateSubjectResultsDetails(updatedData);
      }

      await fetch_subject_results({
        teacherId,
        subjectId,
        clazzId,
        examinationTypeId,
      });
      setEditedRows({});
      toast.success("All subject results updated successfully!");
    } catch (error) {
      toast.error("An error occurred while saving results.");
      console.error("Error saving all rows:", error);
    } finally {
      setIsSaving(false);
    }
  };


  const processRowUpdate = (newRow) => {
    const marks = newRow.marks !== "" && newRow.marks !== null
      ? Number(newRow.marks)
      : null;

    let grade = "";

    if (marks === null || isNaN(marks)) {
      grade = "";
    } else if (marks >= 80) grade = "A";
    else if (marks >= 70) grade = "B";
    else if (marks >= 60) grade = "C";
    else if (marks >= 50) grade = "D";
    else if (marks >= 40) grade = "E";
    else grade = "F";

    const updatedRow = { ...newRow, grade };
    setEditedRows((prev) => ({ ...prev, [updatedRow.id]: updatedRow }));
    return updatedRow;
  };

  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "marks",
      headerName: "Marks",
      flex: 1,
      editable: true,
      minWidth: 60,
    },
    //{ field: "grade", headerName: "Grade", flex: 1, editable: false },
    { field: "combination", headerName: "Comb", flex: 1 },
  ];

  return (
    <Box m="0px">
      <Box p={2} ml={2} mr={2}>
        <Header
          title={`${subject_results?.[0]?.subjectName || ""} RESULTS FOR ${subject_results?.[0]?.className || ""} CLASS`}
        />


        <Box mb={2}>
          <Button
            variant="contained"
            onClick={handleSaveAll}
            disabled={isSaving || Object.keys(editedRows).length === 0}
            sx={{
              backgroundColor: "#1CA9C9",
              color: "#fff",
              textTransform: "none",
              "&:hover": { backgroundColor: "#178aa8" },
              "&.Mui-disabled": {
                backgroundColor: "#14661aff",
                color: "#f0f0f0",
                cursor: "not-allowed",
              },
            }}
          >
            {isSaving && (
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ marginRight: 1 }}
              />
            )}
            Save All
          </Button>
        </Box>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            m="0"
            height="72vh"
            sx={{
              "& .MuiDataGrid-root": {
                color: theme.palette.mode === "light" ? "#000000" : undefined,
                border:
                  theme.palette.mode === "light"
                    ? "1px solid #000000"
                    : undefined,
              },
              "& .MuiDataGrid-row": {
                borderBottom:
                  theme.palette.mode === "light"
                    ? "1px solid #000000"
                    : undefined,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <DataGrid
              rows={subject_results}
              columns={columns}
              sortModel={[{ field: "studentName", sort: "asc" }]}
              disableRowSelectionOnClick
              processRowUpdate={processRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Subject_Results;
