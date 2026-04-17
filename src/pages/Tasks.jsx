import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import CreateTask from "./CreateTask";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // ✅ NEW (for floating menu position)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ close on outside click
  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const verifyTask = async (id) => {
    await axios.put(`/tasks/${id}/verify`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const confirmDelete = confirm("Are you sure to delete this task?");
    if (!confirmDelete) return;
    await axios.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const editTask = async (task) => {
    const name = prompt("Edit crawler name", task.crawlerName);
    if (!name) return;

    await axios.put(`/tasks/${task._id}`, {
      crawlerName: name
    });

    fetchTasks();
  };

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

  const updateSheet = async (id) => {
    const url = prompt("Enter testing sheet URL");
    if (!url) return;

    await axios.put(`/tasks/${id}`, {
      testingSheetUrl: url
    });

    fetchTasks();
  };

  const updateStuck = async (id) => {
    const reason = prompt("Enter stuck reason");
    if (!reason) return;

    await axios.put(`/tasks/${id}`, {
      stuckReason: reason
    });

    fetchTasks();
  };

  const addTesterComment = async (id) => {
    const comment = prompt("Enter tester comment");
    if (!comment) return;

    await axios.put(`/tasks/${id}/tester-comment`, {
      comment
    });

    fetchTasks();
  };
  useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") setOpenMenu(null);
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);

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
  <div className="w-64 flex-shrink-0">
    <Sidebar />
  </div>

<div className="flex-1 bg-gray-100 h-screen overflow-hidden flex flex-col">        <Header />

        <div className="p-4">
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

<div className="bg-white rounded-xl shadow p-4 overflow-x-auto overflow-y-visible">            <table className="w-full text-sm">
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
                  <th className="p-3">Tester Comment</th>
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

                      <td
                        className="p-3 w-[80px] cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/tasks/${t._id}`)}
                      >
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
                        <span className="px-2 py-1 rounded text-xs font-semibold">
                          {t.status}
                        </span>
                      </td>

               <td className="p-3 max-w-[120px] relative group cursor-pointer">
  <div className="truncate">
    {t.stuckReason || "-"}
  </div>

  {t.stuckReason && (
    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-[220px] z-[9999] break-words">
      {t.stuckReason}
    </div>
  )}
</td>

                      <td className="p-3">
                        {t.testingSheetUrl ? (
                          <a href={t.testingSheetUrl} target="_blank">
                            View
                          </a>
                        ) : "-"}
                      </td>

                      <td className="p-3 max-w-[150px] relative group cursor-pointer text-xs text-blue-600">
  <div className="truncate">
    {lastLog?.testerComment || "-"}
  </div>

  {lastLog?.testerComment && (
    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-[240px] z-[9999] break-words">
      {lastLog.testerComment}
    </div>
  )}
</td>

                      <td className="p-3 text-xs text-red-600">
                        {t.penaltyComment || "-"}
                      </td>

                      {/* ✅ ACTION BUTTON */}
                      <td className="p-3">
                        {(user?.role === "developer" || user?.role === "admin") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                           const rect = e.currentTarget.getBoundingClientRect();

const dropdownHeight = 150; // approx height of menu

let top = rect.bottom;
let left = rect.right;

// 🔥 if no space at bottom → open upward
if (window.innerHeight - rect.bottom < dropdownHeight) {
  top = rect.top - dropdownHeight;
}

setMenuPosition({
  x: left,
  y: top
});

                              setOpenMenu(openMenu === t._id ? null : t._id);
                            }}
                            className="text-gray-600 text-lg px-2"
                          >
                            ⋮
                          </button>
                        )}

                        {/* ✅ FLOATING DROPDOWN */}
        {/* ✅ FLOATING DROPDOWN */}
{openMenu === t._id && (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "fixed",
      top: menuPosition.y + 5,   // ✅ IMPORTANT (you removed this)
      left: menuPosition.x - 180
    }}
    className="w-[200px] bg-white border rounded-xl shadow-2xl z-[99999]"
  >

    {/* 👨‍💻 DEVELOPER */}
    {user?.role === "developer" && (
      <>
        <button
          onClick={() => {
            updateProgress(t._id, t.progress || 0);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-blue-600"
        >
          🔄 Update Progress
        </button>

        <button
          onClick={() => {
            updateSheet(t._id);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-purple-600"
        >
          📄 Testing Sheet
        </button>

        <button
          onClick={() => {
            addTesterComment(t._id);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-indigo-600"
        >
          💬 Tester Comment
        </button>

        <button
          onClick={() => {
            updateStuck(t._id);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
        >
          ⚠️ Stuck
        </button>

        <div className="border-t"></div>
      </>
    )}

    {/* 👑 ADMIN */}
    {user?.role === "admin" && (
      <>
        {t.status !== "completed" && (
          <button
            onClick={() => {
              verifyTask(t._id);
              setOpenMenu(null);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-green-600"
          >
            ✅ Verify
          </button>
        )}

        <button
          onClick={() => {
            addPenalty(t._id);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
        >
          🚫 Penalty
        </button>

        <div className="border-t"></div>

        <button
          onClick={() => {
            editTask(t);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
        >
          ✏️ Edit
        </button>

        <button
          onClick={() => {
            deleteTask(t._id);
            setOpenMenu(null);
          }}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-700"
        >
          🗑 Delete
        </button>
      </>
    )}

  </div>
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