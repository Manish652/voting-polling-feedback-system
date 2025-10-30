import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Feedback() {
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const res = await axios.get("/feedback/questions");
        setQuestions(res.data || []);
        if ((res.data || []).length > 0) {
          setSelectedQuestionId(res.data[0]._id);
        }
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load questions";
        setQuestionError(msg);
      } finally {
        setQuestionsLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const endpoint = isAnonymous
      ? "/feedback/submit/anonymous"
      : "/feedback/submit/auth";

    // For authenticated submission, require token and redirect to login if missing
    let headers = {};
    if (!isAnonymous) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      headers = { Authorization: `Bearer ${token}` };
    }

    try {
      setLoading(true);
      await axios.post(
        endpoint,
        { message, questionId: selectedQuestionId },
        { headers }
      );
      setSuccess(
        isAnonymous
          ? "Your anonymous feedback was submitted. Thank you!"
          : "Your feedback was submitted. Thank you!"
      );
      setMessage("");
      setIsAnonymous(false);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to submit feedback";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh]">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-4">Share your feedback</h1>
        <p className="text-slate-300 mb-6">
          Select a question and write your feedback. You can choose to send feedback anonymously.
        </p>

        {questionsLoading && (
          <div className="text-slate-300 mb-4">Loading questions...</div>
        )}
        {questionError && (
          <div className="text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3 mb-4">
            {questionError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-2">Question</label>
            <select
              className="w-full rounded-lg bg-slate-900/40 border border-white/10 text-white p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              disabled={questionsLoading || (questions || []).length === 0}
              required
            >
              {(questions || []).map((q) => (
                <option key={q._id} value={q._id} className="bg-slate-900">
                  {q.question}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-200 mb-2">Message</label>
            <textarea
              className="w-full min-h-36 rounded-lg bg-slate-900/40 border border-white/10 text-white p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your feedback here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-3 text-slate-200">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4"
            />
            Send anonymously
          </label>

          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}
          {success && (
            <div className="text-emerald-300 bg-emerald-900/20 border border-emerald-500/20 rounded-lg p-3">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              questionsLoading ||
              !selectedQuestionId ||
              !message.trim()
            }
            className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
