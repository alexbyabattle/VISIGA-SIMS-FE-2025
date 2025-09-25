import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Delete, EditOutlined, Autorenew } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate } from "react-router-dom";
import useTermService from '../../api/services/termService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import EditDialog from "./Edit_Term";
import DeleteDialog from "./Delete_Term";
import CreateDialog from "./Create_Term";

const Term = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { terms, totalRecords, fetchTerms, deleteTerm, rotateTermStatus } = useTermService();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllTerms, setShowAllTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    loadTerms();
  }, [page, showAllTerms]);

  const loadTerms = async () => {
    setIsLoading(true);
    await fetchTerms(page, size, showAllTerms ? null : "ACTIVE");
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);

  const handleEditClick = (termId) => {
    setSelectedIdForEdit(termId);
    setIsEditDialogOpen(true);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState(null);

  const handleDeleteClick = (termId) => {
    setSelectedTermId(termId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedTermId(null);
    loadTerms();
  };

  const confirmDeleteTerm = () => {
    if (selectedTermId) {
      deleteTerm(selectedTermId, () => {
        handleDeleteDialogClose();
      });
    }
  };

  const openTermDetailsPage = (selectedTermId) => {
    navigate(`/term_details/${selectedTermId}`);
  };

  const handleAllTermsClick = () => {
    setShowAllTerms(true);
    loadTerms();
  };

  const handleRotateClick = async (id) => {
    try {
      await rotateTermStatus(id, loadTerms);
    } catch (error) {
      console.error("Failed to rotate term status", error);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "termName", headerName: "Term_Name", flex: 1, minWidth: 150 },
    { field: "createdAt", headerName: "Created_At", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <IconButton color="info" onClick={() => handleEditClick(row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
            <Delete style={{ color: "red" }} />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleRotateClick(row.id)}>
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
        onConfirm={confirmDeleteTerm}
        termId={selectedTermId}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadTerms}
      />

      <EditDialog
        termId={selectedIdForEdit}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={loadTerms}
      />

      <Box p={2} ml={2} mr={2}>
        <Header title="TERMS" />
        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllTermsClick}
          >
            TERMS
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD TERM
          </Button>
        </Box>

        {isLoading ? (
          <LoadingSpinner message="Loading terms..." height="300px" />
        ) : (
          <Table
            rows={terms}
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

export default Term;
