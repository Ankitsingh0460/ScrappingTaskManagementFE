import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
export default function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({});
  const [editData, setEditData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  // ✅ NEW (developers list)
  const [developers, setDevelopers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMembers();
    fetchDevelopers();
    fetchLastUpdated(); // ✅ NEW
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await axios.get("/team");
    setMembers(res.data);
    setLoading(false);
  };

  // ✅ NEW (fetch developers)
  const fetchDevelopers = async () => {
    const res = await axios.get("/users"); // ✅ get all users

    const filtered = res.data.filter(
      (u) => u.role === "developer" || u.role === "admin",
    );

    setDevelopers(filtered);
  };
  const fetchLastUpdated = async () => {
    const res = await axios.get("/team-last-updated");
    setLastUpdated(res.data);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
    };

    if (editData) {
      await axios.put(`/team/${editData._id}`, payload);
      toast.success("Team member updated successfully");
    } else {
      await axios.post("/team", payload); // ✅ userId will go from form
      toast.success("Team member added successfully");
    }

    setShowModal(false);
    setForm({});
    setEditData(null);
    fetchMembers();
  };

  const deleteMember = async (id) => {
    if (!confirm("Delete member?")) return;
    await axios.delete(`/team/${id}`);
    toast.success("Team member deleted successfully");
    fetchMembers();
  };

  const editMember = (m) => {
    setEditData(m);
    setForm({
      ...m,
      userId: m.userId?._id || m.userId, // ✅ FIX
      skills: m.skills?.join(", ") || "",
    });
    setShowModal(true);
  };

  const exportToExcel = () => {
    const grouped = {};

    members.forEach((m) => {
      if (!grouped[m.team]) {
        grouped[m.team] = [];
      }

      grouped[m.team].push({
        Name: m.name,
        Team: m.team,
        Position: m.position,
        JoiningDate: m.joiningDate
          ? new Date(m.joiningDate).toLocaleDateString()
          : "-",
        // Skills: m.skills?.join(", "),
      });
    });

    const workbook = XLSX.utils.book_new();

    Object.keys(grouped).forEach((team) => {
      const data = grouped[team];

      const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A3" });

      // ✅ Last Updated Row
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            `Last Updated: ${
              lastUpdated ? new Date(lastUpdated).toLocaleString() : "N/A"
            }`,
          ],
        ],
        { origin: "A1" },
      );

      // ✅ Empty Row
      XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: "A2" });

      // ✅ Highlight Header Row
      const headers = Object.keys(data[0] || {});
      headers.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({
          r: 2, // row 3 (0-based index)
          c: colIndex,
        });

        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: {
              bold: true,
              color: { rgb: "FFFFFF" },
            },
            fill: {
              fgColor: { rgb: "4F46E5" }, // Indigo
            },
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
          };
        }
      });

      // ✅ Column Width
      worksheet["!cols"] = headers.map(() => ({ wch: 20 }));

      // ✅ Merge Last Updated Row
      worksheet["!merges"] = [
        {
          s: { r: 0, c: 0 },
          e: { r: 0, c: headers.length - 1 },
        },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, team);
    });

    const today = new Date().toISOString().split("T")[0];

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `BrightData_Team_${today}.xlsx`);
  };

  // ✅ FILTER
  const filteredMembers = members
    .filter((m) => {
      const currentUserId = String(user?._id || user?.id);
      const memberUserId = String(m.userId?._id || m.userId);

      // ✅ Developer → only own data
      if (user?.role === "developer") {
        if (memberUserId !== currentUserId) return false;
      }

      // ✅ Team filter (existing)
      if (selectedTeam !== "all" && m.team !== selectedTeam) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aId = String(a.userId?._id || a.userId);
      const bId = String(b.userId?._id || b.userId);
      const currentId = String(user?._id || user?.id);

      if (aId === currentId) return -1;
      if (bId === currentId) return 1;
      return 0;
    });

  // ✅ pagination logic
  const totalResults = filteredMembers.length;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  // total pages
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-gray-100 h-screen flex flex-col">
        <Header />
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <HashLoader color="#4F46E5" />
          </div>
        ) : (
          <div className="p-4 overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Team Members</h1>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Showing {currentMembers.length} of {totalResults} results
                </span>

                {/* ✅ NEW EXPORT BUTTON */}
                {user?.role === "admin" && (
                  <button
                    onClick={exportToExcel}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
                  >
                    ⬇ Export Excel
                  </button>
                )}
                {user?.role === "admin" && (
                  <button
                    onClick={() => {
                      setForm({});
                      setEditData(null);
                      setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    + Add Member
                  </button>
                )}
              </div>
            </div>

            {/* FILTER */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="border px-3 py-2 rounded bg-white"
                >
                  <option value="all">All Teams</option>
                  <option value="IDE">IDE</option>
                  <option value="SPRINKLER">SPRINKLER</option>
                </select>
              </div>

              {/* ✅ LAST UPDATED */}
              <div className="text-sm text-gray-600">
                Last Updated:{" "}
                {lastUpdated
                  ? new Date(lastUpdated).toLocaleString()
                  : "No updates yet"}
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Team</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Joining</th>
                    <th className="p-3">Skills</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentMembers.map((m) => {
                    // ✅ FIXED MATCH (IMPORTANT)
                    const isOwn =
                      String(m.userId?._id || m.userId) ===
                      String(user?._id || user?.id);

                    return (
                      <tr
                        key={m._id}
                        className={`border-t text-center ${
                          isOwn ? "bg-indigo-50 font-medium" : ""
                        }`}
                      >
                        <td className="p-3">{m.name}</td>
                        <td className="p-3">{m.team}</td>
                        <td className="p-3">{m.position}</td>
                        <td className="p-3">
                          {m.joiningDate
                            ? new Date(m.joiningDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3 max-w-[200px] break-words whitespace-normal">
                          {m.skills?.join(", ")}
                        </td>

                        <td className="p-3">
                          {/* 👑 ADMIN */}
                          {user?.role === "admin" && (
                            <>
                              <button
                                onClick={() => editMember(m)}
                                className="mr-2 text-blue-600"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteMember(m._id)}
                                className="text-red-600"
                              >
                                🗑
                              </button>
                            </>
                          )}

                          {/* 👨‍💻 DEV → only own */}
                          {user?.role === "developer" && isOwn && (
                            <button
                              onClick={() => editMember(m)}
                              className="text-indigo-600"
                            >
                              Edit Skills
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-center items-center gap-2 mt-4 mb-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl p-5 w-[500px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              {editData ? "Edit Data" : "Add Member"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* NAME */}
              {user?.role === "admin" && (
                <select
                  value={form.userId || ""}
                  onChange={(e) => {
                    const selectedUser = developers.find(
                      (d) => d._id === e.target.value,
                    );

                    setForm({
                      ...form,
                      userId: selectedUser._id, // ✅ important
                      name: selectedUser.name, // ✅ auto-fill name
                    });
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">Select Member</option>

                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
              )}

              {/* TEAM */}
              {user?.role === "admin" && (
                <>
                  <select
                    value={form.team || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        team: e.target.value,
                      })
                    }
                    className="border p-2 rounded"
                  >
                    <option value="">Select Team</option>
                    <option value="IDE">IDE</option>
                    <option value="SPRINKLER">SPRINKLER</option>
                  </select>
                </>
              )}

              {/* POSITION */}
              {user?.role === "admin" && (
                <select
                  value={form.position || ""}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  <option value="">Position</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Intern">Intern</option>
                </select>
              )}

              {/* DATE */}
              {user?.role === "admin" && (
                <input
                  type="date"
                  value={form.joiningDate || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      joiningDate: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              )}

              {/* ✅ NEW: Developer select (IMPORTANT FIX) */}

              {/* SKILLS */}
              <input
                placeholder="Skills"
                value={form.skills || ""}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="border p-2 rounded col-span-2"
              />
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-1 rounded"
              >
                {editData ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
