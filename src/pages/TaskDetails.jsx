import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    const res = await axios.get(`/tasks`);
    const found = res.data.find(t => t._id === id);
    setTask(found);
  };

  if (!task) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">

          <h2 className="text-xl font-semibold mb-4">
            {task.crawlerName} - Progress Logs
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">

           <table className="w-full text-sm border-collapse">

  {/* HEADER */}
  <thead>
    <tr className="bg-gray-100 text-gray-700 text-center">
      <th className="p-3">Date</th>
      <th className="p-3">Progress %</th>
      <th className="p-3">Work Done</th>
      <th className="p-3">Tester Comment</th>
    </tr>
  </thead>

  {/* BODY */}
  <tbody>
    {task.progressLogs.map((log, i) => (
      <tr key={i} className="border-t text-center">

        {/* DATE */}
        <td className="p-3">
  <div>
    {new Date(log.date).toLocaleDateString()}
  </div>
  <div className="text-xs text-gray-500">
    {new Date(log.date).toLocaleTimeString()}
  </div>
</td>

        {/* PROGRESS */}
        <td className="p-3 font-medium">
          {log.progress}%
        </td>

        {/* WORK DONE */}
        <td className="p-3 text-left px-6">
          {log.note}
        </td>

        {/* TESTER COMMENT */}
        <td className="p-3 text-left px-6 text-red-500">
          {log.testerComment || "-"}
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