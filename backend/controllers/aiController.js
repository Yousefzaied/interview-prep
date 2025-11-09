


// controllers/interviewController.js
const { GoogleGenAI } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts.js");
const { extractFirstJson } = require("../utils/extractJsonBlock");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//  توليد الأسئلة
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || experience == null || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text ?? response.output?.[0]?.content?.[0]?.text ?? JSON.stringify(response);
    rawText = rawText.replace(/^\s*```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    try {
      const maybe = JSON.parse(rawText);
      return res.status(200).json(maybe);
    } catch (err) {}

    const jsonBlock = extractFirstJson(rawText);
    if (!jsonBlock) {
      console.error("Failed to extract JSON. Raw model output (first 4000 chars):", rawText.slice(0, 4000));
      return res.status(500).json({
        message: "Failed to extract valid JSON from model output",
        error: "No valid JSON block found in model response.",
      });
    }

    const data = JSON.parse(jsonBlock);
    return res.status(200).json(data);

  } catch (error) {
    console.error("generateInterviewQuestions error:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};


//  
const generateInterviewExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

   
    let rawText = response.text ?? response.output?.[0]?.content?.[0]?.text ?? JSON.stringify(response);

    
    rawText = rawText.replace(/^\s*```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    
    try {
      const maybe = JSON.parse(rawText);
      return res.status(200).json(maybe);
    } catch (err) {

    }

    
    const jsonBlock = extractFirstJson(rawText);
    if (!jsonBlock) {
      console.error("Failed to extract JSON explanation. Raw model output (first 4000 chars):", rawText.slice(0, 4000));
      return res.status(500).json({
        message: "Failed to extract valid JSON from model output",
        error: "No valid JSON block found in model response.",
      });
    }

   
    const data = JSON.parse(jsonBlock);
    return res.status(200).json(data);

  } catch (error) {
    console.error("generateInterviewExplanation error:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateInterviewExplanation };
