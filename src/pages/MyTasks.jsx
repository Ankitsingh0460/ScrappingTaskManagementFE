import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("/tasks/my").then(res => setTasks(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2>My Tasks</h2>

      {tasks.map(t => (
        <div key={t._id} className="border p-2 mb-2">
          <h3>{t.crawlerName}</h3>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
}