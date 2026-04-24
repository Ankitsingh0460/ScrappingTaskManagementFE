import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ ADD THIS

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import MyTasks from "./pages/MyTasks";
import Users from "./pages/Users";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./pages/ForgetPaassword";
import TaskDetails from "./pages/TaskDetails";
import ChangePassword from "./pages/ChangePassword";
import AuditLogs from "./pages/AuditLogs";
import TeamMembers from "./pages/TeamMembers";

function App() {
  return (
    <>
      {/* ✅ GLOBAL TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #86efac",
              padding: "10px 14px",
              borderRadius: "10px",
              maxWidth: "300px",
            },
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              padding: "10px 14px",
              borderRadius: "10px",
              maxWidth: "300px",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/team" element={<TeamMembers />} />
      </Routes>
    </>
  );
}

export default App;
