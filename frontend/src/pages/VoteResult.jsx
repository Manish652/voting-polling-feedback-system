import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function VoteResult() {
  const [candidateResults, setCandidateResults] = useState([]);
  const [pollResults, setPollResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("candidates");
  const [message, setMessage] = useState("");
  const [confirmData, setConfirmData] = useState(null); // { pollId, message }

  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem("adminToken"));
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, [userToken, isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let candidateRes = { data: [] };
      try {
        candidateRes = await axios.get("/vote/results");
      } catch {
        candidateRes = { data: [] };
      }

      let pollRes;
      if (isAdmin) {
        pollRes = await axios.get("/admin/poll/getPolls", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
      } else if (userToken) {
        pollRes = await axios.get("/users/poll/getpollsforuser", {
          headers: { Authorization: `Bearer ${userToken}` }
        });
      } else {
        pollRes = await axios.get("/users/poll/public");
      }

      // If admin: merge full candidate list with vote counts so zero-vote candidates also show
      if (isAdmin) {
        try {
          const allCandidatesRes = await axios.get("/admin/getCandidate", {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          });
          const votesById = new Map(
            (candidateRes.data || []).map(c => [String(c.candidateId || c._id), c.voteCount || 0])
          );
          const merged = (allCandidatesRes.data || []).map(c => ({
            candidateId: c._id,
            name: c.name,
            partyName: c.partyName,
            candidateImage: c.candidateImage,
            partySymbol: c.partySymbol,
            voteCount: votesById.get(String(c._id)) || 0,
          }));
          setCandidateResults(merged);
        } catch (e) {
          // Fallback to whatever results endpoint returned
          setCandidateResults(candidateRes.data || []);
        }
      } else {
        setCandidateResults(candidateRes.data || []);
      }

      setPollResults(pollRes.data || []);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      setMessage(err.response?.data?.message || "Failed to load results");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = (pollId) => {
    if (!isAdmin) return;
    setConfirmData({
      pollId,
      message: "Are you sure you want to delete this poll? This action cannot be undone."
    });
  };

  const confirmDelete = async () => {
    if (!confirmData) return;
    try {
      await axios.delete(`/admin/poll/${confirmData.pollId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      setMessage("Poll deleted successfully");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete poll");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setConfirmData(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading results...</p>
        </div>
      </div>
    );
  }

  const renderCandidateResults = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Candidate Voting Results</h2>
      {candidateResults.length === 0 ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">
            <Icon name="vote" size="6xl" className="text-white/60" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">No results published yet</h3>
          <p className="text-slate-300">Results will appear once published by admin after voting ends.</p>
        </div>
      ) : (
        (() => {
          const totalVotes = candidateResults.reduce((s, c) => s + (c.voteCount || 0), 0);
          const maxVotes = candidateResults.reduce((m, c) => Math.max(m, c.voteCount || 0), 0);
          const lowThreshold = Math.max(1, Math.floor(0.1 * (maxVotes || 0))); // 10% of top, at least 1
          const sorted = [...candidateResults].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

          const chartBase = isAdmin ? sorted : sorted.slice(0, 3);
          const chartData = chartBase.map(c => ({ name: c.name, value: c.voteCount || 0 }));
          const COLORS = [
            "#60A5FA", "#A78BFA", "#34D399", "#FBBF24", "#F472B6", "#22D3EE",
            "#F59E0B", "#10B981", "#818CF8", "#E879F9", "#38BDF8", "#F87171"
          ];

          return (
            <>
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Votes Distribution{!isAdmin && " (Top 3)"}</h3>
                  <div className="text-sm text-slate-300">Total votes: <span className="font-bold text-indigo-300">{totalVotes}</span></div>
                </div>
                {totalVotes === 0 ? (
                  <div className="text-center text-slate-300 py-8">No votes yet to display in chart.</div>
                ) : (
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => [`${val} votes`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((candidate, idx) => {
                  const votes = candidate.voteCount || 0;
                  const isWinner = votes === maxVotes && votes > 0;
                  const isZero = votes === 0;
                  const isLow = !isWinner && !isZero && votes <= lowThreshold;
                  const percent = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                  return (
                    <div key={candidate.candidateId || idx} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-4 hover:shadow-xl transition-all duration-300">
                      <img 
                        src={`http://localhost:3000/upload/${candidate.candidateImage}`} 
                        alt={candidate.name} 
                        className="w-28 h-28 rounded-full object-cover border-2 border-indigo-500/50"
                      />
                      <h3 className="text-xl font-semibold text-center text-white">{candidate.name}</h3>
                      <p className="text-slate-300 text-center">{candidate.partyName}</p>

                      <div className="flex items-center gap-2">
                        {isWinner && (
                          <span className="px-2 py-1 rounded-full border border-yellow-400/30 bg-yellow-500/20 text-yellow-300 text-xs font-semibold flex items-center gap-1">
                            <Icon name="trophy" size="sm" /> Winner
                          </span>
                        )}
                        {isZero && (
                          <span className="px-2 py-1 rounded-full border border-slate-400/30 bg-slate-500/20 text-slate-300 text-xs font-semibold">No votes yet</span>
                        )}
                        {isLow && (
                          <span className="px-2 py-1 rounded-full border border-blue-400/30 bg-blue-500/20 text-blue-300 text-xs font-semibold">Low votes</span>
                        )}
                      </div>

                      <div className="w-full">
                        <div className="flex items-end justify-between mb-1">
                          <div className="text-sm text-slate-400">{percent}% of total votes</div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-300">{votes}</div>
                            <div className="text-sm text-slate-400">votes</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${isWinner ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-sky-600'}`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>

                      {candidate.partySymbol && (
                        <img 
                          src={`http://localhost:3000/upload/${candidate.partySymbol}`} 
                          alt={candidate.partyName} 
                          className="w-16 h-16 object-contain"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()
      )}
    </div>
  );

  const renderPollResults = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Community Poll Results</h2>
      {pollResults.length === 0 ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">
            <Icon name="chart-bar" size="6xl" className="text-white/60" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-2">No polls available</h3>
          <p className="text-slate-300">
            {isAdmin ? "Create your first poll to see results here!" : "Check back later for community polls!"}
          </p>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/create-poll")}
              className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-colors"
            >
              Create Poll
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {pollResults.map((poll) => {
            const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
            const winningOption = poll.options.reduce((winner, current) => 
              current.votes > winner.votes ? current : winner
            );
            return (
              <div key={poll._id} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{poll.question}</h3>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeletePoll(poll._id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 transition-colors"
                        title="Delete Poll"
                      >
                        <Icon name="trash" size="sm" className="mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                    <span>Total Votes: {totalVotes}</span>
                    <span>Options: {poll.options.length}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {poll.options.map((option, index) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                    const isWinning = winningOption && option.votes === winningOption.votes && option.votes > 0;
                    const isZero = option.votes === 0;
                    const isLow = !isZero && !isWinning && option.votes <= Math.max(1, Math.floor(0.1 * (winningOption?.votes || 0)));
                    return (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-slate-200">{option.text}</span>
                            {isWinning && (
                              <span className="px-2 py-1 rounded-full border border-yellow-400/30 bg-yellow-500/20 text-yellow-300 text-xs font-semibold">
                                <Icon name="trophy" size="sm" className="mr-1" />
                                Winner
                              </span>
                            )}
                            {isZero && (
                              <span className="px-2 py-1 rounded-full border border-slate-400/30 bg-slate-500/20 text-slate-300 text-xs font-semibold">No votes yet</span>
                            )}
                            {isLow && (
                              <span className="px-2 py-1 rounded-full border border-blue-400/30 bg-blue-500/20 text-blue-300 text-xs font-semibold">Low votes</span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-indigo-300">{option.votes}</div>
                            <div className="text-sm text-slate-400">votes</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                          <div 
                            className={`h-4 rounded-full transition-all duration-1000 ${
                              isWinning 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                : 'bg-gradient-to-r from-indigo-500 to-sky-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-slate-400">{percentage}% of total votes</span>
                          {isWinning && (
                            <span className="text-sm font-semibold text-yellow-300">
                              Leading with {option.votes} votes
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">{totalVotes}</div>
                      <div className="text-sm text-slate-300">Total Votes</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">{poll.options.length}</div>
                      <div className="text-sm text-slate-300">Options</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">{winningOption ? winningOption.votes : 0}</div>
                      <div className="text-sm text-slate-300">Highest Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-slate-200 text-center">
            {message}
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Results Dashboard</h1>
          <p className="text-slate-300">View voting results and community poll outcomes</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-1 shadow-lg">
            <button
              onClick={() => setActiveTab("candidates")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "candidates"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Icon name="vote" size="sm" className="mr-2" />
              Candidate Votes
            </button>
            <button
              onClick={() => setActiveTab("polls")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "polls"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Icon name="chart-bar" size="sm" className="mr-2" />
              Community Polls
            </button>
          </div>
        </div>

        {activeTab === "candidates" ? renderCandidateResults() : renderPollResults()}

        {/* Confirmation Modal */}
        {confirmData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">{confirmData.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => setConfirmData(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
