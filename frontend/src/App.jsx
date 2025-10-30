import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VoteResult from "./pages/VoteResult";
import GiveVote from "./pages/GiveVote";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateCandidate from "./pages/updateCandidate";
import CreatePoll from "./pages/CreatePoll";
import UserPolls from "./pages/UserPolls";
import AddCandidateForm from "./components/AddCandidateForm";
import CandidateList from "./components/CandidateList";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";
import Home from "./pages/Home";
import AdminSettings from "./pages/AdminSettings";
import BrowseCandidates from "./pages/BrowseCandidates";
import Posts from "./pages/Posts";
import NewPost from "./pages/NewPost";

function App() {
  return (
    <Layout>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vote/:id" element={<GiveVote />} />
        <Route path="/results" element={<VoteResult />} />
        <Route path="/polls" element={<UserPolls />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/candidates" element={<BrowseCandidates />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/new" element={<NewPost />} />

        {/* Admin routes */}
        <Route path="/admin/add-candidate" element={<AddCandidateForm/>}/>
        <Route path="/admin/candidates" element ={<CandidateList/>}/>
        <Route path="/admin/create-poll" element={<CreatePoll/>}/>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/update/:id" element={<UpdateCandidate/>}/>
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Layout>
  );
}

export default App;
