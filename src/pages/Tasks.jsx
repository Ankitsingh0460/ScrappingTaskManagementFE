import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import CreateTask from "./CreateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
const [openMenu, setOpenMenu] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // VERIFY
  const verifyTask = async (id) => {
    await axios.put(`/tasks/${id}/verify`);
    fetchTasks();
  };

  // DELETE TASK
const deleteTask = async (id) => {
  const confirmDelete = confirm("Are you sure to delete this task?");

  if (!confirmDelete) return;

  await axios.delete(`/tasks/${id}`);
  fetchTasks();
};

// EDIT TASK (simple version)
const editTask = async (task) => {
  const name = prompt("Edit crawler name", task.crawlerName);

  if (!name) return;

  await axios.put(`/tasks/${task._id}`, {
    crawlerName: name
  });

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

  // STUCK
  const updateStuck = async (id) => {
    const reason = prompt("Enter stuck reason");

    if (!reason) return;

    await axios.put(`/tasks/${id}`, {
      stuckReason: reason
    });

    fetchTasks();
  };

  // 🔥 ADD PENALTY (ADMIN)
  const addPenalty = async (id) => {
    const comment = prompt("Enter penalty comment");

    if (!comment) return;

    await axios.put(`/tasks/${id}/penalty`, {
      comment
    });

    fetchTasks();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-6">

          {/* Header */}
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">All Tasks</h2>

            {user?.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                + Create Task
              </button>
            )}
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
                  <th className="p-3">Status</th>
                  <th className="p-3">Stuck Reason</th>
                  <th className="p-3">Testing Sheet</th>
                  <th className="p-3">Penalty</th>
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

                      <td className="p-3">{formatDate(t.assignDate)}</td>
                      <td className="p-3">{formatDate(t.expectedCompletionDate)}</td>

                      {/* Progress */}
                      <td className="p-3 w-[120px]">

                        <div className="bg-gray-200 h-1.5 rounded">
                          <div
                            className="bg-indigo-600 h-1.5 rounded"
                            style={{ width: `${t.progress || 0}%` }}
                          ></div>
                        </div>

                        <span className="text-[10px] text-gray-600">
                          {t.progress}%
                        </span>

                        <p className="text-xs text-gray-500 mt-1 break-words">
                          {lastLog?.note || "No update"}
                        </p>

                      </td>

                      <td className="p-3">
  <span
    className={`px-2 py-1 rounded text-xs font-semibold
      ${
        t.status === "completed"
          ? "bg-green-100 text-green-600"
          : t.status === "in_progress"
          ? "bg-yellow-100 text-yellow-600"
          : t.status === "testing"
          ? "bg-blue-100 text-blue-600"
          : t.status === "dev_done"
          ? "bg-purple-100 text-purple-600"
          : "bg-gray-100 text-gray-600"
      }
    `}
  >
    {t.status}
  </span>
</td>

                      {/* Stuck */}
                      <td
                        className="p-3 max-w-[80px] truncate"
                        title={t.stuckReason}
                      >
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

                      {/* 🔥 Penalty Column */}
                      <td
                        className="p-3 max-w-[150px] break-words text-xs text-red-600"
                        title={t.penaltyComment}
                      >
                        {t.penaltyComment || "-"}
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

                        {/* 🔥 ADMIN ACTIONS */}
    <td className="p-3 relative">

  {user?.role === "admin" && (
    <>
      {/* 🔥 THREE DOT BUTTON */}
      <button
        onClick={() =>
          setOpenMenu(openMenu === t._id ? null : t._id)
        }
        className="text-gray-600 text-lg"
      >
        ⋮
      </button>

      {/* 🔥 DROPDOWN */}
      {openMenu === t._id && (
<div className="absolute left-0 bottom-full mb-2 w-36 bg-white border rounded shadow z-50">          {t.status !== "completed" && (
            <button
              onClick={() => {
                verifyTask(t._id);
                setOpenMenu(null);
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-green-600"
            >
              Verify
            </button>
          )}

          <button
            onClick={() => {
              addPenalty(t._id);
              setOpenMenu(null);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Add Penalty
          </button>

          <button
            onClick={() => {
              editTask(t);
              setOpenMenu(null);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={() => {
              deleteTask(t._id);
              setOpenMenu(null);
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-700"
          >
            Delete
          </button>

        </div>
      )}
    </>
  )}

</td>

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