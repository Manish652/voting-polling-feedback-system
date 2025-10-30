import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: "", options: ["", ""], startAt: "", endAt: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [token, navigate]);

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const showMessage = (msg, timeout = 3000) => {
    setMessage(msg);
    if (timeout) setTimeout(() => setMessage(""), timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim())) {
      showMessage("Please fill in all fields");
      return;
    }

    // Validate schedule
    if (!formData.startAt || !formData.endAt) {
      showMessage("Please select start and end time");
      return;
    }
    const start = new Date(formData.startAt);
    const end = new Date(formData.endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      showMessage("Invalid start or end datetime");
      return;
    }
    if (end <= start) {
      showMessage("End time must be after start time");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/admin/poll/createPoll", {
        question: formData.question.trim()
        , options: formData.options.filter(opt => opt.trim())
        , startAt: start.toISOString()
        , endAt: end.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Success: reset form and navigate
      setFormData({ question: "", options: ["", ""], startAt: "", endAt: "" });
      navigate("/admin/dashboard");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 transition-all duration-200";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-slate-200">{message}</div>
        )}
        <div className="bg-white/5 rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create New Poll</h1>
            <p className="text-slate-300">Engage your community with interactive polls</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-slate-200 mb-3">Poll Question</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="What would you like to ask?"
                className={`${inputClass} resize-none`}
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, startAt: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, endAt: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-lg font-semibold text-slate-200">Poll Options</label>
                <button
                  type="button"
                  onClick={addOption}
                  disabled={formData.options.length >= 6}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className={inputClass}
                        required
                      />
                      <div className="absolute inset-y-0 left-3 flex items-center">
                       
                      </div>
                    </div>
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-rose-300 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-2">Minimum 2 options, maximum 6 options</p>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-600 text-white hover:from-indigo-600 hover:to-sky-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}