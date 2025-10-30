import { useEffect, useState, useMemo } from "react";
import { fetchPosts } from "../api/posts";
import PostCard from "../components/PostCard";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await fetchPosts();
      setPosts(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const isLoggedIn = useMemo(() => Boolean(localStorage.getItem("token")), []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="opacity-70">Discuss, share updates, and react to posts</p>
        </div>
        {isLoggedIn && (
          <a href="/posts/new" className="btn btn-primary">Start a thread</a>
        )}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="alert">
            <span>No posts yet. {isLoggedIn ? "Be the first to start a thread!" : "Login to start a thread."}</span>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onChanged={loadPosts} />
          ))
        )}
      </div>
    </div>
  );
}
