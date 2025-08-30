import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import TablePage from "../pages/TablePage";
import Login from "../pages/Login";
import UserDashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Layout from "../components/Layout/Layout";
import CalendarPage from '../pages/CalendarPage'
import NotificationPage from '../pages/NotificationPage'

function App() {

  const sidebarLinks = [
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
    { label: "Profile", path: "/profile" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Table page", path: "/tablePage" },
    { label: "Calendar page", path: "/calendarPage" },
    { label: "Notification page", path: "/notificationPage" }
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout sidebarLinks={sidebarLinks}/>}>
          {/* Public routes */}
          <Route path="/tablePage" element={<TablePage />} />
          <Route path="/calendarPage" element={<CalendarPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notificationPage" element={<NotificationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;