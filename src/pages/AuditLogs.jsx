import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { HashLoader } from "react-spinners";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const logsPerPage = 12;
  const pagesToShow = 4;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await axios.get("/audit");
    setLogs(res.data);
    setLoading(false);
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;

  const currentLogs = logs.slice(indexOfFirst, indexOfLast);

  // ✅ Dynamic 4-page window
  const startPage =
    Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;

  const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 flex flex-col">
        <Header />
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <HashLoader color="#4F46E5" />
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>

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
                  {currentLogs.map((log) => (
                    <tr key={log._id} className="border-t text-left">
                      <td className="p-3">{log.user?.name}</td>
                      <td className="p-3">{log.action}</td>

                      <td className="p-3 truncate">
                        {log.taskId?.crawlerName || "-"}
                      </td>

                      <td className="p-3 break-words">{log.details}</td>

                      <td className="p-3">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ Pagination UI */}
              <div className="flex justify-center items-center mt-6 gap-2">
                {/* Prev */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>

                {/* Jump Back */}
                {startPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(startPage - 1)}
                    className="px-2"
                  >
                    ...
                  </button>
                )}

                {/* Page Numbers */}
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Jump Forward */}
                {endPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(endPage + 1)}
                    className="px-2"
                  >
                    ...
                  </button>
                )}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
