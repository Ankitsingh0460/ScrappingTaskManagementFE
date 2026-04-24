import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRef } from "react";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const scrollRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("All fields are mandatory");
      return;
    }

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
  const handleEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
    });

    setEditUserId(u._id);
    setIsEdit(true);

    // ✅ Scroll the container (NOT window)
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const updateUser = async () => {
    try {
      await axios.put(`/users/${editUserId}`, form);
      alert("User updated successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "developer",
      });

      setIsEdit(false);
      setEditUserId(null);

      fetchUsers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error updating user");
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`/users/${selectedUserId}`);
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.log(err);
      alert("Error deleting user");
    }
  };

  // ✅ Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const visiblePages = 3; // how many page numbers you want to show

  let startPage = currentPage;
  let endPage = currentPage + visiblePages - 1;

  // prevent overflow
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 bg-gray-100 flex flex-col">
        <Header />

        <div className="p-6 overflow-y-auto flex-1" ref={scrollRef}>
          <h2 className="text-xl font-semibold mb-4">Create User</h2>

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

            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
            </select>
            <div className="col-span-4 flex justify-end items-center">
              <button
                onClick={isEdit ? updateUser : createUser}
                className={`px-4 py-2 text-sm rounded-md text-white ${
                  isEdit
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isEdit ? "Update" : "Add"}
              </button>

              {/* ✅ Cancel Button */}
              {isEdit && (
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setEditUserId(null);
                    setForm({
                      name: "",
                      email: "",
                      password: "",
                      role: "developer",
                    });
                  }}
                  className="ml-2 px-4 py-2 text-sm rounded-md bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
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
                {currentUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1 rounded-full text-xs font-semibold capitalize
      ${
        u.role === "developer"
          ? "bg-blue-100 text-blue-600"
          : "bg-green-100 text-green-600"
      }
    `}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          Edit
                        </button>
                      )}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            setSelectedUserId(u._id);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-1.5 rounded-md text-sm font-medium border border-red-200 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Pagination UI */}
            <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {/* Dynamic Pages */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[350px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Delete User
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              {/* Cancel */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                onClick={deleteUser}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
