import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Autorenew, Delete, EditOutlined } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useTeacherService from '../../api/services/teacherService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateDialog from "./Create_Teacher";
import EditDialog from "./Edit_Teacher";
import DeleteDialog from "./Delete_Teacher";

const Teachers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { teachers, totalRecords, fetchTeachers, deleteTeacher } = useTeacherService();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    loadTeachers();
  }, [page, showAllTeachers]);

  const loadTeachers = async () => {
    setIsLoading(true);
    await fetchTeachers(page, size, showAllTeachers ? null : "ACTIVE");
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);

  const handleEditClick = (teacherId) => {
    setSelectedIdForEdit(teacherId);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIdForEdit(null);
    loadTeachers();
  };

  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const handleDeleteClick = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedTeacherId(null);
    loadTeachers();
  };

  const confirmDeleteTeacher = () => {
    if (selectedTeacherId) {
      deleteTeacher(selectedTeacherId, () => {
        handleDeleteDialogClose();
      });
    }
  };

  const openTeacherDetailsPage = (selectedTeacherId) => {
    navigate(`/teacher_details/${selectedTeacherId}`);
  };

  const handleAllUsersClick = () => {
    setShowAllTeachers(true);
    loadTeachers();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Teacher_Name", flex:  1 , minWidth: 150 },
    { field: "phoneNumber", headerName: "PhoneNumber", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "createdAt", headerName: "CreatedAt", flex: 1 },
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
          <IconButton color="success" onClick={() => openTeacherDetailsPage(row.id)}>
            <VisibilityOutlinedIcon style={{ color: "green" }} />
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
        onConfirm={confirmDeleteTeacher}
        teacherId={selectedTeacherId}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadTeachers}
      />

      <EditDialog
        teacherId={selectedIdForEdit}
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        onSuccess={loadTeachers}
      />

      <Box p={2} ml={2} mr={2}>
        <Header title="TEACHERS" />
        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllUsersClick}
          >
            TEACHERS
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD TEACHER
          </Button>
        </Box>

        
        {isLoading ? (
          <LoadingSpinner message="Loading teachers..." height="300px" />
        ) : (
          <Table
            rows={teachers}
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

export default Teachers;
