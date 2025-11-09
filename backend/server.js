// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db.js");

// const authRoute = require("./routes/authRoute.js");
// const sessionRoute = require("./routes/sessionRoute.js");
// const questionsRoute = require("./routes/questionsRoute.js");
// const {protect} = require("./middlewares/authMidleware.js");
// const {generateInterviewQuestions,generateInterviewExplanation} = require("./controllers/aiController.js");

// const app = express();

// // middle ware to hondle cors 
// app.use(
//     cors({
//         origin:"*",
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

// // conect Dataase
// connectDB();

// // midleware 
// app.use(express.json());

// // routes 
// app.use("/api/auth", authRoute);
// app.use("/api/sessions", sessionRoute);
// app.use("/api/questions", questionsRoute);

// app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
// app.use("/api/ai/generate-explanation", protect, generateInterviewExplanation);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, ()=> console.log(`Server running on port => ${PORT}`))

// ✅ تحميل متغيرات البيئة
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");

const authRoute = require("./routes/authRoute.js");
const sessionRoute = require("./routes/sessionRoute.js");
const questionsRoute = require("./routes/questionsRoute.js");
const { protect } = require("./middlewares/authMidleware.js");
const {
  generateInterviewQuestions,
  generateInterviewExplanation,
} = require("./controllers/aiController.js");

const app = express();

// ✅ إعداد CORS
app.use(
  cors({
    origin: [
      "https://frontendprepinterview.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ اتصال قاعدة البيانات
connectDB();

// ✅ الميدل وير
app.use(express.json());

// ✅ المسارات
app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/questions", questionsRoute);

// ✅ مسارات الذكاء الاصطناعي (AI)
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateInterviewExplanation);

// ✅ مجلد الملفات الثابتة (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ التصدير لـ Vercel
module.exports = app;

// ❌ لا تستخدم app.listen() في Vercel
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port => ${PORT}`));
