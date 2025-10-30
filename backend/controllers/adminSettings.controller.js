import SettingModel from "../models/SettingsModel.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await SettingModel.findOne({});
    if (!settings) return res.json(null);

    const now = new Date();
    const start = new Date(settings.candidateVoteStart);
    const end = new Date(settings.candidateVoteEnd);

    let derivedStatus = "not-started";
    if (!isNaN(start) && !isNaN(end)) {
      if (now >= start && now <= end) derivedStatus = "active";
      else if (now > end) derivedStatus = "ended";
    }

    let updates = {};
    if (settings.status !== derivedStatus) updates.status = derivedStatus;
    if (derivedStatus !== "ended" && settings.isPublished) updates.isPublished = false;

    let latest = settings;
    if (Object.keys(updates).length) {
      latest = await SettingModel.findOneAndUpdate({}, updates, { new: true });
    }

    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let { candidateVoteStart, candidateVoteEnd, isPublished } = req.body;

    // Convert to Date objects (important if coming as string from frontend)
    const start = new Date(candidateVoteStart);
    const end = new Date(candidateVoteEnd);
    const now = new Date();

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }
    if (end <= start) {
      return res.status(400).json({ message: "End date-time must be after start date-time" });
    }

    // --- Calculate status ---
    let status = "not-started";
    if (now >= start && now <= end) status = "active";
    if (now > end) status = "ended";

    // --- Restrict publishing before vote ends ---
    if (status !== "ended") {
      isPublished = false; // override to prevent early publishing
    }

    const settings = await SettingModel.findOneAndUpdate(
      {},
      {
        candidateVoteStart: start,
        candidateVoteEnd: end,
        status,
        isPublished,
      },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Public endpoint: expose only status and schedule for users (no admin auth needed)
export const getPublicStatus = async (req, res) => {
  try {
    const settings = await SettingModel.findOne({});
    if (!settings) return res.json({ status: "not-started", candidateVoteStart: null, candidateVoteEnd: null });

    const now = new Date();
    const start = new Date(settings.candidateVoteStart);
    const end = new Date(settings.candidateVoteEnd);

    let status = "not-started";
    if (!isNaN(start) && !isNaN(end)) {
      if (now >= start && now <= end) status = "active";
      else if (now > end) status = "ended";
    }

    return res.json({
      status,
      candidateVoteStart: settings.candidateVoteStart,
      candidateVoteEnd: settings.candidateVoteEnd,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
