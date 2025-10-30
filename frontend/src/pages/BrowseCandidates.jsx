import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function BrowseCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");
  const [windowInfo, setWindowInfo] = useState({ start: null, end: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const load = async () => {
      try {
        setLoading(true);
        // Load status first (public, no auth needed)
        try {
          const { data: statusData } = await api.get("/admin/settings/publicStatus");
          setStatus(statusData?.status || "not-started");
          setWindowInfo({ start: statusData?.candidateVoteStart, end: statusData?.candidateVoteEnd });
        } catch (e) {
          // If status fails, default to not-started
          setStatus("not-started");
        }

        // Load candidates for the user
        const { data } = await api.get("/candidate", { headers: { Authorization: `Bearer ${token}` } });
        setCandidates(data || []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : "");
  const votingActive = status === "active";

  if (loading) return <div className="text-slate-300">Loading candidates...</div>;
  if (error) return <div className="text-red-300">{error}</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-4">Browse Candidates</h1>

        {!votingActive && (
          <div className="mb-6 p-4 rounded-xl bg-white/10 border border-white/10 text-slate-200">
            <div className="font-semibold">Candidate voting is not active right now.</div>
            {status === "not-started" && (
              <div className="text-slate-300 text-sm mt-1">Scheduled window: {fmt(windowInfo.start)} — {fmt(windowInfo.end)}</div>
            )}
            {status === "ended" && (
              <div className="text-slate-300 text-sm mt-1">Voting has ended. You can view results once published.</div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div key={c._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="flex flex-col items-center gap-3">
                <img src={c.candidateImage ? `http://localhost:3000/upload/${c.candidateImage}` : "/default-avatar.png"} alt={c.name} className="w-28 h-28 rounded-full object-cover border-2 border-indigo-500/50" />
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{c.name}</div>
                  <div className="text-slate-300">{c.partyName}</div>
                </div>
                <button
                  onClick={() => votingActive && navigate(`/vote/${c._id}`)}
                  disabled={!votingActive}
                  className={`w-full px-4 py-2 rounded-lg text-white ${
                    votingActive
                      ? 'bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700'
                      : 'bg-white/10 border border-white/10 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {votingActive ? 'Vote' : status === 'ended' ? 'Voting ended' : 'Voting not started'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
