import { useState, useMemo } from "react";
import { createPost } from "../api/posts";
import Icon from "./Icon";

const AVATAR_BASE = "http://localhost:3000/upload/";
const resolveAvatar = (v) => {
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `${AVATAR_BASE}${v}`;
};

export default function CreatePost({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const me = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);
  const meAvatar = resolveAvatar(me?.avatar);
  const initials = (me?.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Please add a title and some content.");
      return;
    }
    try {
      setLoading(true);
      await createPost({ title, content });
      setTitle("");
      setContent("");
      onCreated?.();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <form className="card-body gap-3" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="avatar">
            {meAvatar ? (
              <div className="w-10 rounded-full">
                <img src={meAvatar} alt={me?.name || "User"} />
              </div>
            ) : (
              <div className="placeholder w-10 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center">
                {initials}
              </div>
            )}
          </div>
          <h2 className="card-title">Create a Post</h2>
        </div>
        {error && (
          <div className="alert alert-error">
            <Icon name="warning" size="sm" />
            <span>{error}</span>
          </div>
        )}
        <input
          className="input input-bordered"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea textarea-bordered min-h-28"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end">
          <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
