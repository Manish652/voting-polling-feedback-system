import { useEffect, useMemo, useState } from "react";
import { reactToPost, fetchComments, addComment, deletePost as apiDeletePost, deleteComment as apiDeleteComment } from "../api/posts";
import Icon from "./Icon";

const REACTIONS = [
  { type: "like", icon: "👍", label: "Like" },
  { type: "love", icon: "❤️", label: "Love" },
  { type: "laugh", icon: "😂", label: "Haha" },
];

const AVATAR_BASE = "http://localhost:3000/upload/";
const resolveAvatar = (v) => {
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `${AVATAR_BASE}${v}`;
};

export default function PostCard({ post, onChanged }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userId = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return (parsed?._id || parsed?.id || null)?.toString() || null;
    } catch { return null; }
  }, []);

  const myReaction = useMemo(() => {
    if (!userId) return null;
    return post.reactions?.find(r => r.userId === userId || r.userId?._id === userId)?.type || null;
  }, [post.reactions, userId]);

  const counts = useMemo(() => {
    const map = {};
    (post.reactions || []).forEach(r => { map[r.type] = (map[r.type] || 0) + 1; });
    return map;
  }, [post.reactions]);

  const handleReact = async (type) => {
    try {
      await reactToPost(post._id, type);
      onChanged?.();
    } catch (e) {
      // optionally surface error
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    if (!userId || post.userId?._id !== userId) return;
    try {
      setDeleting(true);
      await apiDeletePost(post._id);
      onChanged?.();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const toggleComments = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetchComments(post._id);
        setComments(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setPostingComment(true);
      await addComment(post._id, commentText.trim());
      setCommentText("");
      const res = await fetchComments(post._id);
      setComments(res.data || []);
      onChanged?.();
    } catch (e) {
      console.error(e);
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiDeleteComment(commentId);
      // Optimistically remove from local list
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onChanged?.();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to delete comment");
    }
  };

  const created = new Date(post.createdAt);
  const authorAvatar = resolveAvatar(post.userId?.avatar);
  const authorInitial = post.userId?.name?.charAt(0)?.toUpperCase() || "U";
  const postOwnerId = typeof post.userId === 'string' ? post.userId : post.userId?._id;
  const isOwner = userId && postOwnerId && postOwnerId.toString() === userId.toString();

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <div className="avatar">
            {authorAvatar ? (
              <div className="w-10 rounded-full">
                <img src={authorAvatar} alt={post.userId?.name || "User"} />
              </div>
            ) : (
              <div className="placeholder w-10 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center">
                {authorInitial}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{post.userId?.name || "User"}</div>
                <div className="text-xs opacity-60">{created.toLocaleString()}</div>
              </div>
              {isOwner && (
                <button
                  className={`btn btn-ghost btn-xs text-error ${deleting ? 'loading' : ''}`}
                  onClick={handleDeletePost}
                  title="Delete post"
                  disabled={deleting}
                >
                  {!deleting && <Icon name="trash" size="sm" />}
                </button>
              )}
            </div>
            <h3 className="text-lg font-bold mt-2">{post.title}</h3>
            <p className="mt-1 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {REACTIONS.map(r => (
            <button
              key={r.type}
              className={`btn btn-sm ${myReaction === r.type ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => handleReact(r.type)}
            >
              {r.icon}
              <span className="ml-1">{counts[r.type] || 0}</span>
            </button>
          ))}
          <button className="btn btn-sm btn-ghost" onClick={toggleComments}>
            Add-Comment: ✍️ 
            
            <span className="ml-1">{comments.length || post.comments?.length || 0}</span>
          </button>
        </div>

        {commentsOpen && (
          <div className="mt-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner"></span>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-sm opacity-70">No comments yet.</div>
                ) : comments.map(c => {
                  const cAvatar = resolveAvatar(c.userId?.avatar);
                  const cInitial = c.userId?.name?.charAt(0)?.toUpperCase() || 'U';
                  const commentOwnerId = typeof c.userId === 'string' ? c.userId : c.userId?._id;
                  const isCommentOwner = userId && commentOwnerId && commentOwnerId.toString() === userId.toString();
                  return (
                    <div key={c._id} className="flex gap-3">
                      <div className="avatar">
                        {cAvatar ? (
                          <div className="w-8 rounded-full">
                            <img src={cAvatar} alt={c.userId?.name || 'User'} />
                          </div>
                        ) : (
                          <div className="placeholder w-8 rounded-full bg-base-200 text-base-content flex items-center justify-center text-xs font-bold">
                            {cInitial}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm"><span className="font-medium">{c.userId?.name || 'User'}</span> <span className="opacity-60 text-xs">{new Date(c.createdAt).toLocaleString()}</span></div>
                          {isCommentOwner && (
                            <button className="btn btn-ghost btn-xs text-error" title="Delete comment" onClick={() => handleDeleteComment(c._id)}>
                              🗑️
                            </button>
                          )}
                        </div>
                        <div className="text-sm">{c.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={submitComment} className="mt-3 flex gap-2">
              <input
                className="input input-bordered flex-1"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className={`btn btn-primary ${postingComment ? 'loading' : ''}`} disabled={postingComment}>
                {postingComment ? 'Posting' : 'Comment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
