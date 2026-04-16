import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  // Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const overdue = tasks.filter(
    t => new Date(t.expectedCompletionDate) < new Date() && t.status !== "completed"
  ).length;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="bg-white p-4 rounded shadow">
            <h3>Total Tasks</h3>
            <p className="text-xl">{total}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>Completed</h3>
            <p className="text-xl">{completed}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>Overdue</h3>
            <p className="text-xl text-red-500">{overdue}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3>In Progress</h3>
            <p className="text-xl">
              {tasks.filter(t => t.status === "in_progress").length}
            </p>
          </div>
        </div>

        {/* Task Table */}
        <div className="p-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="mb-4">Tasks</h3>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th>Name</th>
                  <th>Developer</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="text-center border-t">
                    <td>{task.crawlerName}</td>
                    <td>{task.developer?.name}</td>
                    <td>{task.status}</td>
                    <td>
                      {new Date(task.expectedCompletionDate).toDateString()}
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