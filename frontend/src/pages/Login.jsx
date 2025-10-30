import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAlert } from "../components/Alert";
import Icon from "../components/Icon";

export default function Login() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", formData);
      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      // Dispatch auth state change event
      window.dispatchEvent(new Event('authStateChanged'));
      showAlert("Login successful!", "success");
      navigate("/dashboard");
    } catch (error) {
      showAlert(error.response?.data?.message || "Login failed. Please check your credentials and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl w-full">
        {/* Hero Text Section */}
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="py-6 text-lg opacity-80">
            Sign in to access your voting dashboard, participate in polls, and make your voice heard in the democratic process.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <div className="stat bg-base-100 rounded-box shadow-sm">
              <div className="stat-value text-primary text-2xl">
                <Icon name="shield" size="xl" />
              </div>
              <div className="stat-title">Secure Voting</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow-sm">
              <div className="stat-value text-secondary text-2xl">
                <Icon name="chart-bar" size="xl" />
              </div>
              <div className="stat-title">Real-time Results</div>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="card bg-base-100 w-full max-w-md shadow-2xl lg:w-1/2">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold">Sign In</h2>
              <p className="text-base-content/60">Enter your credentials to continue</p>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-10 pr-10"
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
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Admin Login Button */}
            <button 
              type="button"
              onClick={() => navigate("/admin/login")}
              className="btn btn-outline btn-secondary"
            >
              Admin Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="link link-primary font-medium">
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
