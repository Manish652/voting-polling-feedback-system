import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAlert } from "../components/Alert";

export default function Signup() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    vill: "",
    po: "",
    ps: "",
    dist: "",
    state: "",
    pincode: "",
    password: "",
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validators = {
    name: (v) => (!v ? "Name is required" : undefined),
    email: (v) => (!v ? "Email is required" : /.+@.+\..+/.test(v) ? undefined : "Enter a valid email"),
    dob: (v) => (!v ? "Date of birth is required" : undefined),
    gender: (v) => (!v ? "Gender is required" : undefined),
    phone: (v) => (!v ? "Phone is required" : /^[0-9]{10}$/.test(v) ? undefined : "Phone must be 10 digits"),
    vill: (v) => (!v ? "Village is required" : undefined),
    po: (v) => (!v ? "Post Office is required" : undefined),
    ps: (v) => (!v ? "Police Station is required" : undefined),
    dist: (v) => (!v ? "District is required" : undefined),
    state: (v) => (!v ? "State is required" : undefined),
    pincode: (v) => (!v ? "Pincode is required" : /^[0-9]{6}$/.test(v) ? undefined : "Pincode must be 6 digits"),
    password: (v) => (!v ? "Password is required" : v.length >= 6 ? undefined : "Password must be at least 6 characters"),
  };

  const validateAll = (data) => {
    const newErr = {};
    Object.keys(validators).forEach((k) => {
      const msg = validators[k](data[k]);
      if (msg) newErr[k] = msg;
    });
    return newErr;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files?.[0] || null }));
      return;
    }
    // Enforce numeric-only for phone and pincode
    let nextVal = value;
    if (name === "phone" || name === "pincode") {
      nextVal = value.replace(/[^0-9]/g, "");
    }
    const updated = { ...formData, [name]: nextVal };
    setFormData(updated);

    // live-validate just this field
    if (validators[name]) {
      const msg = validators[name](nextVal);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErr = validateAll(formData);
    setErrors(newErr);
    if (Object.keys(newErr).length > 0) {
      showAlert("Please fix the highlighted errors and try again.", "error");
      return;
    }

    setLoading(true);
    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image") {
          if (formData.image) formDataObj.append("image", formData.image);
        } else {
          formDataObj.append(key, formData[key]);
        }
      });
      await api.post('/signup', formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showAlert("Account created successfully! Please login.", "success");
      navigate("/login");
    } catch (error) {
      const d = error.response?.data;
      const msg = d?.error || d?.message || d?.details || "Signup failed";
      showAlert(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left panel */}
            <div className="flex flex-col justify-center items-center text-center space-y-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16">
                  <span className="text-2xl font-bold">V</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Join Us!</h1>
                <p className="text-base-content/70 mt-2">
                  Create your account to participate in the democratic process.
                </p>
              </div>
              <div className="space-y-2">
                <Link to="/login" className="btn btn-ghost btn-wide">
                  Already have an account? Login
                </Link>
                <button
                  onClick={() => navigate("/admin/login")}
                  className="btn btn-outline btn-wide"
                >
                  Admin Login
                </button>
              </div>
            </div>

            {/* Right panel - Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Sign Up</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.name ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.name && <span className="text-error text-xs mt-1">{errors.name}</span>}
                </div>
                {/* Email */}
                <div className="form-control">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.email ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
                </div>
                {/* DOB */}
                <div className="form-control">
                  <input 
                    type="date" 
                    name="dob" 
                    value={formData.dob}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.dob ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.dob && <span className="text-error text-xs mt-1">{errors.dob}</span>}
                </div>
                {/* Gender */}
                <div className="form-control">
                  <select name="gender" value={formData.gender} onChange={handleChange} className={`select select-bordered ${errors.gender ? 'select-error' : ''}`} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="text-error text-xs mt-1">{errors.gender}</span>}
                </div>
                {/* Phone */}
                <div className="form-control">
                  <input 
                    type="text" 
                    name="phone" 
                    placeholder="Phone (10 digits)" 
                    value={formData.phone}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.phone ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.phone && <span className="text-error text-xs mt-1">{errors.phone}</span>}
                </div>
                {/* Address fields */}
                <div className="form-control">
                  <input 
                    type="text" 
                    name="vill" 
                    placeholder="Village" 
                    value={formData.vill}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.vill ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.vill && <span className="text-error text-xs mt-1">{errors.vill}</span>}
                </div>
                <div className="form-control">
                  <input 
                    type="text" 
                    name="po" 
                    placeholder="Post Office" 
                    value={formData.po}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.po ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.po && <span className="text-error text-xs mt-1">{errors.po}</span>}
                </div>
                <div className="form-control">
                  <input 
                    type="text" 
                    name="ps" 
                    placeholder="Police Station" 
                    value={formData.ps}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.ps ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.ps && <span className="text-error text-xs mt-1">{errors.ps}</span>}
                </div>
                <div className="form-control">
                  <input 
                    type="text" 
                    name="dist" 
                    placeholder="District" 
                    value={formData.dist}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.dist ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.dist && <span className="text-error text-xs mt-1">{errors.dist}</span>}
                </div>
                <div className="form-control">
                  <input 
                    type="text" 
                    name="state" 
                    placeholder="State" 
                    value={formData.state}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.state ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.state && <span className="text-error text-xs mt-1">{errors.state}</span>}
                </div>
                <div className="form-control">
                  <input 
                    type="text" 
                    name="pincode" 
                    placeholder="Pincode (6 digits)" 
                    value={formData.pincode}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.pincode ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.pincode && <span className="text-error text-xs mt-1">{errors.pincode}</span>}
                </div>
                {/* Password */}
                <div className="form-control">
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password (min 6 characters)" 
                    value={formData.password}
                    onChange={handleChange} 
                    className={`input input-bordered ${errors.password ? 'input-error' : ''}`} 
                    required 
                  />
                  {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
                </div>
              </div>
              
              {/* Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Profile Image (Optional)</span>
                </label>
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleChange} 
                  className="file-input file-input-bordered" 
                  accept="image/*"
                />
              </div>
              
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
