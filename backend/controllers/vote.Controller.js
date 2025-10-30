import VoteModel from "../models/VoteModel.js";
import CandidateModel from "../models/CandidateModel.js";
import SettingModel from "../models/SettingsModel.js";

export const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user._id;

    const settings = await SettingModel.findOne({});
    if (!settings) return res.status(400).json({ message: "Voting settings not configured" });

    const now = new Date();
    const start = new Date(settings.candidateVoteStart);
    const end = new Date(settings.candidateVoteEnd);

    // check voting window (date + time)
    if (isNaN(start) || isNaN(end) || now < start || now > end) {
      return res.status(403).json({ message: "Voting is not active right now" });
    }

    // derive status dynamically
    const dynamicallyActive = now >= start && now <= end;
    if (!dynamicallyActive) {
      return res.status(403).json({ message: "Voting is currently inactive" });
    }

    let existingVote = await VoteModel.findOne({ userId });

    if (existingVote) {
      existingVote.candidateId = candidateId;
      await existingVote.save();
      res.json({ message: "Vote updated successfully!" });
    } else {
      await VoteModel.create({ userId, candidateId });
      res.json({ message: "Vote cast successfully!" });
    }
  } catch (error) {
    console.error("Cast vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getResults = async (req, res) => {
  try {
    const settings = await SettingModel.findOne({});
    if (!settings) return res.status(400).json({ message: "Settings not configured" });

    const now = new Date();
    const end = new Date(settings.candidateVoteEnd);

    if (isNaN(end) || now < end) {
      return res.status(403).json({ message: "Results can only be published after voting ends" });
    }

    if (!settings.isPublished) {
      return res.status(403).json({ message: "Results are not published yet" });
    }


    const results = await VoteModel.aggregate([
      { $group: { _id: "$candidateId", votes: { $sum: 1 } } },
      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidate"
        }
      },
      { $unwind: "$candidate" },
      {
        $project: {
          _id: 0,
          candidateId: "$_id",
          name: "$candidate.name",
          partyName: "$candidate.partyName",
          candidateImage: "$candidate.candidateImage",
          partySymbol: "$candidate.partySymbol",
          voteCount: "$votes"
        }
      },
      { $sort: { voteCount: -1 } }
    ]);

    res.json(results);
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserVote = async (req, res) => {
  try {
    const userId = req.user._id;
    const vote = await VoteModel.findOne({ userId });
    if (!vote) return res.json({ hasVoted: false, candidate: null });

    const candidate = await CandidateModel.findById(vote.candidateId);
    return res.json({ hasVoted: true, candidate });
  } catch (error) {
    console.error("Get user vote error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
