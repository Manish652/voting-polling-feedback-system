import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [candidateVoteStart, setStart] = useState("");
  const [candidateVoteEnd, setEnd] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [status, setStatus] = useState("not-started");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/settings/getSettings", authHeader);
        if (data) {
          setStart(toLocalInput(data.candidateVoteStart));
          setEnd(toLocalInput(data.candidateVoteEnd));
          setIsPublished(Boolean(data.isPublished));
          setStatus(data.status || "not-started");
        }
      } catch (e) {
        setError(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token, navigate, authHeader]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Basic client validation
    if (!candidateVoteStart || !candidateVoteEnd) {
      setError("Please provide both start and end date-time");
      return;
    }
    if (new Date(candidateVoteEnd) <= new Date(candidateVoteStart)) {
      setError("End must be after start");
      return;
    }

    try {
      setSaving(true);
      const body = {
        candidateVoteStart,
        candidateVoteEnd,
        isPublished,
      };
      const { data } = await api.put("/admin/settings/updateSettings", body, authHeader);
      setMessage("Settings saved successfully");
      setStatus(data.status);
      setIsPublished(Boolean(data.isPublished));
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-4">Voting Settings</h1>

        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
            {error && (
              <div className="mb-4 text-red-300 bg-red-900/30 border border-red-500/40 rounded px-3 py-2">{error}</div>
            )}
            {message && (
              <div className="mb-4 text-emerald-300 bg-emerald-900/30 border border-emerald-500/40 rounded px-3 py-2">{message}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-200 mb-1">Vote Start (date & time)</label>
                <input
                  type="datetime-local"
                  className="w-full bg-black/30 text-white border border-white/10 rounded-lg px-3 py-2"
                  value={candidateVoteStart}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-2 00 mb-1">Vote End (date & time)</label>
                <input
                  type="datetime-local"
                  className="w-full bg-black/30 text-white border border-white/10 rounded-lg px-3 py-2"
                  value={candidateVoteEnd}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-slate-300">Current status: <span className="font-semibold text-white">{status}</span></div>
                <div className="text-slate-400 text-sm">Publish available only after voting ends</div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={status !== "ended"}
                />
                <span className="text-slate-200">Publish results</span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Convert ISO date to local datetime-local input string (YYYY-MM-DDTHH:mm)
function toLocalInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const tzAdjusted = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return tzAdjusted.toISOString().slice(0, 16);
}
