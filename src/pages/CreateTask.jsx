import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function CreateTask({ onClose, refresh }) {
  const [form, setForm] = useState({
    crawlerName: "",
    projectId: "",
    developer: "",
    tester: "",
    assignDate: "",
    expectedCompletionDate: "",
    testingSheetUrl: ""
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const usersRes = await axios.get("/users");
    const projectRes = await axios.get("/projects");

    setUsers(usersRes.data);
    setProjects(projectRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/tasks", form);

    refresh();   // reload tasks
    onClose();   // close modal
  };

  return (
<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl w-[600px] shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          Create Task
        </h2>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>

          {/* Crawler Name */}
          <input
            placeholder="Crawler Name"
            className="col-span-2 p-3 border rounded"
            onChange={(e) => setForm({ ...form, crawlerName: e.target.value })}
          />

          {/* Project */}
          <select
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            <option>Select Project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Developer */}
          <select
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, developer: e.target.value })}
          >
            <option>Select Developer</option>
            {users
              .filter(u => u.role === "developer")
              .map(u => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
          </select>

          {/* Tester */}
          <select
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, tester: e.target.value })}
          >
            <option>Select Tester</option>
            {users
              .filter(u => u.role === "developer")
              .map(u => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
          </select>

          {/* Assign Date */}
          <input
            type="date"
            placeholder="Assign Date"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, assignDate: e.target.value })}
          />

          {/* Due Date */}
          <input
            type="date"
            placeholder="Due Date"
            className="p-3 border rounded"
            onChange={(e) =>
              setForm({ ...form, expectedCompletionDate: e.target.value })
            }
          />

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Create
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}