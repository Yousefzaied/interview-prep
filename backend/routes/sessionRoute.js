const express = require("express");
const {createSession, getSessionById, getMySessions, deleteSessions} = require("../controllers/sessionController.js");
const {protect} = require("../middlewares/authMidleware.js");

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSessions);

module.exports = router;