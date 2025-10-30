import PollModel from "../models/PollModel.js";

function deriveStatus(poll) {
  const now = new Date();
  const start = new Date(poll.startAt);
  const end = new Date(poll.endAt);
  if (isNaN(start) || isNaN(end)) return "upcoming";
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "inactive";
}
export const getUserPolls = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch polls with only needed fields
    const polls = await PollModel.find(
      {},
      { question: 1, options: 1, createdAt: 1, startAt: 1, endAt: 1, votedUsers: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    // Add status and hasVoted flag
    const pollsWithStatus = polls.map((poll) => ({
      ...poll,
      status: deriveStatus(poll),
      hasVoted: poll.votedUsers?.includes(userId) || false, // simpler check
    }));

    // Send response without votedUsers
    res.json(pollsWithStatus.map(({ votedUsers, ...rest }) => rest));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Public: anyone can view poll list and current results
export const getPublicPolls = async (req, res) => {
  try {
    const polls = await PollModel.find({}, { question: 1, options: 1, createdAt: 1, startAt: 1, endAt: 1 }).sort({ createdAt: -1 }).lean();
    const shaped = polls.map((p) => ({
      _id: p._id,
      question: p.question,
      options: p.options,
      createdAt: p.createdAt,
      startAt: p.startAt,
      endAt: p.endAt,
      status: deriveStatus(p),
    }));
    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Vote in a poll (for users)
export const voteUserPoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await PollModel.findById(req.params.pollId);
    const userId = req.user._id; // voterID

    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Enforce voting window
    const now = new Date();
    if (!poll.startAt || !poll.endAt) {
      return res.status(400).json({ message: "Poll schedule is not configured" });
    }
    if (now < poll.startAt) {
      return res.status(403).json({ message: "Poll has not started yet" });
    }
    if (now > poll.endAt) {
      return res.status(403).json({ message: "Poll has ended" });
    }

    // Check if user has already voted in this poll 
   if (poll.votedUsers?.includes(userId)) {
  return res.status(400).json({ message: "You have already voted in this poll!" });
}

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index" });
    }

    poll.options[optionIndex].votes += 1;
    poll.votedUsers.push(userId); // Add user to votedUsers list
    await poll.save();

    res.json({
      _id: poll._id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt,
      startAt: poll.startAt,
      endAt: poll.endAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
