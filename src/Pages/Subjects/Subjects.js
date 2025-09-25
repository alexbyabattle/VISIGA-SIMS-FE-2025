import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Autorenew, Delete, EditOutlined } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useSubjectService from '../../api/services/SubjectService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateDialog from "./Create_Subjects";
import EditSubjectDialog from "./Edit_Subjects";
import DeleteDialog from "./Delete_Subjects";

const Subjects = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { subjects, totalRecords, fetchSubjects, deleteSubject } = useSubjectService();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectStatus, setSelectedSubjectStatus] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false); 

  const loadSubjects = async () => {
    try {
      setLoading(true); 
      await fetchSubjects(page, size, showAllSubjects ? null : "ACTIVE");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [page, showAllSubjects]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleEditClick = (id) => {
    setSelectedIdForEdit(id);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedIdForEdit(null);
    loadSubjects(); // ✅ Use wrapper
  };

  const handleDeleteClick = (id, status) => {
    setSelectedSubjectId(id);
    setSelectedSubjectStatus(status);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedSubjectId(null);
    setSelectedSubjectStatus(null);
  };

  const openSubjectDetailsPage = (id) => {
    navigate(`/subject_details/${id}`);
  };

  const handleAllSubjectsClick = () => {
    setShowAllSubjects(true);
    loadSubjects(); // ✅ Use wrapper
  };

  const openCreateDialog = () => setIsDialogOpen(true);

  const columns = [
    { field: "subjectName", headerName: "Subject Name", flex: 1 , minWidth: 100 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
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
          <IconButton color="secondary" onClick={() => handleDeleteClick(row.id, row.status)}>
            <Delete style={{ color: "red" }} />
          </IconButton>
          <IconButton color="success" onClick={() => openSubjectDetailsPage(row.id)}>
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
        subjectId={selectedSubjectId}
        currentStatus={selectedSubjectStatus}
        onSuccess={loadSubjects}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadSubjects} 
      />

      <EditSubjectDialog
        subjectId={selectedIdForEdit}
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        onSuccess={loadSubjects} 
      />

      <Box p={2} ml={2} mr={2}>
        <Header title="SUBJECTS" />
        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllSubjectsClick}
          >
            ALL SUBJECTS
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD SUBJECT
          </Button>
        </Box>

        {loading ? ( 
          <LoadingSpinner />
        ) : (
          <Table
            rows={subjects}
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

export default Subjects;
