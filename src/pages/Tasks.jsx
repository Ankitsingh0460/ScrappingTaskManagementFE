import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import CreateTask from "./CreateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  // VERIFY
  const verifyTask = async (id) => {
    await axios.put(`/tasks/${id}/verify`);
    fetchTasks();
  };

  // UPDATE PROGRESS
  const updateProgress = async (id, currentProgress) => {
    const progress = prompt(`Current: ${currentProgress}%. Enter new progress`);
    const note = prompt("Work done today");

    if (!progress) return;

    const newProgress = Number(progress);

    if (newProgress < currentProgress) {
      alert(`Progress cannot decrease ❌`);
      return;
    }

    await axios.put(`/tasks/${id}/progress`, {
      progress: newProgress,
      note
    });

    fetchTasks();
  };

  // UPDATE SHEET
  const updateSheet = async (id) => {
    const url = prompt("Enter testing sheet URL");

    if (!url) return;

    await axios.put(`/tasks/${id}`, {
      testingSheetUrl: url
    });

    fetchTasks();
  };

  // 🔥 STUCK REASON
  const updateStuck = async (id) => {
    const reason = prompt("Enter stuck reason");

    if (!reason) return;

    await axios.put(`/tasks/${id}`, {
      stuckReason: reason
    });

    fetchTasks();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">

          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">All Tasks</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              + Create Task
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Crawler</th>
                  <th className="p-3">Developer</th>
                  <th className="p-3">Tester</th>
                  <th className="p-3">Assign</th>
                  <th className="p-3">Due</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Today Work</th>
                  <th className="p-3">Stuck</th>
                  <th className="p-3">Sheet</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map(t => {
                  const lastLog = t.progressLogs?.slice(-1)[0];

                  return (
                    <tr key={t._id} className="border-t hover:bg-gray-50">

                      <td className="p-3">{t.crawlerName}</td>

                      <td className="p-3">{t.developer?.name}</td>

                      <td className="p-3">{t.tester?.name}</td>

                      {/* Assign Date */}
                      <td className="p-3">
                        {t.assignDate
                          ? new Date(t.assignDate).toDateString()
                          : "-"}
                      </td>

                      {/* Due Date */}
                      <td className="p-3">
                        {t.expectedCompletionDate
                          ? new Date(t.expectedCompletionDate).toDateString()
                          : "-"}
                      </td>

                      {/* Progress */}
                      <td className="p-3">
                        <div className="bg-gray-200 h-2 rounded">
                          <div
                            className="bg-indigo-600 h-2 rounded"
                            style={{ width: `${t.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{t.progress}%</span>
                      </td>

                      {/* 🔥 Today Work (HOVER FULL TEXT) */}
                      <td className="p-3 max-w-[150px] truncate"
                          title={lastLog?.note}>
                        {lastLog?.note || "-"}
                      </td>

                      {/* 🔥 Stuck Reason */}
                      <td className="p-3 max-w-[150px] truncate"
                          title={t.stuckReason}>
                        {t.stuckReason || "-"}
                      </td>

                      {/* Sheet */}
                      <td className="p-3">
                        {t.testingSheetUrl ? (
                          <a
                            href={t.testingSheetUrl}
                            target="_blank"
                            className="text-indigo-600 underline"
                          >
                            View
                          </a>
                        ) : "-"}
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex flex-col gap-1">

                        {user?.role === "developer" && (
                          <>
                            <button
                              onClick={() => updateProgress(t._id, t.progress || 0)}
                              className="text-blue-600 text-xs"
                            >
                              Update Progress
                            </button>

                            <button
                              onClick={() => updateSheet(t._id)}
                              className="text-purple-600 text-xs"
                            >
                              Add Sheet
                            </button>

                            <button
                              onClick={() => updateStuck(t._id)}
                              className="text-red-600 text-xs"
                            >
                              Stuck
                            </button>
                          </>
                        )}

                        {user?.role === "admin" && t.status !== "completed" && (
                          <button
                            onClick={() => verifyTask(t._id)}
                            className="text-green-600 text-xs"
                          >
                            Verify
                          </button>
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

      {showModal && (
        <CreateTask
          onClose={() => setShowModal(false)}
          refresh={fetchTasks}
        />
      )}
    </div>
  );
}