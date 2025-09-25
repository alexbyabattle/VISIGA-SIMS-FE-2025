import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Delete } from '@mui/icons-material';
import Header from '../../components/Header';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import axios from 'axios';
import DeleteDialog from './DeleteIncidentDialog';


const AdminRequest = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncidentIdForEditing, setSelectedIncidentIdForEditing] = useState(null);
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('Access token not found in local storage');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };
  };

  const loadIncidents = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get('http://localhost:8082/api/incident/list', config);
      const responseData = response.data;
      const formattedData = responseData.data
        .filter((item) => item.incidentType.toUpperCase() === 'REQUEST' || item.incidentType.toUpperCase() === 'LENDING')
        .map((item) => ({
          id: item.id,
          incidentTitle: item.incidentTitle,
          incidentType: item.incidentType,
          deviceName: item.deviceName,
          quantityOfItem: item.quantityOfItem,
          status: item.status,
          reportedAt: new Date(item.reportedAt), // Assuming the API provides a 'reportedAt' field
          userName: item.users.map((user) => user.userName).join(', '),
          phoneNumber: item.users.map((user) => user.phoneNumber).join(', '),
          location: item.users.map((user) => user.location).join(', '),
          department: item.users.map((user) => user.department).join(', '),
        }))
        .sort((a, b) => b.id - a.id); // Sort by date, descending
      setRows(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleDeleteClick = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIncidentId(null);
    loadIncidents();
  };

  const openRequestDetailsPage = (incidentId) => {
    if (incidentId) {
      // console.log('ID for the request:', incidentId);
      navigate(`/requestDetails/${incidentId}`);
    }
  };

  const openEditIncidentPage = (incidentId) => {
    if (incidentId) {
      setSelectedIncidentIdForEditing(incidentId);
      navigate(`/edit/${incidentId}`);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'incidentTitle', headerName: 'Incident Title', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'incidentType', headerName: 'Incident Type', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'deviceName', headerName: 'Device Name', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'quantityOfItem', headerName: 'Quantity of Request', flex: 1, cellClassName: 'name-column--cell' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;
        if (["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(row.status)) {
          statusColor = "#4CAF50";
          textColor = "#FFFFFF";
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].includes(row.status)) {
          statusColor = "#f44336";
          textColor = "#FFFFFF";
        } else {
          statusColor = "#FFFFFF";
          textColor = "#000000";
        }
        return (
          <Box bgcolor={statusColor} color={textColor} p={1} borderRadius={5}>
            {row.status}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <IconButton color="secondary" onClick={() => handleDeleteClick(row.id)}>
              <Delete style={{ color: "red" }} />
            </IconButton>
            <IconButton color="success" onClick={() => openRequestDetailsPage(row.id)}>
              <VisibilityOutlinedIcon style={{ color: "green" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="0px">
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        incidentId={selectedIncidentId}
        loadIncidents={loadIncidents}
      />
      <Box
        style={{
          padding: 20,
          marginLeft: '20px',
          marginRight: '20px',
        }}
      >
        <Header title="REQUESTS" />
        <Box
          m="0"
          height="72vh"
          sx={{
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminRequest;
