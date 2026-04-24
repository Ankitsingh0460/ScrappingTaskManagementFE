import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Pencil, Trash } from "lucide-react";
import { HashLoader } from "react-spinners";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await axios.get("/projects");
    setProjects(res.data);
    setLoading(false);
  };

  const createProject = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await axios.post("/projects", { name });
    setName("");
    fetchProjects();
    setLoading(false);
  };

  // ✅ NEW: Delete Project
  const deleteProject = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmDelete) return;

    await axios.delete(`/projects/${id}`);
    fetchProjects();
  };

  // ✅ NEW: Edit Project
  const editProject = async (project) => {
    const newName = prompt("Edit project name", project.name);
    if (!newName || !newName.trim()) return;

    await axios.put(`/projects/${project._id}`, {
      name: newName,
    });

    fetchProjects();
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <HashLoader color="#4F46E5" />
          </div>
        ) : (
          <div className="p-6">
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Projects</h2>

            {/* Add Project Card */}
            <div className="bg-white p-5 rounded-xl shadow mb-6 flex gap-3">
              <input
                placeholder="Enter project name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={createProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Project Table */}
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-600">
                    <th className="p-3">Project Name</th>

                    {/* ✅ NEW COLUMN */}
                    <th className="p-3 w-[180px]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{p.name}</td>

                      {/* ✅ NEW ACTION BUTTONS */}
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => editProject(p)}
                          className="text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => deleteProject(p._id)}
                          className="text-xs px-2 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
