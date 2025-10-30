import PollModel from "../models/PollModel.js";

export const CreatePoll = async (req, res) => {
  try {
    const { question, options, startAt, endAt } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Provide at least two options" });
    }
    const cleanedOptions = options
      .map((o) => (typeof o === "string" ? o.trim() : (o?.text || "").trim()))
      .filter((t) => t);
    if (cleanedOptions.length < 2) {
      return res.status(400).json({ message: "Options must be non-empty" });
    }

    const start = new Date(startAt);
    const end = new Date(endAt);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }
    if (end <= start) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const poll = await PollModel.create({
      question: question.trim(),
      options: cleanedOptions.map((text) => ({ text, votes: 0 })),
      startAt: start,
      endAt: end,
    });

    return res.status(201).json(poll);
  } catch (err) {
    console.error("CreatePoll error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all polls (admin)
export const getPolls = async (req, res) => {
  try {
    const polls = await PollModel
      .find({}, { question: 1, createdAt: 1, startAt: 1, endAt: 1, options: 1, status: 1 }) // projection 
      .sort({ createdAt: -1 })
      .lean();
    return res.json(polls);
  } catch (err) {
    console.error("getPolls error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a poll by id (admin)
export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PollModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Poll not found" });
    return res.json({ message: "Poll deleted" });
  } catch (err) {
    console.error("deletePoll error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};