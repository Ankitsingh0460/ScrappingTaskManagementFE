import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Pencil, Trash } from "lucide-react";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);
  const [editName, setEditName] = useState("");

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
    toast.success("Project created successfully");
    setName("");
    fetchProjects();
    setLoading(false);
  };

  // ❌ OLD DELETE (kept but not used)
  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmDelete) return;

    await axios.delete(`/projects/${id}`);
    fetchProjects();
    toast.success("Project deleted successfully");
  };

  // ✅ NEW DELETE FLOW
  const openDeleteModal = (id) => {
    setProjectToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const id = projectToDelete;

    // 🔥 close instantly
    setShowDeleteModal(false);
    setProjectToDelete(null);

    await toast.promise(axios.delete(`/projects/${id}`), {
      loading: "Deleting project...",
      success: "Project deleted successfully",
      error: "Delete failed ❌",
    });

    fetchProjects();
  };

  // ❌ OLD EDIT (kept but not used)
  const editProject = async (project) => {
    const newName = prompt("Edit project name", project.name);
    if (!newName || !newName.trim()) return;

    await axios.put(`/projects/${project._id}`, {
      name: newName,
    });

    fetchProjects();
    toast.success("Project updated successfully");
  };

  // ✅ NEW EDIT FLOW
  const openEditModal = (project) => {
    setEditProjectData(project);
    setEditName(project.name);
    setShowEditModal(true);
  };

  const handleUpdateProject = async () => {
    if (!editName.trim()) return;

    const id = editProjectData._id;

    // 🔥 close instantly
    setShowEditModal(false);

    await toast.promise(axios.put(`/projects/${id}`, { name: editName }), {
      loading: "Updating project...",
      success: "Project updated successfully",
      error: "Update failed ❌",
    });

    setEditProjectData(null);
    setEditName("");
    fetchProjects();
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <HashLoader color="#4F46E5" />
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>

            {/* Add Project */}
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

            {/* Table */}
            <div className="bg-white rounded-xl shadow p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-600">
                    <th className="p-3">Project Name</th>
                    <th className="p-3 w-[180px]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{p.name}</td>

                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(p._id)}
                          className="bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200"
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

      {/* ✅ DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-lg">
            <h2 className="text-lg font-semibold">Delete Project</h2>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete this project?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 px-4 py-1.5 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] shadow-lg">
            <h2 className="text-lg font-semibold">Edit Project</h2>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full mt-3 p-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 px-4 py-1.5 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProject}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
