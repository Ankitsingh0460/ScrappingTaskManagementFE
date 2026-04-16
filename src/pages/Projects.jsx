import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get("/projects");
    setProjects(res.data);
  };

  const createProject = async () => {
    await axios.post("/projects", { name });
    setName("");
    fetchProjects();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <div className="p-4">
          <input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={createProject}>Add</button>

          <table className="w-full mt-4">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}