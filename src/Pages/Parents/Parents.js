import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Tooltip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Delete, EditOutlined } from "@mui/icons-material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import useParentService from "../../api/services/ParentsService";
import Table from "../../components/Table";
import CreateDialog from "./Create_Parent";
import DeleteDialog from "./Delete_Parent";
import EditParentDialog from "./Edit_Parent";
import LoadingSpinner from '../../components/LoadingSpinner';

const Parents = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { parents, totalRecords, fetchParents, deleteParent } = useParentService();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllParents, setShowAllParents] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentStatus, setSelectedParentStatus] = useState(null);

  useEffect(() => {
    loadParents();
  }, [page, showAllParents]);

  const loadParents = async () => {
    setIsLoading(true);
    await fetchParents(page, size, showAllParents ? null : "ACTIVE");
    setIsLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  
  const openParentDetailsPage = (selectedParentId) => {
    navigate(`/parent_details/${selectedParentId}`);
  };

  const handleAllUsersClick = () => {
    setShowAllParents(!showAllParents);
    loadParents(); 
  };

  const handleDeleteClick = (parentId, status) => {
    setSelectedParentId(parentId);
    setSelectedParentStatus(status);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedParentId(null);
    setSelectedParentStatus(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedParentId(null);
    setSelectedParentStatus(null);
    setShowAllParents(false); // Reset to show only ACTIVE parents
    loadParents();
  };

  const handleEditClick = (parentId) => {
    setSelectedParentId(parentId);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedParentId(null);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedParentId(null);
    loadParents();
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openCreateDialog = () => {
    setIsDialogOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Parent_Name", flex: 1 , minWidth: 150 },
    { field: "phoneNumber", headerName: "PhoneNumber", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "createdAt", headerName: "CreatedAt", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <Tooltip title="Edit Parent">
            <IconButton color="primary" onClick={() => handleEditClick(row.id)}>
              <EditOutlined style={{ color: "blue" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.status === 'ACTIVE' ? 'Disable Parent' : 'Enable Parent'}>
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id, row.status)}>
              <Delete style={{ color: "red" }} />
            </IconButton>
          </Tooltip>
          <IconButton color="success" onClick={() => openParentDetailsPage(row.id)}>
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
        userId={selectedParentId}
        currentStatus={selectedParentStatus}
        onSuccess={handleDeleteSuccess}
      />

      <EditParentDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        parentId={selectedParentId}
        onSuccess={handleEditSuccess}
      />

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadParents}
      />


      <Box p={2} ml={2} mr={2}>
        <Header title="PARENTS" />
        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllUsersClick}
          >
            {showAllParents ? "ACTIVE ONLY" : "ALL PARENTS"}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={openCreateDialog}
          >
            ADD PARENT
          </Button>
        </Box>

        {isLoading ? (
          <LoadingSpinner message="Loading parents..." height="300px" />
        ) : (
          <Table
            rows={parents}
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

export default Parents;
