import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")); // ✅ NEW

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/tasks/my");
      console.log("Fetched My Tasks:", res.data);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>

          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <HashLoader color="#4F46E5" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {tasks
                .filter((t) => t.status !== "completed" && t.status !== "hold")

                .sort((a, b) => {
                  const aTester = a.tester?._id === user._id;
                  const bTester = b.tester?._id === user._id;
                  return aTester ? -1 : bTester ? 1 : 0;
                })

                .map((t) => {
                  const isDeveloper =
                    t.developer?._id === user._id;

                  const isTester =
                    t.tester?._id === user._id;

                  return (
                    <Link
                      to={`/tasks/${t._id}`}
                      key={t._id}
                      className="no-underline"
                    >
                   <div
  className={`p-5 rounded-xl border h-[220px] flex flex-col justify-between
    transition-all duration-300 ease-in-out transform
    hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]
    ${
      isTester
        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
        : "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
    }
  `}
>
                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2">
                          {t.crawlerName}
                        </h3>

                        {/* Role Label */}
                        <p className="text-xs mb-1 font-semibold">
                          {isDeveloper && "🧑‍💻 Development Task"}
                          {isTester && "🧪 Testing Task"}
                        </p>

                        {/* Status */}
                        <p className="mb-2 text-sm text-gray-600">
                          Status:
                        </p>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              t.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : isTester
                                ? "bg-blue-600 text-white"
                                : t.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-600 text-white"
                            }
                          `}
                        >
                          {isTester ? "🧪 Testing" : t.status}
                        </span>

                        {/* Message */}
                        {isTester && (
                          <p className="mt-2 text-xs text-blue-600 font-semibold">
                            🔔 Assigned to you for testing
                          </p>
                        )}

                        {isDeveloper && (
                          <p className="mt-2 text-xs text-green-600 font-semibold">
                            ⚙️ Assigned to you for development
                          </p>
                        )}

                        {/* Due */}
                        <p className="mt-3 text-sm text-gray-500">
                          Due:{" "}
                          {t.expectedCompletionDate
                            ? new Date(
                                t.expectedCompletionDate
                              ).toDateString()
                            : "-"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}

          {tasks.length === 0 && (
            <p className="text-gray-500 mt-4">
              No tasks assigned yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}