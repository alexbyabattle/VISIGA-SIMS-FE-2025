import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../theme";
import { 
  LightModeOutlined, 
  DarkModeOutlined, 
  PersonOutlined, 
  Menu as MenuIcon, 
  Logout 
} from "@mui/icons-material";
import SignOutDialog from "./Authentication/SignOutDialog";
import NotificationBarDialog from "../scenes/incident/NotificationBarDialog";
import { getUserFromCookies } from "../utils/Cookie-utils";


const Topbar = ({ setIsSidebarOpen }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [incidentCount, setIncidentCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  useEffect(() => {
    const user = getUserFromCookies();
    if (user?.data?.id) {
      setUserId(user.data.id);
    }
  }, []);

  const handleIncidentCountUpdate = (count) => setIncidentCount(count);
  
  const handleLogoutDialogOpen = () => setLogoutDialogOpen(true);
  const handleLogoutDialogClose = () => setLogoutDialogOpen(false);
  const handleLogoutConfirm = () => setLogoutDialogOpen(false);
  
  const handleNotificationDialogOpen = () => setNotificationDialogOpen(true);
  const handleNotificationDialogClose = () => setNotificationDialogOpen(false);
  
  const handleUserDetailsOpen = () => {
    if (userId) {
      navigate(`/profileDetails/${userId}`);
    } else {
      console.error("User ID not found");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2} alignItems="center">
        <IconButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          <MenuIcon />
        </IconButton>
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode} aria-label="Toggle color mode">
            {theme.palette.mode === "dark" ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
          <IconButton onClick={handleUserDetailsOpen} aria-label="User profile">
            <PersonOutlined />
          </IconButton> 
          <IconButton onClick={handleLogoutDialogOpen} aria-label="Logout">
            <Logout />
          </IconButton>
        </Box>
      </Box>

      <SignOutDialog
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
        onConfirm={handleLogoutConfirm}
        setLogoutDialogOpen={setLogoutDialogOpen}
      />

      <NotificationBarDialog
        open={notificationDialogOpen}
        onClose={handleNotificationDialogClose}
        onIncidentCountUpdate={handleIncidentCountUpdate}
      />
    </>
  );
};

export default Topbar;