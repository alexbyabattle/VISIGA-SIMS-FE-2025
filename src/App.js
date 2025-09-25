import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Sidebar from "./Pages/Sidebar";
import Topbar from "./Pages/Topbar";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();

  const displaySidebar = () => {
  return ![ '/home',  '/login', '/', '/resetPassword', '/notFound', '/register', '/reportForm', '/incidentForm/:id'
  ].includes(location.pathname);
};

const displayToolbar = () => {
  return ![
    '/home', '/', '/register', '/login', '/notFound',  '/resetPassword', '/incidentDetails/:id'
  ].includes(location.pathname);
};


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="button-left" reverseOrder={false} />
        <div className="app">
        
          {displaySidebar() && <Sidebar isSidebarOpen={isSidebar} setIsSidebarOpen={setIsSidebar} />}

          <main className="content">
          
             {displayToolbar() && <Topbar setIsSidebarOpen={setIsSidebar} />}
            <AppRoutes />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
