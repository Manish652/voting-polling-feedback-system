import api from "./axios";

// Posts
export const fetchPosts = () => api.get("/post");
export const createPost = (data) => api.post("/post", data); // { title, content }
export const deletePost = (postId) => api.delete(`/post/${postId}`);

// Reactions
export const reactToPost = (postId, type) => api.post("/post/reaction", { postId, type });

// Comments
export const fetchComments = (postId) => api.get(`/post/comment/${postId}`);
export const addComment = (postId, content) => api.post("/post/comment", { postId, content });
export const deleteComment = (commentId) => api.delete(`/post/comment/${commentId}`);
