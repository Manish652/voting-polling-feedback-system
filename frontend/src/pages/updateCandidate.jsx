import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAlert } from "../components/Alert";
import Icon from "../components/Icon";

export default function UpdateCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    partyName: ""
  });
  const [partySymbol, setPartySymbol] = useState(null);
  const [candidateImage, setCandidateImage] = useState(null);
  const [existing, setExisting] = useState({ partySymbol: "", candidateImage: "" });

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.get(`/admin/getCandidate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const c = response.data; // Backend returns candidate directly, not wrapped
      
      if (!c) {
        showAlert("Candidate not found", "error");
        navigate("/admin/candidates");
        return;
      }
      
      setFormData({
        name: c.name || "",
        email: c.email || "",
        dob: c.dob ? c.dob.split("T")[0] : "",
        gender: c.gender || "",
        partyName: c.partyName || ""
      });
      setExisting({ 
        partySymbol: c.partySymbol || "", 
        candidateImage: c.candidateImage || "" 
      });
    } catch (err) {
      console.error(err);
      showAlert("Failed to fetch candidate data", "error");
      navigate("/admin/candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    showConfirm(
      "Are you sure you want to update this candidate?",
      async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("adminToken");
          const formDataObj = new FormData();
          
          Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]);
          });
          
          if (partySymbol) formDataObj.append("partySymbol", partySymbol);
          if (candidateImage) formDataObj.append("candidateImage", candidateImage);

          await api.put(`/admin/updateCandidate/${id}`, formDataObj, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });

          showAlert("Candidate updated successfully!", "success");
          navigate("/admin/candidates");
        } catch (err) {
          console.error(err);
          const d = err.response?.data;
          showAlert(d?.message || d?.error || "Failed to update candidate", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title text-2xl">
                <Icon name="edit" size="lg" className="mr-2" />
                Update Candidate
              </h2>
              <button 
                type="button" 
                onClick={() => navigate("/admin/candidates")} 
                className="btn btn-ghost btn-sm"
              >
                ← Back to list
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter full name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="input input-bordered" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="input input-bordered" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleChange} 
                    className="input input-bordered" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="select select-bordered" 
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Party Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="partyName" 
                    placeholder="Enter party name" 
                    value={formData.partyName} 
                    onChange={handleChange} 
                    className="input input-bordered" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Party Symbol</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setPartySymbol(e.target.files[0])} 
                    className="file-input file-input-bordered" 
                  />
                  {existing.partySymbol && (
                    <div className="mt-2">
                      <p className="text-sm text-base-content/70">Current:</p>
                      <div className="avatar">
                        <div className="w-16 rounded">
                          <img src={`http://localhost:3000/uploads/${existing.partySymbol}`} alt="Party Symbol" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Candidate Image</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCandidateImage(e.target.files[0])} 
                    className="file-input file-input-bordered" 
                  />
                  {existing.candidateImage && (
                    <div className="mt-2">
                      <p className="text-sm text-base-content/70">Current:</p>
                      <div className="avatar">
                        <div className="w-16 rounded">
                          <img src={`http://localhost:3000/uploads/${existing.candidateImage}`} alt="Candidate" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate("/admin/candidates")} 
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : (
                    <>
                      <Icon name="edit" size="md" className="mr-2" />
                      Update Candidate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
