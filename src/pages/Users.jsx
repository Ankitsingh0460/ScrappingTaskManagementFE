import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        setError("Unauthorized - Please login again");
      } else if (err.response?.status === 403) {
        setError("Access denied - Admin only");
      } else {
        setError("Failed to fetch users");
      }
    }
  };

  const createUser = async () => {
    if (!form.name || !form.email || !form.password) return;

    try {
      await axios.post("/users", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "developer",
      });

      fetchUsers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error creating user");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = confirm("Are you sure to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
      alert("Error deleting user");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* ✅ UPDATED */}
      {/* Sidebar */}
      <Sidebar />
      {/* Main */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {" "}
        {/* ✅ UPDATED */}
        <Header />
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {" "}
          {/* ✅ UPDATED */}
          {/* Title */}
          <h2 className="text-xl font-semibold mb-4">Operation PICs</h2>
          {/* ERROR */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {/* Add User */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-4 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
            </select>

            <div className="col-span-4 flex justify-end">
              <button
                onClick={createUser}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
              >
                Add User
              </button>
            </div>
          </div>
          {/* Users Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            u.role === "developer"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }
                        `}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      {user?.role === "admin" && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
