import CandidateCard from "./CandidateCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "../api/axios";
import { FaPlus } from "react-icons/fa";

export default function CandidateList({ candidates = null, token, onUpdated }) {
  const navigate = useNavigate();
  const authToken = token || localStorage.getItem("adminToken");
  const [list, setList] = useState(Array.isArray(candidates) ? candidates : []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!authToken) navigate("/admin/login");
  }, [authToken, navigate]);

  const fetchCandidates = useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const res = await axios.get("/admin/getCandidate", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setList(res.data || []);
    } catch (err) {
      console.error(err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (Array.isArray(candidates)) {
      setList(candidates);
    }
  }, [candidates]);

  useEffect(() => {
    if (Array.isArray(candidates)) return;
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    fetchCandidates();
  }, [candidates, fetchCandidates]);

  const handleUpdated = () => {
    if (onUpdated) onUpdated();
    fetchCandidates();
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(c =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.partyName || "").toLowerCase().includes(q)
    );
  }, [list, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-base-200/30 rounded-2xl">
        <h2 className="text-3xl font-bold">Candidates</h2>
        <div className="join w-full md:w-auto">
          <div className="w-full md:w-80">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input input-bordered join-item w-full" 
              placeholder="Search by name or party..."/>
          </div>
          <button className="btn join-item">Search</button>
        </div>
        <button 
          onClick={() => navigate('/admin/add-candidate')}
          className="btn btn-primary">
          <FaPlus /> Add Candidate
        </button>
      </div>

      {loading && list.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 w-full p-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="hero min-h-[30vh] bg-base-200 rounded-2xl">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">😕</h1>
              <p className="py-6 text-xl font-semibold">No candidates found. Try adjusting your search or add a new candidate.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300">
          {filtered.map(c => (
            <CandidateCard
              key={c._id}
              candidate={c}
              token={authToken}
              onDeleted={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}