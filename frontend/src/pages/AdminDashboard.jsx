import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };
  const card = (title, desc, action, icon) => (
    <div className="bg-white/5 rounded-2xl shadow-lg hover:shadow-xl transition p-6 border border-white/10 backdrop-blur-xl">
      {" "}
      <div className="text-4xl mb-3">{icon}</div>{" "}
      <h3 className="text-xl font-semibold text-white">{title}</h3>{" "}
      <p className="text-slate-300 mt-1">{desc}</p>{" "}
      <div className="mt-4"> {action} </div>{" "}
    </div>
  );
  return (
    <div className="min-h-screen p-6">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <div className="flex justify-between items-center mb-8">
          {" "}
          <div>
            {" "}
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>{" "}
            <p className="text-slate-300">
              Manage candidates, polls and view results
            </p>{" "}
          </div>{" "}
          {/* <button onClick={handleLogout} className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-2 rounded-xl shadow-lg transition duration-200" > Logout </button> */}{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          {card(
            "Create Poll",
            "Start a new community poll with multiple options.",
            <button
              onClick={() => navigate("/admin/create-poll")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white"
            >
              Create
            </button>,
            <Icon name="chart-bar" size="2xl" className="text-blue-400" />
          )}{" "}
          {card(
            "Manage Vote and Polls",
            "Oversee all voting activities and community polls",
            <button
              onClick={() => navigate("/admin/manage-polls")}
              className="btn btn-sm btn-primary">
              Manage
            </button>,
            <Icon name="trending-up" size="2xl" className="text-green-400" />
          )}{" "}
          {card(
            "Add Candidate",
            "Add new candidates to the voting system",
            <button
              onClick={() => navigate("/admin/add-candidate")}
              className="btn btn-sm btn-primary">
              Add
            </button>,
            <Icon name="user-plus" size="2xl" className="text-purple-400" />
          )}{" "}
          {card(
            "All Candidates",
            "View and manage all registered candidates",
            <button
              onClick={() => navigate("/admin/candidates")}
              className="btn btn-sm btn-primary"
            >
              View
            </button>,
            <Icon name="users" size="2xl" className="text-indigo-400" />
          )}{" "}
          {card(
            "Voting Settings",
            "Configure voting settings and parameters",
            <button
              onClick={() => navigate("/admin/settings")}
              className="btn btn-sm btn-primary"
            >
              Open
            </button>,
            <Icon name="settings" size="2xl" className="text-gray-400" />
          )}{" "}
          {card(
            "Feedback",
            "Review user feedback and suggestions",
            <button
              onClick={() => navigate("/admin/feedback")}
              className="btn btn-sm btn-primary"
            >
              View
            </button>,
            <Icon name="message-circle" size="2xl" className="text-yellow-400" />
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
