import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  Button,
  Tooltip
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Autorenew, Delete, EditOutlined } from "@mui/icons-material";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useStudentService from '../../api/services/studentService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import useClassService from "../../api/services/ClassService";
import DeleteDialog from "./Delete_Student";
import CreateDialog from "./Create_Student";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as image from '../../assets';

const ClassStudents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id: classId } = useParams();
  const navigate = useNavigate();
  const {
    fetchStudentsByClassId,
    deleteStudent,
    students,
    generateStudentsNumberByClassId,
  } = useStudentService();

  const { changeToGraduateStatus  } = useClassService();

  const [showAllStudents, setShowAllStudents] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    if (classId) {
      setLoading(true);
      // Always filter by ACTIVE status unless explicitly showing all students
      const statusFilter = showAllStudents ? null : "ACTIVE";
      console.log("Loading students with status filter:", statusFilter);
      await fetchStudentsByClassId(classId, statusFilter);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [classId, showAllStudents]);

  const handleDeleteClick = (studentId) => {
    setSelectedStudentId(studentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedStudentId(null);
    setShowAllStudents(false); // Reset to show only ACTIVE students
    loadStudents();
  };

  const confirmDeleteStudent = () => {
    if (selectedStudentId) {
      deleteStudent(selectedStudentId, () => {
        setShowAllStudents(false); // Ensure we show only ACTIVE students after deletion
        handleDeleteDialogClose();
      });
    }
  };

  const openStudentDetailsPage = (studentId) => {
    navigate(`/student_details/${studentId}`);
  };

  const viewParentsOfStudent = (studentId) => {
    navigate(`/student_parents/${studentId}`);
  };

  const fillAccountsDetails = (studentId) => {
    
  };

  const fillRectorMessage = (studentId) => {
    
  };

  const fillStudentEvaluation = (studentId) => {
    
  };

  const handleAllUsersClick = () => {
    setShowAllStudents(!showAllStudents);
  };

  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const handleGenerateIndexNumbers = async () => {
    try {
      setLoading(true);
      await generateStudentsNumberByClassId(classId);
      await loadStudents();
    } catch (error) {
      console.error("Failed to generate index numbers", error);
    } finally {
      setLoading(false);
    }
  };


  const handleChangeStatus = async () => {
    try {
      setLoading(true);
      await changeToGraduateStatus(classId);
      await loadStudents();
    } catch (error) {
      console.error(" Failed to  change status of  students  and class", error);
    } finally {
      setLoading(false);
    }
  };


  const sortedStudents = useMemo(() => {
    // Filter to show only ACTIVE students unless explicitly showing all
    const filteredStudents = showAllStudents 
      ? students 
      : students.filter(student => student.status === 'ACTIVE');
    
    return [...filteredStudents].sort((a, b) => {
      // First sort by combination
      const combCompare = a.combination.localeCompare(b.combination, undefined, { sensitivity: "base" });
      if (combCompare !== 0) return combCompare;

      // If same combination, sort by studentName
      return a.studentName.localeCompare(b.studentName, undefined, { sensitivity: "base" });
    });
  }, [students, showAllStudents]);




  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: "combination",
      headerName: "combination",
      flex: 1,
      minWidth: 150,
      sortable: true,
    },
    {
      field: "studentNumber",
      headerName: "Student Number",
      flex: 1,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: true,
    },
    {
      field: "accounts",
      headerName: "Accounts",
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => fillAccountsDetails(row.id)}
          >
             ACCOUNTS
          </Button>
        </Box>
      ),
    },
    {
      field: "rector",
      headerName: "Rector",
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => fillRectorMessage(row.id)}
          >
             RECTOR
          </Button>
        </Box>
      ),
    },
    {
      field: "secretary",
      headerName: "Secretary",
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => fillStudentEvaluation(row.id)}
          >
             SECRETARY
          </Button>
        </Box>
      ),
    },
    {
      field: "Parents",
      headerName: "Parents",
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%" mt={1}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={() => viewParentsOfStudent(row.id)}
          >
            PARENTS
          </Button>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          
          <Tooltip title="Delete Student">
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
              <Delete style={{ color: "red" }} />
            </IconButton>
          </Tooltip>
          <IconButton color="success" onClick={() => openStudentDetailsPage(row.id)}>
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
        onConfirm={confirmDeleteStudent}
        studentId={selectedStudentId}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadStudents}
        clazzId={classId}
      />


      <Box p={2} ml={2} mr={2}>
        <Header title="STUDENTS" />
        <Box mb={2}>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllUsersClick}
          >
            {showAllStudents ? "ACTIVE ONLY" : "ALL STUDENTS"}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={openCreateDialog}
          >
            ADD STUDENTS
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px", marginTop: "5px" }}
            onClick={handleGenerateIndexNumbers}
          >
            GENERATE INDEX NUMBER
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px", marginTop: "5px" }}
            onClick={handleChangeStatus}
          >
            GRADUATE STATUS
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Box height="72vh">
            <DataGrid
              rows={sortedStudents}
              columns={columns}
              disableRowSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              getRowId={(row) => row.id}

            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ClassStudents;
