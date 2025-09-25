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
//import IncidentDetails from './IncidentDetails';


const IncidentTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // handling  populating the data after submitting
  const [rows, setRows] = useState([]);

  const loadIncidents = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.get('http://localhost:8082/api/incident/list', config);
      const responseData = response.data;

      const formattedData = responseData.data
        .filter((item) => ['software', 'hardware'].includes(item.incidentType.toLowerCase()))
        .map((item) => ({
          id: item.id,
          incidentTitle: item.incidentTitle,
          incidentType: item.incidentType,
          category: item.category,
          priority: item.priority,
          status: item.status,
          deviceName: item.devices.map((device) => device.deviceName).join(', '),
          deviceNumber: item.devices.map((device) => device.deviceNumber).join(', '),
          userName: item.users[0]?.name || '',
          phoneNumber: item.users.map((user) => user.phoneNumber).join(', '),
          location: item.users.map((user) => user.location).join(', '),
          department: item.users.map((user) => user.department).join(', '),
        }))
        .sort((a, b) => b.id - a.id);

      setRows(formattedData);


    } catch (error) {
      console.error('Error fetching data:', error);
      
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  
  // handling delete button to be able to delete the details
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (incidentId) => {
    setSelectedIncidentId(incidentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedIncidentId(null); 
    loadIncidents();
  };

  // handling displaying of details
  const navigate = useNavigate();

  const openIncidentDetailsPage = (incidentId) => {
    if (incidentId) {
      navigate(`/incidentDetails/${incidentId}`);
    }
  };

  // handling editing details
  const [selectedIncidentIdForEditing, setSelectedIncidentIdForEditing] = useState(null);
  const navigateToEditPage = useNavigate();

  const openEditIncidentPage = (incidentId) => {
    if (incidentId) {
      setSelectedIncidentIdForEditing(incidentId);
      navigateToEditPage(`/edit/${incidentId}`);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'incidentTitle',
      headerName: 'Incident Title',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'incidentType',
      headerName: 'Incident Type',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'deviceName',
      headerName: 'Device Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'userName',
      headerName: 'User Name',
      flex: 1,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      renderCell: ({ row }) => {
        let priorityColor;
        let textColor = "#FFFFFF"; // Default text color is white

        if (row.priority === 'LOW') {
          priorityColor = "#4CAF50"; // Green for low priority
        } else if (row.priority === 'HIGH') {
          priorityColor = "#f44336"; // Red for high priority
        } else {
          priorityColor = "#FFFFFF"; // Default background color
          textColor = "#000000"; // Default text color
        }

        return (
          <Box
            bgcolor={priorityColor}
            color={textColor}
            p={1}
            borderRadius={5}
          >
            {row.priority}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: ({ row }) => {
        let statusColor;
        let textColor;

        if (["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(row.status)) {
          statusColor = "#4CAF50"; // Green for success statuses
          textColor = "#FFFFFF"; // Text color white for success statuses
        } else if (["PENDING", "FAULT", "SOLUTION_PENDING", "IN_ACTIVE"].includes(row.status)) {
          statusColor = "#f44336"; // Red for error statuses
          textColor = "#FFFFFF"; // Text color white for error statuses
        } else {
          statusColor = "#FFFFFF"; // Default background color
          textColor = "#000000"; // Default text color
        }

        return (
          <Box
            bgcolor={statusColor}
            color={textColor}
            p={1}
            borderRadius={5}
          >
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

            

            <IconButton color="success" onClick={() => openIncidentDetailsPage(row.id)} >
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
          marginRight: '20px'
        }}
      >
        <Header title="INCIDENTS" />
        <Box
          m="0"
          height="72vh"
          sx={{
            "& .MuiDataGrid-root": {
              color: theme.palette.mode === 'light' ? '#000000' : undefined, // Set text color to black in light mode
              border: theme.palette.mode === 'light' ? '1px solid #000000' : undefined, // Set border color to black in light mode
            },
            "& .MuiDataGrid-row": {
              borderBottom: theme.palette.mode === 'light' ? '1px solid #000000' : undefined, // Set border between each row to black in light mode
            },
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

export default IncidentTable;
