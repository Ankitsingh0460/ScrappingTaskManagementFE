import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  const createUser = async () => {
    await axios.post("/users", form);
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h2>Add User</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
      <input placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}/>

      <select onChange={e => setForm({...form, role: e.target.value})}>
        <option>developer</option>
        <option>tester</option>
      </select>

      <button onClick={createUser}>Add</button>

      <table>
        {users.map(u => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.role}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}