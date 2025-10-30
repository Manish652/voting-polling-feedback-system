import { useState } from "react";
import Icon from "../components/Icon";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/admin/login", formData);
      localStorage.setItem("adminToken", res.data.token);
      if (res.data.admin) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
      }
      // Dispatch auth state change event
      window.dispatchEvent(new Event('authStateChanged'));
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-gradient-to-br from-error/10 via-warning/10 to-error/10">
      <div className="hero-content flex-col lg:flex-row max-w-6xl w-full">
        {/* Admin Info Section */}
        <div className="text-center lg:text-left lg:w-1/2">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <div className="avatar">
              <div className="w-16 rounded-full bg-gradient-to-br from-error to-warning shadow-lg">
                <div className="flex items-center justify-center h-full text-white text-2xl">
                  <Icon name="shield" size="xl" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-error to-warning bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="py-6 text-lg opacity-80">
            Secure administrative access to manage the voting system, oversee elections, and maintain platform integrity.
          </p>
          
          <div className="alert alert-warning shadow-lg">
            <Icon name="shield" size="lg" />
            <div>
              <h3 className="font-bold">Restricted Access</h3>
              <div className="text-xs">Only authorized administrators can access this portal</div>
            </div>
          </div>
        </div>

        {/* Admin Login Form */}
        <div className="card bg-base-100 w-full max-w-md shadow-2xl border-2 border-error/20 lg:w-1/2">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <div className="avatar mb-4">
                <div className="w-12 rounded-full bg-gradient-to-br from-error to-warning">
                  <div className="flex items-center justify-center h-full text-white">
                    <Icon name="shield" size="lg" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-error">Admin Login</h2>
              <p className="text-base-content/60">Enter your administrative credentials</p>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Admin Email</span>
              </label>
              <div className="relative">
                <Icon name="mail" size="md" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter admin email"
                  className="input input-bordered input-error w-full pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Admin Password</span>
              </label>
              <div className="relative">
                <Icon name="lock" size="md" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter admin password"
                  className="input input-bordered input-error w-full pl-10 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size="md" />
                </button>
              </div>
              <label className="label">
                <a href="#" className="label-text-alt link link-hover text-error">Contact IT support</a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-error ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Admin Portal'}
              </button>
            </div>

            {/* Back to User Login */}
            <div className="text-center mt-4">
              <p className="text-sm">
                Not an admin?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="link link-primary font-medium"
                >
                  User Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
