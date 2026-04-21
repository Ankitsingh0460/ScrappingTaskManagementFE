import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Users,
  AudioLines,
  ClipboardList,
  RotateCcwKey,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // ✅ Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Projects", path: "/projects", icon: <Folder size={18} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={18} /> },

    { name: "AuditLogs", path: "/audit", icon: <ClipboardList size={18} /> },
    { name: "Operation PICs", path: "/users", icon: <Users size={18} /> },
    {
      name: "Change Password",
      path: "/change-password",
      icon: <RotateCcwKey size={18} />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm p-4">
      {/* Logo */}
      <h2 className="text-xl font-bold mb-6">
        <span className="text-[#2DA4D7] ">Blu</span>
        <span className="text-yellow-500 ">Desk</span>
      </h2>

      {/* Menu */}
      <ul className="space-y-2">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;

          // ❗ Hide Projects & Operation PICs for developer
          if (
            user?.role === "developer" &&
            (item.name === "Projects" || item.name === "Operation PICs")
          ) {
            return null;
          }

          return (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
