// utils/extractJsonBlock.js
function extractFirstJson(text) {
  if (!text || typeof text !== "string") return null;

  // حاول أولاً استخراج أي محتوى داخل ```json ... ``` أو ``` ... ```
  const tripleJsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (tripleJsonMatch && tripleJsonMatch[1]) {
    const candidate = tripleJsonMatch[1].trim();
    // لو كانت صالحة كـ JSON مباشرة فارجعها
    try {
      JSON.parse(candidate);
      return candidate;
    } catch (e) {
      // استمر لمحاولة التحليل العام أدناه
    }
  }

  // إزالة أي علامات ``` تفصيلية عامة من النص
  text = text.replace(/```/g, "").trim();

  // البحث عن بداية JSON (أول { أو [)
  const startIdx = Math.max(text.indexOf("{"), text.indexOf("["));
  if (startIdx === -1) return null;

  let i = startIdx;
  const len = text.length;
  const stack = [];
  let inString = false;
  let escape = false;

  for (; i < len; i++) {
    const ch = text[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    } else {
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === "{" || ch === "[") {
        stack.push(ch);
      } else if (ch === "}" || ch === "]") {
        const last = stack[stack.length - 1];
        if (
          (ch === "}" && last === "{") ||
          (ch === "]" && last === "[")
        ) {
          stack.pop();
          if (stack.length === 0) {
            // عثرنا على نهاية البلوك JSON
            const candidate = text.slice(startIdx, i + 1).trim();
            try {
              // تحقق من قابلية التحويل
              JSON.parse(candidate);
              return candidate;
            } catch (e) {
              return null;
            }
          }
        } else {
          // تركيب غير متوقع -> فشل
          return null;
        }
      }
    }
  }

  return null; // لم نجد JSON متوازن
}

module.exports = { extractFirstJson };
