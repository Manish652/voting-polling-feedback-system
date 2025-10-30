import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const userRes = await axios.get("/users",{
          headers:{Authorization: `Bearer ${token}`}
        });
        setUser(userRes.data);

      }catch(err){
        navigate("/login");
        return;
    }
  };

  fetchData();
  },[navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  if (!user) return <div className="text-center mt-10 text-slate-300">Loading user...</div>;

  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl rounded-2xl p-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatar ? `http://localhost:3000/upload/${user.avatar}` : "/default-avatar.png"} 
              alt="avatar" 
              className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/50 shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">{greeting}, <span className="text-indigo-300">{user.name}</span> 👋</h1>
              <p className="text-slate-300 mt-1">Welcome to the voting system!</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">Secure session</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">Real‑time results</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => navigate("/results")}
              className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white shadow-lg shadow-indigo-900/20 transition-all duration-200"
            >
              See Results
            </button>
            <button
              onClick={() => navigate('/polls')}
              className="px-5 py-2 rounded-xl font-semibold bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20"
            >
              Community Polls
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-white font-semibold">Candidates voting</h3>
              <p className="text-slate-300 mt-1">See all candidates and cast your vote.</p>
              <button onClick={() => navigate('/candidates')} className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white">Open</button>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-white font-semibold">View Results</h3>
              <p className="text-slate-300 mt-1">Check latest published results.</p>
              <button onClick={() => navigate('/results')} className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20">Open</button>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-white font-semibold">Community Polls</h3>
              <p className="text-slate-300 mt-1">Participate in ongoing polls.</p>
              <button onClick={() => navigate('/polls')} className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20">Open</button>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-white font-semibold">Feedback</h3>
              <p className="text-slate-300 mt-1">Share your experience.</p>
              <button onClick={() => navigate('/feedback')} className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20">Open</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
