import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddCandidateForm({ token, onAdded }) {
  const navigate = useNavigate();
  const authToken = token || localStorage.getItem("adminToken");
  const [formData, setFormData] = useState({ name: "", email: "", dob: "", gender: "", partyName: "" });
  const [partySymbol, setPartySymbol] = useState(null);
  const [candidateImage, setCandidateImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authToken) navigate("/admin/login");
  }, [authToken, navigate]);

  const inputClass = "w-full rounded-xl p-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200";

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (partySymbol) data.append("partySymbol", partySymbol);
      if (candidateImage) data.append("candidateImage", candidateImage);

      await axios.post("/admin/addCandidate", data, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" },
      });

      setFormData({ name: "", email: "", dob: "", gender: "", partyName: "" });
      setPartySymbol(null);
      setCandidateImage(null);

      if (onAdded) onAdded();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Add Candidate</h2>
        <button type="button" onClick={() => navigate("/admin/candidates")} className="text-sm text-indigo-300 hover:underline">View all</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className={inputClass} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} required />
        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        <input type="text" name="partyName" placeholder="Party Name" value={formData.partyName} onChange={handleChange} className={inputClass} required />
        <div>
          <input type="file" accept="image/*" onChange={e => setPartySymbol(e.target.files[0])} className="border border-white/20 bg-white/5 text-white rounded-xl p-2 w-full" />
          {partySymbol && (
            <img src={URL.createObjectURL(partySymbol)} alt="Party Symbol Preview" className="mt-2 h-24 object-cover rounded" />
          )}
        </div>
        <div>
          <input type="file" accept="image/*" onChange={e => setCandidateImage(e.target.files[0])} className="border border-white/20 bg-white/5 text-white rounded-xl p-2 w-full" />
          {candidateImage && (
            <img src={URL.createObjectURL(candidateImage)} alt="Candidate Preview" className="mt-2 h-24 object-cover rounded" />
          )}
        </div>
      </div>
      <button disabled={submitting} type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 text-white shadow-lg font-semibold transition duration-200">
        {submitting ? "Adding..." : "Add Candidate"}
      </button>
    </form>
  );
}
