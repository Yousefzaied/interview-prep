// togglePinQuestions, updateQuestionNote, addQuestionsToSession

const Question = require("../model/Questions.js");
const Session = require("../model/Session.js");

//addQuestionsToSession
exports.addQuestionsToSession = async(req, res) => {
    try{
        const {sessionId, questions} = req.body;

        if(!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({message: "Invalid input data"});
        }

        const session = await Session.findById(sessionId);

        if(!session) {
            return res.status(404).json({message: "Session not found"});
        };

        // create new questions
        const createdQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        );

        // update session to inclued new question IDs
        session.questions.push(...createdQuestions.map((q) => q._id));
        await session.save();

        res.status(201).json(createdQuestions)

    }catch(error) {
        res.status(500).json({message: error.message})
    }
}

// togglePinQuestions
exports.togglePinQuestions = async(req, res) => {
    try{
        const question = await Question.findById(req.params.id);

        if(!question) {
            return res.status(404).json({success: false, message: "Question not found"})
        };

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({success: true, question})

    }catch(error) {
        res.status(500).json({message: "Server Error"})
    }
}

//updateQuestionNote
exports.updateQuestionNote = async(req, res) => {
    try{
        const {note} = req.body;
        const question = await Question.findById(req.params.id);

        if(!question) {
            return res.status(404).json({success: false, message: "Question not found"})
        };

        question.note = note || "";
        await question.save();

        res.status(200).json({success: false, question})

    }catch(error) {
        res.status(500).json({message: "Server Error"})
    }
}
