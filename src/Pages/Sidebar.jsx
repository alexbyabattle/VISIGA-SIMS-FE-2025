import { useState } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { 
  DeviceHub, 
  RequestPageOutlined, 
  HomeOutlined,
  PeopleOutlined,
  ReportProblemOutlined, 
  CheckCircleOutline, 
  Report,
  Cancel 
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import { getUserFromCookies } from "../utils/Cookie-utils";
import image from "../data/image";


const Item = ({ title, to, icon, selected, setSelected, closeSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const handleClick = () => {
    setSelected(title);
    closeSidebar();
  };

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={handleClick}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SidebarComponent = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const user = getUserFromCookies();
  const role = user?.data?.role;

  const closeSidebar = () => setIsSidebarOpen(false);

  const handleCloseSidebar = () => {
    closeSidebar();
  };

  if (!isSidebarOpen) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "260px",
        zIndex: 1400,
        overflowY: "auto",
        backgroundColor: colors.primary[400],
      }}
    >
      <ProSidebar
        backgroundColor={colors.primary[400]}
        rootStyles={{
          "& .ps-sidebar-container": {
            backgroundColor: colors.primary[400],
          },
          "& .ps-menu-button": {
            padding: "5px 35px 5px 20px",
            "&:hover": {
              color: "#868dfb",
              backgroundColor: "transparent",
            },
          },
          "& .ps-menu-button.ps-active": {
            color: "#6870fa",
          },
        }}
      >
        <Menu>
          <MenuItem
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              ml="15px"
            >
              <Typography variant="h3" color={colors.grey[100]}>
                VISIGA-SIMS
              </Typography>
              <IconButton onClick={handleCloseSidebar} aria-label="Close sidebar">
                <Cancel />
              </IconButton>
            </Box>
          </MenuItem>
          
          <Box mb="25px" textAlign="center">
            <Box display="flex" justifyContent="center">
              <img
                alt="VISIGA logo"
                width="100px"
                height="100px"
                src={image.visiga}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              />
            </Box>
            <Typography variant="h5" color={colors.greenAccent[600]}>
              St Mary&apos;s Junior Seminary Visiga
            </Typography>
          </Box>

          <Box paddingLeft="10%">
            {role === "ADMIN" && (
              <>
                <Item title="DASHBOARD" to="/dashboard" icon={<HomeOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="TEACHERS" to="/teachers" icon={<DeviceHub />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="USERS" to="/users" icon={<PeopleOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="PARENTS" to="/parents" icon={<CheckCircleOutline />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="CLASSES" to="/classes" icon={<ReportProblemOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="SUBJECTS" to="/subjects" icon={<Report />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="EXAMINATIONS" to="/examinations" icon={<RequestPageOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
                <Item title="TERM" to="/terms" icon={<RequestPageOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
              </>
            )}
            {role === "TEACHER" && (
              <Item title="DASHBOARD" to="/dashboard" icon={<HomeOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
            )}
            {role === "PARENT" && (
              <Item title="DASHBOARD" to="/dashboard" icon={<HomeOutlined />} selected={selected} setSelected={setSelected} closeSidebar={closeSidebar} />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SidebarComponent;