import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { HashLoader } from "react-spinners";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/tasks/my");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
          {loading ? (
            // ✅ Loader only in content area
            <div className="flex justify-center items-center h-[60vh]">
              <HashLoader color="#4F46E5" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {tasks
                .filter((t) => t.status !== "completed" && t.status !== "hold")
                .map((t) => (
                  <div
                    key={t._id}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
                  >
                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2">
                      {t.crawlerName}
                    </h3>

                    {/* Status */}
                    <p className="mb-2 text-sm text-gray-600">Status:</p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      t.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : t.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : t.status === "testing"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                    }
                  `}
                    >
                      {t.status}
                    </span>

                    {/* Optional Info */}
                    <p className="mt-3 text-sm text-gray-500">
                      Due:{" "}
                      {t.expectedCompletionDate
                        ? new Date(t.expectedCompletionDate).toDateString()
                        : "-"}
                    </p>
                  </div>
                ))}
            </div>
          )}
          {/* Empty State */}
          {tasks.length === 0 && (
            <p className="text-gray-500 mt-4">No tasks assigned yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
