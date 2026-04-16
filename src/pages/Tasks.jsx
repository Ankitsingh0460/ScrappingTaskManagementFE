import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2>All Tasks</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Developer</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(t => (
            <tr key={t._id}>
              <td>{t.crawlerName}</td>
              <td>{t.developer?.name}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}