import PostModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";

// create a new post

export const createPost = async (req,res)=>{
    try{
        const { title , content } = req.body;
        const post = await PostModel.create({
            userId: req.user._id,
            title,
            content

        });
        res.status(201).json(post);

    }catch(error){
        console.error("Create post error",error);
        res.status(500).json({
            message: "Server error"
        })
    }
};
export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("userId", "name email avatar") // include avatar
      .sort({ createdAt: -1 });

    // also fetch comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await CommentModel.find({ postId: post._id })
          .populate("userId", "name email avatar")
          .sort({ createdAt: -1 });
        return { ...post.toObject(), comments };
      })
    );

    res.json(postsWithComments);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { postId, type } = req.body;
    const userId = req.user._id;

    let post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingReaction = post.reactions.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReaction) {
      existingReaction.type = type; // update reaction
    } else {
      post.reactions.push({ userId, type }); // new reaction
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Add reaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await CommentModel.deleteMany({ postId });
    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
