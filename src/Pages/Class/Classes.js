import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Delete, EditOutlined } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useClassService from '../../api/services/ClassService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteDialog from "./Delete_Class";
import EditDialog from "./Edit_Class";
import CreateDialog from "./Create_Class";

const Classes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const {
    classes,
    totalRecords,
    fetchClasses,
    deleteClass
  } = useClassService();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadClasses();
  }, [page, showAllClasses]);

  const loadClasses = async () => {
    setIsLoading(true);
    await fetchClasses(page, size, showAllClasses ? null : "ONGOING");
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (classId) => {
    setSelectedIdForEdit(classId);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIdForEdit(null);
    loadClasses();
  };

  const handleDeleteClick = (classId) => {
    setSelectedClassId(classId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedClassId(null);
    loadClasses();
  };

  const confirmDeleteClass = () => {
    if (selectedClassId) {
      deleteClass(selectedClassId, () => {
        handleDeleteDialogClose();
        loadClasses();
      });
    }
  };

  const openClassDetailsPage = (selectedClassId) => {
    navigate(`/class_details/${selectedClassId}`);
  };

  const openClassStudentPage = (selectedClassId) => {
    navigate(`/class_students/${selectedClassId}`);
  };

  const openClassResultsPage = (selectedClassId) => {
    navigate(`/examination_details/${selectedClassId}`);
  };

  const openClassTermResultsPage = (selectedClassId) => {
    navigate(`/class-terms/${selectedClassId}`);
  };

  const handleAllUsersClick = () => {
    setShowAllClasses(true);
    loadClasses();
  };

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "className", headerName: "Class_Name", flex: 1, minWidth: 130 },
    { field: "classType", headerName: "Class_type", flex: 1, minWidth: 130 },
    { field: "createdAt", headerName: "CreatedAt", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    {
      field: "results",
      headerName: "Results",
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1} gap={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => openClassResultsPage(row.id)}
          >
            Exam
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => openClassTermResultsPage(row.id)}
          >
            Term
          </Button>
        </Box>

      ),
    },
    {
      field: "viewStudents",
      headerName: "View Students",
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => openClassStudentPage(row.id)}
          >
            Class Seminarians
          </Button>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <IconButton color="info" onClick={() => handleEditClick(row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(row.id)}>
            <Delete sx={{ color: "red" }} />
          </IconButton>
          <IconButton onClick={() => openClassDetailsPage(row.id)}>
            <VisibilityOutlinedIcon sx={{ color: "green" }} />
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
        onConfirm={confirmDeleteClass}
        classId={selectedClassId}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadClasses}
      />

      <EditDialog
        classId={selectedIdForEdit}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={loadClasses}
      />

      <Box p={2} ml={2} mr={2}>
        <Header title="CLASSES" />
        <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={handleAllUsersClick}
          >
            CLASSES
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD CLASS
          </Button>
        </Box>

        {isLoading ? (
          <LoadingSpinner message="Loading classes..." height="300px" />
        ) : (
          <Table
            rows={classes}
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

export default Classes;
