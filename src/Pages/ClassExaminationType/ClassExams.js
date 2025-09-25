import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useClassExamService from '../../api/services/ClassExamsService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateDialog from './Create_ClassExam';
import DeleteClassSubjectResults from './DeleteClassSubjectResults';

const ClassExams = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { subjectId, teacherId, clazzId } = useParams();
  const { classExams, totalRecords, fetchClassExams } = useClassExamService();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user details from cookies
  const user = getUserFromCookies();
  const userRole = user?.data?.role;
  
  // Check if user has permission to delete
  const canDelete = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'ACADEMIC';

  useEffect(() => {
    const loadData = async () => {
      if (teacherId && subjectId && clazzId) {
        setIsLoading(true);
        await fetchClassExams(teacherId, subjectId, clazzId);
        setIsLoading(false);
      }
    };
    loadData();
  }, [teacherId, subjectId, clazzId]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState(null);
  
  const openCreateDialog = () => setIsDialogOpen(true);
  const openDeleteDialog = (examType) => {
    // Double-check permissions before opening dialog
    if (!canDelete) {
      console.warn('User does not have permission to delete results');
      return;
    }
    setSelectedExamType(examType);
    setIsDeleteDialogOpen(true);
  };

  const openSubjectResultsPage = (examinationTypeId) => {
    navigate(`/subject_results/${teacherId}/${subjectId}/${clazzId}/${examinationTypeId}`);
  };

  const columns = [
    { field: "examinationType", headerName: "Examination Type", flex: 1, minWidth: 200 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: canDelete ? 150 : 90,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton color="success" onClick={() => openSubjectResultsPage(row.id)}>
            <VisibilityOutlinedIcon style={{ color: "green" }} />
          </IconButton>
          {canDelete && (
            <IconButton color="error" onClick={() => openDeleteDialog(row)}>
              <DeleteOutlinedIcon style={{ color: "red" }} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="0px">
      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => fetchClassExams(teacherId, subjectId, clazzId)}
        teacherId={teacherId}
        subjectId={subjectId}
        clazzId={clazzId}
      />

      {canDelete && (
        <DeleteClassSubjectResults
          open={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedExamType(null);
          }}
          onSuccess={() => fetchClassExams(teacherId, subjectId, clazzId)}
          examinationTypeId={selectedExamType?.id}
          subjectId={subjectId}
          clazzId={clazzId}
          teacherId={teacherId}
        />
      )}

      <Box p={2} ml={2} mr={2}>
        <Header
          title={`${classExams?.[0]?.subjectName ?? ""} EXAMINATION RESULTS`}
        />

        <Box mb={2}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD EXAMS
          </Button>
        </Box>


        {isLoading ? (
          <LoadingSpinner message="Loading exams..." height="250px" />
        ) : (
          <Table
            rows={[...classExams].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
            columns={columns}
            totalRecords={totalRecords}
            colors={colors}
          />
        )}
      </Box>
    </Box>
  );
};

export default ClassExams;
