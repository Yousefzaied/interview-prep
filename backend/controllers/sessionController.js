// createSession, getSessionById, getMySessions, deleteSessions

const Session = require("../model/Session.js");
const Questions = require("../model/Questions.js");

//createSession
exports.createSession = async (req, res) => {
    try {
        const {role, experience, topicsToFocus, description, questions} = req.body;
        const userId = req.user._id;

        const session = await Session.create({
            user: userId,
            role,
            experience, 
            topicsToFocus, 
            description, 
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Questions.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id
            })  
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({success: true, session})

    }catch(error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
}
}

//getMySessions
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({user: req.user.id})
        .sort({createdAt: -1})
        .populate("questions");
        res.status(200).json(sessions)
    } catch(error) {
        res.status(500).json({success: false, message: "Server Error"})
    }
}


//getSessionById
exports.getSessionById = async (req, res) => {
    try {
        const sessions = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options: {sort: {isPinned: -1, createdAt: 1}}
        })
        .exec();

        if(!sessions) {
            return res.status(404).json({success: false, message: "Session not found"})
        };

        res.status(200).json({success: true, sessions})

    } catch(error) {
        res.status(500).json({success: false, message: "Server Error"})
    }
}

//deleteSessions
exports.deleteSessions = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if(!session) {
            return res.status(404).json({success: false, message: "Session not found"})
        };

        // check if the logged user owns this session
        if(session.user.toString() !== req.user.id) {
            return res.status(401).json({message: "Not authorized to delete this session"});
        }

        // first delete all questions linked to this session
        await Questions.deleteMany({session: session._id});

        // then, delete the session
        await session.deleteOne();

    } catch(error) {
        res.status(500).json({success: false, message: error.message})
    }
}