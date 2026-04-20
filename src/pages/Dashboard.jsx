import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  const getDueStatus = (task) => {
    if (!task?.expectedCompletionDate) return null;

    if (task.status === "completed") return "completed";

    const today = new Date();
    const dueDate = new Date(task.expectedCompletionDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "overdue";
    if (diffDays <= 2) return "dueSoon";

    return "normal";
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const getPriority = (task) => {
      const status = getDueStatus(task);
      if (status === "overdue") return 0;
      if (status === "dueSoon") return 1;
      return 2;
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const dateA = new Date(a.expectedCompletionDate || 0);
    const dateB = new Date(b.expectedCompletionDate || 0);

    return dateA - dateB;
  });

  const overdue = tasks.filter((t) => getDueStatus(t) === "overdue").length;

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* ✅ UPDATED */}
      <Sidebar />
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {" "}
        {/* ✅ UPDATED */}
        <Header />
        {/* ✅ SCROLLABLE AREA */}
        <div className="overflow-y-auto flex-1">
          {" "}
          {/* ✅ UPDATED */}
          {/* Cards */}
          <div className="grid grid-cols-4 gap-6 p-6">
            <div
              onClick={() => navigate("/tasks")}
              className="cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
            >
              <h3 className="text-sm opacity-80">Total Tasks</h3>
              <p className="text-3xl font-bold">{total}</p>
            </div>

            <div
              onClick={() => navigate("/tasks?filter=completed")}
              className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
            >
              <h3 className="text-sm opacity-80">Completed</h3>
              <p className="text-3xl font-bold">{completed}</p>
            </div>

            <div
              onClick={() => navigate("/tasks?filter=overdue")}
              className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
            >
              <h3 className="text-sm opacity-80">Overdue</h3>
              <p className="text-3xl font-bold">{overdue}</p>
            </div>

            <div
              onClick={() => navigate("/tasks?filter=in_progress")}
              className="cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
            >
              <h3 className="text-sm opacity-80">In Progress</h3>
              <p className="text-3xl font-bold">{inProgress}</p>
            </div>
          </div>
          {/* Task Table */}
          <div className="p-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Task Overview</h3>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-600">
                    <th className="p-3">Crawler</th>
                    <th className="p-3">Developer</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Due Date</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedTasks.map((task) => {
                    const status = getDueStatus(task);

                    return (
                      <tr
                        key={task._id}
                        className={`border-t transition
                          ${
                            status === "overdue"
                              ? "bg-red-50 hover:bg-red-100"
                              : status === "dueSoon"
                                ? "bg-yellow-50 hover:bg-yellow-100"
                                : "hover:bg-gray-50"
                          }
                        `}
                      >
                        <td className="p-3 font-medium">{task.crawlerName}</td>

                        <td className="p-3">{task.developer?.name || "-"}</td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : task.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : task.status === "testing"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            {task.status}
                          </span>
                        </td>

                        <td className="p-3 text-sm font-medium">
                          {task.expectedCompletionDate ? (
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-semibold
                                ${
                                  status === "overdue"
                                    ? "bg-red-100 text-red-500"
                                    : status === "dueSoon"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "text-gray-500"
                                }
                              `}
                            >
                              {new Date(
                                task.expectedCompletionDate,
                              ).toDateString()}

                              {status === "overdue" && " ❌ Overdue"}
                              {status === "dueSoon" && " ⚠️ Due Soon"}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
