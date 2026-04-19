import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get("/audit");
    setLogs(res.data);
  };

  return (
    <div className="flex">

      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">

          <h2 className="text-xl font-semibold mb-4">
            Audit Logs
          </h2>

          <div className="bg-white rounded-xl shadow p-4">

           <table className="w-full text-sm table-fixed">
  <thead>
    <tr className="bg-gray-100 text-left">
      <th className="p-3 w-1/5">User</th>
      <th className="p-3 w-1/5">Action</th>
      <th className="p-3 w-1/5">Task</th>
      <th className="p-3 w-2/5">Details</th>
      <th className="p-3 w-1/5">Time</th>
    </tr>
  </thead>

  <tbody>
    {logs.map(log => (
      <tr key={log._id} className="border-t text-left">
        <td className="p-3">{log.user?.name}</td>
        <td className="p-3">{log.action}</td>

        {/* ✅ FIXED TASK ALIGNMENT */}
        <td className="p-3 truncate">
          {log.taskId?.crawlerName || "-"}
        </td>

        <td className="p-3 break-words">
          {log.details}
        </td>

        <td className="p-3">
          {new Date(log.createdAt).toLocaleString()}
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