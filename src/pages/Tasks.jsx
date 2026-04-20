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
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editTaskData, setEditTaskData] = useState(null);
  const [selectedProject, setSelectedProject] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState("all");
  const [developers, setDevelopers] = useState([]);
  const [formModal, setFormModal] = useState({
    open: false,
    type: null,
    taskId: null,
    currentValue: 0,
  });
  // ✅ NEW (for floating menu position)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const getProjectName = (projectId) => {
    if (!projectId) return "-";

    const id = typeof projectId === "object" ? projectId._id : projectId;

    const project = projects.find((p) => String(p._id) === String(id));

    return project ? project.name : "-";
  };
  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  // ✅ close on outside click
  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchProjects(); // 👈 ADD THIS
    fetchDevelopers();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get("/projects");
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get("/tasks");
    setTasks(res.data);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
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
  const fetchDevelopers = async () => {
    const res = await axios.get("/users"); // or /developers (based on your API)

    // ✅ filter only developers
    const devs = res.data.filter((u) => u.role === "developer");

    setDevelopers(devs);
  };
  // const editTask = async (task) => {
  //   const name = prompt("Edit crawler name", task.crawlerName);
  //   if (!name) return;

  //   await axios.put(`/tasks/${task._id}`, {
  //     crawlerName: name
  //   });

  //   fetchTasks();
  // };
  const editTask = (task) => {
    setEditTaskData(task);
    setShowModal(true);
  };

  const updateProgress = (id, currentProgress) => {
    setFormModal({
      open: true,
      type: "progress",
      taskId: id,
      currentValue: currentProgress,
    });
  };

  const updateSheet = (id) => {
    setFormModal({ open: true, type: "TESTING SHEET", taskId: id });
  };

  const updateStuck = (id) => {
    setFormModal({ open: true, type: "STUCK REASON", taskId: id });
  };
  const addTesterComment = (id) => {
    setFormModal({ open: true, type: "TESTER COMMENT", taskId: id });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const addPenalty = (id) => {
    setFormModal({ open: true, type: "PENALTY", taskId: id });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
  });

  const handleFormSubmit = async (data) => {
    const { type, taskId, currentValue } = formModal;

    if (type === "progress") {
      if (data.progress < currentValue) {
        alert("Progress cannot decrease ❌");
        return;
      }

      await axios.put(`/tasks/${taskId}/progress`, {
        progress: data.progress,
        note: data.note,
      });
    }

    if (type === "TESTING SHEET") {
      await axios.put(`/tasks/${taskId}`, {
        testingSheetUrl: data.url,
      });
    }

    if (type === "STUCK REASON") {
      await axios.put(`/tasks/${taskId}`, {
        stuckReason: data.reason,
      });
    }

    if (type === "TESTER COMMENT") {
      await axios.put(`/tasks/${taskId}/tester-comment`, {
        comment: data.comment,
      });
    }

    if (type === "PENALTY") {
      await axios.put(`/tasks/${taskId}/penalty`, {
        comment: data.comment,
      });
    }

    setFormModal({ open: false });
    fetchTasks();
  };

  // ✅ ADD THIS BELOW useNavigate()
  const getDueStatus = (task) => {
    if (!task?.expectedCompletionDate) return null;

    if (task.status === "completed") return "completed";

    const today = new Date();
    const dueDate = new Date(task.expectedCompletionDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "tomorrow";

    if (diffDays <= 2) return "dueSoon"; // ✅ FIXED (moved up)
    if (diffDays <= 7) return "week"; // ✅ after dueSoon

    return "normal";
  };

  // const developers = [
  //   ...new Map(
  //     tasks
  //       .filter((t) => t.developer?._id)
  //       .map((t) => [t.developer._id, t.developer]),
  //   ).values(),
  // ];

  return (
    <div className="flex">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 h-screen overflow-hidden flex flex-col">
        {" "}
        <Header />
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            {/* LEFT SIDE (Search + Filters) */}
            <div className="flex items-center gap-2">
              {/* STATUS FILTER */}
              {/* PROJECT FILTER */}
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm bg-white"
              >
                <option value="all">All Projects</option>
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm bg-white"
              >
                <option value="all">All Task</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="dev-done">Dev Done</option> {/* ✅ NEW */}
                <option value="in-progress">In Progress</option>
                <option value="today">Today Due</option>
                <option value="tomorrow">Tomorrow Due</option>
                <option value="week">This Week Due</option>
                <option value="penalty">Penalty Crawlers</option> {/* ✅ NEW */}
              </select>
              {user?.role === "admin" && (
                <select
                  value={selectedDeveloper}
                  onChange={(e) => setSelectedDeveloper(e.target.value)}
                  className="border px-3 py-2 rounded-lg text-sm bg-white"
                >
                  <option value="all">All Developers</option>

                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="text"
                placeholder="Search crawler..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm w-[220px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* RIGHT SIDE (Create Button) */}
            {user?.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                + Create Task
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            {/* ✅ ONLY TABLE SCROLL */}
            <div className="h-[calc(115vh-240px)] overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-20 bg-gray-100">
                  <tr className="bg-gray-100">
                    <th className="p-3 w-[140px] text-center">Crawler</th>
                    <th className="p-3 w-[140px] text-center">Project</th>
                    <th className="p-3 w-[140px] text-center">Developer</th>
                    <th className="p-3 w-[140px] text-center">Tester</th>
                    <th className="p-3 w-[120px] text-center">Assign</th>
                    <th className="p-3 w-[120px] text-center">Due</th>
                    <th className="p-3 w-[140px] text-center">Progress</th>
                    <th className="p-3 w-[120px] text-center">Status</th>
                    <th className="p-3">Stuck Reason</th>
                    <th className="p-3">Testing Sheet</th>
                    <th className="p-3">Tester Comment</th>
                    <th className="p-3">Penalty</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks
                    .filter((t) => {
                      // ✅ SEARCH FILTER (ADD HERE — TOP)
                      if (search) {
                        if (
                          !t.crawlerName
                            ?.toLowerCase()
                            .includes(search.toLowerCase())
                        ) {
                          return false;
                        }
                      }

                      // ✅ PROJECT FILTER
                      if (selectedProject !== "all") {
                        let taskProjectId =
                          typeof t.projectId === "object"
                            ? t.projectId._id
                            : t.projectId;

                        if (String(taskProjectId) !== String(selectedProject)) {
                          return false;
                        }
                      }
                      // ✅ DEVELOPER FILTER
                      if (selectedDeveloper !== "all") {
                        if (
                          String(t.developer?._id) !== String(selectedDeveloper)
                        ) {
                          return false;
                        }
                      }

                      // ✅ STATUS FILTER
                      if (statusFilter === "completed") {
                        return t.status === "completed";
                      }

                      if (statusFilter === "in-progress") {
                        return t.status !== "completed";
                      }

                      if (statusFilter === "overdue") {
                        return getDueStatus(t) === "overdue";
                      }

                      if (statusFilter === "today") {
                        return getDueStatus(t) === "today";
                      }
                      if (statusFilter === "tomorrow") {
                        return getDueStatus(t) === "tomorrow"; // ✅ NEW
                      }

                      if (statusFilter === "week") {
                        return getDueStatus(t) === "week"; // ✅ NEW
                      }
                      if (statusFilter === "dev-done") {
                        return t.status === "testing";
                      }

                      if (statusFilter === "penalty") {
                        return (
                          t.penaltyComment && t.penaltyComment.trim() !== ""
                        );
                      }

                      return true;
                    })
                    .map((t) => {
                      const lastLog = t.progressLogs?.slice(-1)[0];
                      const dueStatus = getDueStatus(t);
                      return (
                        <tr
                          key={t._id}
                          className={`border-t hover:bg-gray-50
    ${dueStatus === "overdue" ? "" : dueStatus === "today" ? "" : ""}
  `}
                        >
                          <td className="p-3 text-center">{t.crawlerName}</td>
                          <td className="p-3 text-center relative group max-w-[140px]">
                            <div className="truncate">
                              {getProjectName(t.projectId)}
                            </div>

                            {/* ✅ Hover Full Text */}
                            <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-max max-w-[220px] z-[9999] break-words">
                              {getProjectName(t.projectId)}
                            </div>
                          </td>

                          <td className="p-3 text-center">
                            {t.developer?.name}
                          </td>
                          <td className="p-3 text-center">{t.tester?.name}</td>
                          <td className="p-3 text-center">
                            {formatDate(t.assignDate)}
                          </td>
                          <td className="p-3 text-center">
                            {t.expectedCompletionDate ? (
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold flex items-center justify-center inline-block
  ${
    getDueStatus(t) === "overdue"
      ? "bg-red-100 text-red-600"
      : getDueStatus(t) === "today"
        ? "bg-orange-100 text-orange-600"
        : getDueStatus(t) === "tomorrow"
          ? "bg-yellow-100 text-yellow-600" // ✅ NEW
          : getDueStatus(t) === "dueSoon"
            ? "bg-blue-100 text-blue-600"
            : getDueStatus(t) === "week"
              ? "bg-purple-100 text-purple-600" // ✅ NEW
              : "text-gray-500"
  }
`}
                              >
                                {formatDate(t.expectedCompletionDate)}
                                {getDueStatus(t) === "overdue" && " Overdue"}
                                {getDueStatus(t) === "today" && " Today"}
                                {getDueStatus(t) === "tomorrow" &&
                                  " Tomorrow"}{" "}
                                {getDueStatus(t) === "dueSoon" && " Due Soon"}
                                {getDueStatus(t) === "week" && " This Week"}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td
                            className="p-3 w-[80px] cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/tasks/${t._id}`)}
                          >
                            <div className="bg-gray-200 h-1.5 rounded ">
                              <div
                                className="bg-indigo-600 h-1.5 rounded "
                                style={{ width: `${t.progress || 0}%` }}
                              ></div>
                            </div>

                            <span className="text-[10px] text-gray-600">
                              {t.progress}%
                            </span>

                            <div className="relative group">
                              {/* SHORT TEXT */}
                              <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
                                {lastLog?.note || "No update"}
                              </p>

                              {/* HOVER FULL TEXT */}
                              {lastLog?.note && (
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-[220px] z-[9999] break-words">
                                  {lastLog.note}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs font-semibold">
                              {t.status}
                            </span>
                          </td>

                          <td className="p-3 max-w-[110px] relative group cursor-pointer">
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
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="p-3 max-w-[110px] relative group cursor-pointer text-xs text-blue-600">
                            <div className="truncate">
                              {lastLog?.testerComment || "-"}
                            </div>

                            {lastLog?.testerComment && (
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-[180px] z-[9999] break-words">
                                {lastLog.testerComment}
                              </div>
                            )}
                          </td>

                          <td className="p-3 text-xs text-red-600 max-w-[110px] relative group cursor-pointer">
                            {/* SHORT TEXT */}
                            <div className="truncate">
                              {t.penaltyComment || "-"}
                            </div>

                            {/* HOVER FULL TEXT */}
                            {t.penaltyComment && (
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-xl w-[180px] z-[9999] break-words">
                                {t.penaltyComment}
                              </div>
                            )}
                          </td>

                          {/* ✅ ACTION BUTTON */}
                          <td className="p-3">
                            {(user?.role === "developer" ||
                              user?.role === "admin") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const rect =
                                    e.currentTarget.getBoundingClientRect();

                                  const dropdownHeight = 150; // approx height of menu

                                  let top = rect.bottom;
                                  let left = rect.right;

                                  // 🔥 if no space at bottom → open upward
                                  if (
                                    window.innerHeight - rect.bottom <
                                    dropdownHeight
                                  ) {
                                    top = rect.top - dropdownHeight;
                                  }

                                  setMenuPosition({
                                    x: left,
                                    y: top,
                                  });

                                  setOpenMenu(
                                    openMenu === t._id ? null : t._id,
                                  );
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
                                  top: menuPosition.y + 5, // ✅ IMPORTANT (you removed this)
                                  left: menuPosition.x - 180,
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
      </div>

      {showModal && (
        <CreateTask
          onClose={() => {
            setShowModal(false);
            setEditTaskData(null);
          }}
          refresh={fetchTasks}
          editTaskData={editTaskData}
        />
      )}
      {formModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl p-5 w-[450px] min-h-[120px] max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-lg font-semibold mb-3 capitalize">
              {formModal.type}
            </h2>
            <FormBox
              type={formModal.type}
              currentValue={formModal.currentValue}
              onSubmit={handleFormSubmit}
              onClose={() => setFormModal({ open: false })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FormBox({ type, onSubmit, onClose, currentValue }) {
  const [form, setForm] = useState({});

  return (
    <div className="flex flex-col gap-3 ">
      {type === "progress" && (
        <>
          <input
            type="number"
            placeholder={`Current ${currentValue}%`}
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, progress: Number(e.target.value) })
            }
          />
          <textarea
            placeholder="Work done today"
            className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </>
      )}

      {type === "TESTING SHEET" && (
        <input
          placeholder="Testing sheet URL"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      )}

      {type === "STUCK REASON" && (
        <textarea
          placeholder="Stuck reason"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
      )}

      {(type === "TESTER COMMENT" || type === "PENALTY") && (
        <textarea
          placeholder="Enter comment"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      )}

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="border px-3 py-1 rounded">
          Cancel
        </button>

        <button
          onClick={() => {
            // ✅ VALIDATION FOR PROGRESS FORM
            if (type === "progress") {
              if (!form.progress && form.progress !== 0) {
                alert("Please enter progress % ❌");
                return;
              }

              if (!form.note || form.note.trim() === "") {
                alert("Please enter work done today ❌");
                return;
              }
            }

            onSubmit(form);
          }}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
