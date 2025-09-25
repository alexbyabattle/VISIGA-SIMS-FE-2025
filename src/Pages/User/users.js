import React, { useState, useEffect } from 'react';
import { Box, IconButton, useTheme, Button, Pagination, Typography, Tooltip } from "@mui/material";
import { Autorenew, Delete, EditOutlined } from "@mui/icons-material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useUserService from '../../api/services/userService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import CreateUserDialog from './CreateUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import ChangeUserStatusDialog from './ChangeUserStatusDialog';

const UserTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { users, totalRecords, fetchUsers, deleteUser, isLoading } = useUserService(); 
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showAllUsers, setShowAllUsers] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState(null);

  useEffect(() => {
    fetchUsers(page, size, showAllUsers ? null : "ACTIVE");
  }, [page, showAllUsers]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchUsers(page, size, showAllUsers ? null : "ACTIVE");
  };

  const handleDeleteClick = (userId, status) => {
    setSelectedUserId(userId);
    setSelectedUserStatus(status);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
    setSelectedUserStatus(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
    setSelectedUserStatus(null);
    fetchUsers(page, size, showAllUsers ? null : "ACTIVE");
  };

  

  const openUserDetailsPage = (selectedUserId) => {
    navigate(`/userDetails/${selectedUserId}`);
  };

  const handleAllUsersClick = () => {
    setShowAllUsers(true);
    fetchUsers(page, size, null);
  };

  const columns = [
    { field: "userName", headerName: "UserName", flex: 1 , minWidth : 150 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "communityName", headerName: "communityName", flex: 1 },
    { field: "parishName", headerName: "parishName", flex: 1 },
    { field: "archdiocese", headerName: "archdiocese", flex: 1 },
    { field: "createdAt", headerName: "createdAt", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 , minWidth : 100 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          
          <Tooltip title={row.status === 'ACTIVE' ? 'Disable User' : 'Enable User'}>
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id, row.status)}>
              <Delete style={{ color: "red" }} />
            </IconButton>
          </Tooltip>
          <IconButton color="success" onClick={() => openUserDetailsPage(row.id)}>
            <VisibilityOutlinedIcon style={{ color: "green" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="0px">
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        userId={selectedUserId}
        currentStatus={selectedUserStatus}
        onSuccess={handleDeleteSuccess}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      

      <Box p={2} ml={2} mr={2}>
        <Header title="USERS" />
        <Box>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px", marginRight: "10px" }}
            onClick={handleAllUsersClick}
          >
            All Users
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ padding: "5px 8px", fontSize: "13px" }}
            onClick={handleCreateClick}
          >
            ADD USER
          </Button>
        </Box>

        {isLoading ? (
          <LoadingSpinner message="Loading Users..." height="300px" />
        ) : (
          <Table
            rows={users}
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

export default UserTable;