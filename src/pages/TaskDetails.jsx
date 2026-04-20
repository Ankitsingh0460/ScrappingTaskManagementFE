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
    const found = res.data.find((t) => t._id === id);
    setTask(found);
  };

  // ✅ HANDLE NULL / EMPTY VALUES
  const safeValue = (val) => {
    if (val === null || val === undefined || val === "") {
      return <span className="text-gray-400">-</span>;
    }
    return val;
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

          <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm border-collapse table-fixed">
              {/* HEADER */}
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-center w-[180px]">Date</th>
                  <th className="p-3 text-center w-[180px]">Progress %</th>
                  <th className="p-3 text-left w-[180px]">Work Done</th>
                  <th className="p-3 text-left w-[180px]">Tester Comment</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {task.progressLogs?.length > 0 ? (
                  task.progressLogs.map((log, i) => (
                    <tr key={i} className="border-t h-[60px]">
                      {/* DATE */}
                      <td className="p-3 text-center align-middle">
                        {log?.date ? (
                          <>
                            <div>{new Date(log.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(log.date).toLocaleTimeString()}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* PROGRESS */}
                      <td className="p-3 text-center align-middle font-medium">
                        {log?.progress !== null &&
                        log?.progress !== undefined ? (
                          `${log.progress}%`
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* WORK DONE */}
                      <td className="p-3 text-left align-middle">
                        {safeValue(log?.note)}
                      </td>

                      {/* TESTER COMMENT */}
                      <td className="p-3 text-left align-middle text-red-500">
                        {safeValue(log?.testerComment)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-400">
                      No progress logs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
