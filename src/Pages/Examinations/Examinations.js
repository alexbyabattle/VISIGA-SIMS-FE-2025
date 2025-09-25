import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Typography } from "@mui/material";
import { Autorenew, Delete, EditOutlined } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useExaminationService from '../../api/services/examinationService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateDialog from "./Create_Examination";
import EditDialog from "./Edit_Examination";
import DeleteDialog from "./Delete_Examination";


const Examinations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const {
    examinations,
    totalRecords,
    fetchExaminations,
    deleteExamination,
    rotateExaminationStatus, 
  } = useExaminationService();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllExaminations, setShowAllExaminations] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadExaminations = async () => {
    setLoading(true);
    try {
      await fetchExaminations(page, size, showAllExaminations ? null : "ACTIVE");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = async (id) => {
    try {
        await rotateExaminationStatus(id, loadExaminations); 
    } catch (error) {
        console.error("Failed to rotate examination status", error);
    }
  };



  useEffect(() => {
    loadExaminations();
  }, [page, showAllExaminations]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);

  const handleEditClick = (id) => {
    setSelectedIdForEdit(id);
    setIsEditDialogOpen(true);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExaminationId, setSelectedExaminationId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedExaminationId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedExaminationId(null);
    loadExaminations();
  };

  const confirmDeleteExamination = () => {
    if (selectedExaminationId) {
      deleteExamination(selectedExaminationId, () => {
        handleDeleteDialogClose();
        loadExaminations();
      });
    }
  };

  
  const handleAllClick = () => {
    setShowAllExaminations(true);
    loadExaminations();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "examinationName", headerName: "Examination Type", flex: 1, minWidth: 150 },
    { field: "examMarks", headerName: "Exam Marks", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <IconButton color="info" onClick={() => handleEditClick(row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
            <Delete style={{ color: "red" }} />
          </IconButton>
          <IconButton color="secondary" onClick={() => handlePublishClick(row.id)}>
            <Autorenew style={{ color: "green" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="0px">
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={confirmDeleteExamination}
        examinationId={selectedExaminationId}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadExaminations}
      />

      <EditDialog
        examinationId={selectedIdForEdit}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={loadExaminations}
      />

      <Box p={2} ml={2} mr={2}>
        <Header title="EXAMINATIONS" />

        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllClick}
          >
            EXAMINATIONS
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD EXAMINATION
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <LoadingSpinner message="Loading examinations..." />
          </Box>
        ) : (
          <Table
            rows={examinations}
            columns={columns}
            totalRecords={totalRecords}
            size={size}
            page={page}
            handlePageChange={handlePageChange}
            colors={colors}
          />
        )}
      </Box>
    </Box>
  );
};

export default Examinations;
