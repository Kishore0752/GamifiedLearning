const Contest = require('../models/Contest');
const User = require('../models/User');

// Create a new contest
exports.createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, difficulty, prize } = req.body;
        const contest = new Contest({
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            difficulty,
            prize,
            participants: [],
            createdAt: new Date()
        });
        await contest.save();
        res.status(201).json({ message: "Contest created successfully", contest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all contests
exports.getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find().sort({ startTime: -1 });
        res.json(contests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific contest by ID
exports.getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }
        res.json(contest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Join a contest
exports.joinContest = async (req, res) => {
    try {
        const { contestId, userId } = req.body;
        const contest = await Contest.findByIdAndUpdate(
            contestId,
            { $addToSet: { participants: userId } },
            { new: true }
        );
        
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }
        
        res.json({ message: "Joined contest successfully", contest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Leave a contest
exports.leaveContest = async (req, res) => {
    try {
        const { contestId, userId } = req.body;
        const contest = await Contest.findByIdAndUpdate(
            contestId,
            { $pull: { participants: userId } },
            { new: true }
        );
        
        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }
        
        res.json({ message: "Left contest successfully", contest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Submit contest solution
exports.submitSolution = async (req, res) => {
    try {
        const { contestId, userId, solution } = req.body;
        const contest = await Contest.findByIdAndUpdate(
            contestId,
            { 
                $push: { 
                    submissions: {
                        userId,
                        solution,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );
        
        res.json({ message: "Solution submitted successfully", contest });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
