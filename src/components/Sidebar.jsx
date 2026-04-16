import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">CrawlerOps</h2>

      <ul className="space-y-4">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/my-tasks">Tasks</Link></li>
        <li><Link to="/users">Operation PICs</Link></li>
      </ul>
    </div>
  );
}