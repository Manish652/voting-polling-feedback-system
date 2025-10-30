import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, questionId: null });

  const [newQuestion, setNewQuestion] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [message, setMessage] = useState("");
  const [confirmData, setConfirmData] = useState(null); // { id, message }

  const navigate = useNavigate();

  const fetchAll = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("/admin/feedback/getAllFeedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load feedback";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackQuestions = async () => {
    try {
      setQuestionsLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("/feedback/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(response.data || []);
    } catch (err) {
      setQuestionsError("Failed to load feedback questions");
      console.error("Error fetching questions:", err);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setCreateSuccess("");
    setCreateError("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    try {
      setCreating(true);
      await axios.post(
        "/admin/feedback/createFeedbackQuestion",
        { question: newQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreateSuccess("Question created");
      setNewQuestion("");
      fetchAll();
      fetchFeedbackQuestions();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create question";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFeedback = (id) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return navigate("/admin/login");
    setConfirmData({ id, message: "Delete this feedback? This action cannot be undone." });
    navigate("/admin/feedback");
  };

  const confirmDelete = async () => {
    if (!confirmData) return;
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`/admin/feedback/deleteFeedback/${confirmData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(prev => prev.filter(item => item._id !== confirmData.id));
      setMessage("Feedback deleted");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to delete feedback");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setConfirmData(null);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`/admin/feedback/deleteQuestion/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Success (axios would throw on non-2xx)
      setQuestions(prev => prev.filter(q => q._id !== questionId));
      setMessage("Question deleted successfully");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete question';
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 3000);
    }
    setDeleteConfirm({ show: false, questionId: null });
  };

  useEffect(() => {
    fetchAll();
    fetchFeedbackQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className="min-h-[60vh]">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-4">All Feedback</h1>
        <p className="text-slate-300 mb-6">Anonymous feedback will hide user identity.</p>

        {message && (
          <div className="mb-4 text-slate-200 bg-white/10 border border-white/10 rounded px-3 py-2 text-center">{message}</div>
        )}

        {/* Create Question */}
        <div className="mb-8 p-4 border border-white/10 rounded-xl bg-slate-900/40">
          <h2 className="text-white font-semibold mb-3">Create Feedback Question</h2>
          <form onSubmit={handleCreateQuestion} className="flex gap-3 items-start flex-col sm:flex-row">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter a question (e.g., How was your experience?)"
              className="flex-1 w-full rounded-lg bg-slate-900/40 border border-white/10 text-white p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={creating || !newQuestion.trim()}
              className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
          {createError && (
            <div className="mt-2 text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3">{createError}</div>
          )}
          {createSuccess && (
            <div className="mt-2 text-emerald-300 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">{createSuccess}</div>
          )}
        </div>

        {loading && <div className="text-slate-300">Loading...</div>}
        {error && (
          <div className="text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <ul className="space-y-4">
            {items.map((fb) => (
              <li key={fb._id} className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-md border ${fb.isAnonymous ? "text-amber-300 border-amber-400/30 bg-amber-900/20" : "text-emerald-300 border-emerald-400/30 bg-emerald-900/20"}`}>
                    {fb.isAnonymous ? "Anonymous" : "Authorized"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>
                {fb.question && (
                  <div className="text-sm text-indigo-300 mb-1">Q: {fb.question}</div>
                )}
                <p className="text-slate-100 whitespace-pre-wrap">{fb.message}</p>
                <div className="mt-2 text-sm text-slate-300 flex items-center justify-between">
                  {fb.user ? (
                    <span>
                      From: <span className="text-white font-medium">{fb.user.name}</span>
                      {fb.user.email ? ` • ${fb.user.email}` : ""}
                    </span>
                  ) : (
                    <span className="italic text-slate-400">User hidden</span>
                  )}
                  <button onClick={() => handleDeleteFeedback(fb._id)} className="text-red-300 hover:text-red-200 text-xs border border-red-400/30 rounded px-2 py-1 ml-3">
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-slate-300">No feedback yet.</li>
            )}
          </ul>
        )}

        {/* Feedback Questions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Feedback Questions</h2>
          {questionsLoading ? (
            <p className="text-slate-400">Loading questions...</p>
          ) : questionsError ? (
            <p className="text-red-400">{questionsError}</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div 
                  key={question._id} 
                  className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div>
                    <p className="text-white">{question.question}</p>
                    <p className="text-sm text-slate-400">
                      Created: {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm({ show: true, questionId: question._id })}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    disabled={items.some(item => item.questionId === question._id)}
                    title={items.some(item => item.questionId === question._id) 
                      ? "Cannot delete - has responses" 
                      : "Delete question"}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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

        {/* Delete Question Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, questionId: null })}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteQuestion(deleteConfirm.questionId)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
