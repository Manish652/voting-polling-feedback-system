import CommentModel from "../models/CommentModel.js";

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const comment = await CommentModel.create({
      postId,
      userId: req.user._id,
      content
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments of a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment (author only)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id.toString();

    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
