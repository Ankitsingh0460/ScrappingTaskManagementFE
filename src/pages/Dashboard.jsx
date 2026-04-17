import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"; // ✅ ADDED

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // ✅ ADDED

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const overdue = tasks.filter(
    t => new Date(t.expectedCompletionDate) < new Date() && t.status !== "completed"
  ).length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
        <Header />

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6 p-6">

          {/* Total */}
          <div
            onClick={() => navigate("/tasks")}
            className="cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
          >
            <h3 className="text-sm opacity-80">Total Tasks</h3>
            <p className="text-3xl font-bold">{total}</p>
          </div>

          {/* Completed */}
          <div
            onClick={() => navigate("/tasks?filter=completed")}
            className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
          >
            <h3 className="text-sm opacity-80">Completed</h3>
            <p className="text-3xl font-bold">{completed}</p>
          </div>

          {/* Overdue */}
          <div
            onClick={() => navigate("/tasks?filter=overdue")}
            className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg hover:scale-[1.02] transition"
          >
            <h3 className="text-sm opacity-80">Overdue</h3>
            <p className="text-3xl font-bold">{overdue}</p>
          </div>

          {/* In Progress */}
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

            <h3 className="mb-4 text-lg font-semibold">
              Task Overview
            </h3>

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
                {tasks.map(task => (
                  <tr
                    key={task._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {task.crawlerName}
                    </td>

                    <td className="p-3">
                      {task.developer?.name || "-"}
                    </td>

                    {/* Status Badge */}
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
                          }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-gray-500">
                      {task.expectedCompletionDate
                        ? new Date(task.expectedCompletionDate).toDateString()
                        : "-"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}