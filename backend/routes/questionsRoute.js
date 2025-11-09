const express = require("express");
const {togglePinQuestions, updateQuestionNote, addQuestionsToSession} = require("../controllers/questionController.js");
const {protect} = require("../middlewares/authMidleware.js");

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestions);
router.post("/:id/note",protect, updateQuestionNote);

module.exports = router;