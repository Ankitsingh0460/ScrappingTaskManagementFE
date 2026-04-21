import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function CreateTask({ onClose, refresh, editTaskData }) {
  const [form, setForm] = useState({
    crawlerName: "",
    projectId: "",
    developer: "",
    tester: "",
    assignDate: "",
    expectedCompletionDate: "",
    testingSheetUrl: "",
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editTaskData) {
      setForm({
        crawlerName: editTaskData.crawlerName || "",
        projectId:
          typeof editTaskData.projectId === "object"
            ? editTaskData.projectId._id
            : editTaskData.projectId || "",
        developer: editTaskData.developer?._id || "",
        tester: editTaskData.tester?._id || "",
        assignDate: editTaskData.assignDate?.slice(0, 10) || "",
        expectedCompletionDate:
          editTaskData.expectedCompletionDate?.slice(0, 10) || "",
        testingSheetUrl: editTaskData.testingSheetUrl || "",
      });
    }
  }, [editTaskData]);

  const fetchData = async () => {
    const usersRes = await axios.get("/users");
    const projectRes = await axios.get("/projects");

    setUsers(usersRes.data);
    setProjects(projectRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editTaskData) {
      const {
        crawlerName,
        projectId,
        developer,
        tester,
        assignDate,
        expectedCompletionDate,
      } = form;

      if (
        !crawlerName ||
        !projectId ||
        !developer ||
        !tester ||
        !assignDate ||
        !expectedCompletionDate
      ) {
        setError("All fields marked with * are required");
        return;
      }
    }

    try {
      if (editTaskData) {
        await axios.put(`/tasks/${editTaskData._id}`, form);
      } else {
        await axios.post("/tasks", form);
      }

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* MODAL */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl w-[620px] shadow-2xl border">
        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          <span className="text-blue-500">Blu</span>
          <span className="text-yellow-500">Desk</span>{" "}
          {editTaskData ? "Edit Task" : "Create Task"}
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
        )}

        <form
          className="grid grid-cols-2 gap-3 text-sm"
          onSubmit={handleSubmit}
        >
          {/* Crawler Name */}
          <div className="col-span-2">
            <label className="font-medium">
              Crawler Name {!editTaskData && "*"}
            </label>
            <input
              value={form.crawlerName}
              placeholder="Enter crawler name"
              className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) =>
                setForm({ ...form, crawlerName: e.target.value })
              }
            />
          </div>

          {/* Project */}
          <div>
            <label className="font-medium">
              Project {!editTaskData && "*"}
            </label>
            <select
              value={form.projectId}
              className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Developer */}
          <div>
            <label className="font-medium">
              Developer {!editTaskData && "*"}
            </label>
            <select
              value={form.developer}
              className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setForm({ ...form, developer: e.target.value })}
            >
              <option value="">Select Developer</option>
              {users
                .filter((u) => u.role === "developer")
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Tester */}
          <div>
            <label className="font-medium">Tester {!editTaskData && "*"}</label>
            <select
              value={form.tester}
              className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setForm({ ...form, tester: e.target.value })}
            >
              <option value="">Select Tester</option>
              {users
                .filter((u) => u.role === "developer")
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Assign Date */}
          <div>
            <label className="font-medium">
              Assign Date {!editTaskData && "*"}
            </label>
            <input
              type="date"
              value={form.assignDate}
              className="w-full px-3 py-2 border rounded-lg mt-1"
              onChange={(e) => setForm({ ...form, assignDate: e.target.value })}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="font-medium">
              Due Date {!editTaskData && "*"}
            </label>
            <input
              type="date"
              value={form.expectedCompletionDate}
              className="w-full px-3 py-2 border rounded-lg mt-1"
              onChange={(e) =>
                setForm({
                  ...form,
                  expectedCompletionDate: e.target.value,
                })
              }
            />
          </div>

          {/* EDIT ONLY */}
          {editTaskData && (
            <div className="col-span-2">
              <label className="font-medium">Testing Sheet URL</label>
              <input
                value={form.testingSheetUrl}
                placeholder="Enter URL"
                className="w-full px-3 py-2 border rounded-lg mt-1"
                onChange={(e) =>
                  setForm({ ...form, testingSheetUrl: e.target.value })
                }
              />
            </div>
          )}

          {/* BUTTONS */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-yellow-400 hover:opacity-90 transition"
            >
              {editTaskData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
