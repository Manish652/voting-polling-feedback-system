import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function GiveVote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [userVote, setUserVote] = useState(null); // Stores the candidate the user voted for
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidateRes, userVoteRes] = await Promise.all([
          axios.get(`/candidate/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/vote/myvote", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCandidate(candidateRes.data);
        setUserVote(userVoteRes.data.candidate || null); // Store the entire candidate object or null
      } catch (err) {
        console.error("Error fetching data:", err);
        setMessage(err.response?.data?.message || "Failed to fetch details");
        setTimeout(() => setMessage(""), 3000);
        navigate("/dashboard"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!candidate) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('/vote/cast', { candidateId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // After casting/changing vote, update userVote state and navigate
      setUserVote(candidate);
      navigate("/results");
    } catch (err) {
      console.error("Error casting/changing vote:", err.response?.data?.message || err.message || err);
      setMessage(err.response?.data?.message || "Error processing vote");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading || !candidate) return <div className="text-center mt-10 text-slate-300">Loading candidate...</div>;

  const hasVotedForThisCandidate = userVote && userVote._id === candidate._id;
  const hasVotedForOtherCandidate = userVote && userVote._id !== candidate._id;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        {message && (
          <div className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-slate-200 text-center">{message}</div>
        )}
        <img 
          src={`http://localhost:3000/upload/${candidate.candidateImage}`} 
          alt={candidate.name} 
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/50"
        />
        <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
        <p className="text-slate-300 font-medium">{candidate.partyName}</p>
        {candidate.partySymbol && (
          <img 
            src={`http://localhost:3000/upload/${candidate.partySymbol}`} 
            alt={candidate.partyName} 
            className="w-20 h-20 object-contain mt-2"
          />
        )}

        {hasVotedForThisCandidate ? (
          <h1 className="text-xl font-bold text-emerald-300 mt-4">You have voted for this candidate!</h1>
        ) : hasVotedForOtherCandidate ? (
          <div className="mt-4 text-center">
            <p className="text-orange-300 font-medium mb-2">You have already voted for {userVote.name}.</p>
            <button 
              onClick={handleVote} 
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white shadow-md"
            >
              Change Vote to {candidate.name}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleVote} 
            className="px-6 py-3 rounded-lg font-semibold mt-4 bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white shadow-md"
          >
            Cast Your Vote
          </button>
        )}
      </div>
    </div>
  );
}
