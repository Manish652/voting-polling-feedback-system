import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Icon from "../components/Icon";

export default function UserPolls() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({}); // Tracks if a specific vote is in progress
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPolls();
  }, [token]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      if (token) {
        const response = await axios.get("/users/poll/getpollsforuser", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPolls(response.data);
      } else {
        const response = await axios.get("/users/poll/public");
        setPolls((response.data || []).map(p => ({ ...p, hasVoted: false })));
      }
    } catch (err) {
      console.error("Failed to fetch polls:", err);
      setMessage(err.response?.data?.message || "Failed to load polls");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Prevent multiple clicks while a vote is being processed for this poll
    if (voting[pollId]) return;

    const pollToVote = polls.find(p => p._id === pollId);
    if (pollToVote && pollToVote.hasVoted) {
      // already voted, silently ignore
      return;
    }

    setVoting(prev => ({ ...prev, [pollId]: true }));
    try {
      await axios.post(`/users/poll/${pollId}/vote`, 
        { optionIndex }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPolls();
    } catch (err) {
      console.error("Error casting vote:", err);
      setMessage(err.response?.data?.message || "Failed to cast vote");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setVoting(prev => ({ ...prev, [pollId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading polls...</p>
        </div>
      </div>
    );
  }

  const renderPollOption = (poll, option, index) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
    const isVoting = voting[poll._id];
    const userHasVoted = poll.hasVoted;
    const canVote = Boolean(token) && poll.status === 'active' && !userHasVoted;

    return (
      <div key={index} className="relative">
        <button
          onClick={() => handleVote(poll._id, index)}
          disabled={!canVote || isVoting}
          className={`w-full p-4 text-left rounded-2xl border transition-all duration-300 ${
            !canVote || isVoting
              ? 'border-white/10 bg-white/5 cursor-not-allowed opacity-75' 
              : 'border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white">{option.text}</span>
            <span className="text-xs font-semibold text-sky-300 bg-sky-500/10 ring-1 ring-sky-500/20 px-2 py-1 rounded-lg">
              {option.votes} votes
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-sky-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-400">
              {percentage}% of total votes
            </span>
            {userHasVoted && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-1 rounded-lg">Voted</span>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-slate-200">
            {message}
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Community Polls</h1>
          <p className="text-slate-300">Cast your vote and see what others think</p>
        </div>

        {polls.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-12 text-center">
            <div className="text-6xl mb-4">
              <Icon name="chart-bar" size="6xl" className="text-white/60" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No polls available</h3>
            <p className="text-slate-300">Check back later for new community polls!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => (
              <div key={poll._id} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300">
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{poll.question}</h2>
                    <span className="text-xs text-slate-300 bg-white/5 ring-1 ring-white/10 px-2 py-1 rounded-lg">{new Date(poll.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
                  </p>
                  <p className="text-slate-400 text-2xl mt-1">
                    Status: <span className="text-slate-200 font-medium">{poll.status}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  {poll.options.map((option, index) => renderPollOption(poll, option, index))}
                </div>

                {poll.hasVoted && (
                  <div className="mt-4 text-center p-3 bg-emerald-500/10 text-emerald-300 rounded-lg ring-1 ring-emerald-500/20">
                    <p className="font-semibold">You have already voted in this poll!</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
