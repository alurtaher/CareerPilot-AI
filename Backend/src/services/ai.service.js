const { GoogleGenAI } = require("@google/genai");
const { z } = require('zod')
const { zodToJsonSchema } = require('zod-to-json-schema')

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("The technical question that can be asked in the interview"),
    intention: z.string().describe("The intention of the interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Technical questions that can be asked in the interview along with the intention and how to answer it"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The behavioral question that can be asked in the interview"),
    intention: z.string().describe("The intention of the interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Behavioral questions that can be asked in the interview along with the intention and how to answer it"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("The skill which the candidate is lacking"),
    severity: z.enum(['low', 'medium', 'high']).describe("The severity of the skill gap, i.e. how important this skill is for the job and how much it can impact the candidate's chances")
  })),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number in the preparation plan, starting from 1"),
    focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
    tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
  })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

  const prompt = `
You are an expert technical interviewer.

CRITICAL RULES - YOU MUST FOLLOW EXACTLY OR THE OUTPUT WILL BE INVALID:
- Return ONLY valid JSON. No explanations, no markdown, no comments, no extra text whatsoever.
- Do NOT add any fields not listed below.
- Do NOT change field names or structure.
- Every array item MUST be a complete JSON object — NEVER output flat strings, labels as values, or interleaved label-value sequences.
- technicalQuestions MUST be an array of EXACTLY 5 objects, each with exactly these 3 fields: "question", "intention", "answer"
- behavioralQuestions MUST be an array of EXACTLY 3 objects, each with exactly these 3 fields: "question", "intention", "answer"
- skillGaps MUST be an array of EXACTLY 3 objects, each with exactly these 2 fields: "skill", "severity" ("low" | "medium" | "high")
- preparationPlan MUST be an array of EXACTLY 7 objects, each with exactly these 3 fields: "day" (number 1–7), "focus" (string), "tasks" (array of strings)
- "tasks" MUST be a proper JSON array like ["Task one.", "Task two."] — NEVER flatten it or include words like "day", "focus", "tasks" inside the array values.
- NEVER include the literal words "question", "intention", "answer", "skill", "severity", "day", "focus", "tasks" as **string values** in the JSON — only use real content.
- If you are unsure about any section, still generate the exact number of items with realistic content based on the resume and job description.
- Use "intention" (correct spelling), not "intension".

Valid example structure (follow this shape precisely):

{
  "matchScore": 82,
  "technicalQuestions": [
    {
      "question": "Explain Node.js event loop",
      "intention": "To check understanding of core async mechanism",
      "answer": "The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations..."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you learned a new technology quickly.",
      "intention": "Assesses learning agility",
      "answer": "In my last project I learned React in two weeks by..."
    }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Review core concepts",
      "tasks": ["Read article X", "Solve 10 easy problems on LeetCode"]
    },
    {
      "day": 2,
      "focus": "Practice medium problems",
      "tasks": ["Solve 15 medium array problems", "Watch system design intro video"]
    }
  ],
  "title": "Backend Developer Interview Report"
}

Now generate the report for:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // consider trying "gemini-1.5-flash" or "gemini-1.5-pro" if available
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    }
  })

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text

  if (!raw) {
    throw new Error("AI did not return valid content")
  }

  let report = JSON.parse(raw);

  // ────────────────────────────────────────────────
  // Your existing fixer logic (kept as safety net)
  // ────────────────────────────────────────────────

  function fixFlatArray(items, fieldNames, isPreparation = false) {
    if (!Array.isArray(items) || items.length === 0) return [];

    if (typeof items[0] === 'object' && !Array.isArray(items[0])) {
      return items.map(item => ({ ...item }));
    }

    const fixed = [];
    let i = 0;
    while (i < items.length) {
      const obj = {};
      let valid = true;

      for (const field of fieldNames) {
        if (i >= items.length) { valid = false; break; }
        if (typeof items[i] === 'string' && items[i].toLowerCase() === field.toLowerCase()) {
          i++;
        }
        if (i >= items.length) { valid = false; break; }
        obj[field] = items[i];
        i++;
      }

      if (valid) {
        if (isPreparation && obj.tasks && typeof obj.tasks === 'string') {
          obj.tasks = [obj.tasks];
          while (i < items.length && typeof items[i] !== 'number' && !['day','focus','tasks'].includes(String(items[i]).toLowerCase())) {
            obj.tasks.push(items[i]);
            i++;
          }
        }
        fixed.push(obj);
      } else {
        break;
      }
    }
    return fixed;
  }

  report.technicalQuestions   = fixFlatArray(report.technicalQuestions || [],   ['question', 'intention', 'answer']);
  report.behavioralQuestions  = fixFlatArray(report.behavioralQuestions || [],  ['question', 'intention', 'answer']);
  report.skillGaps            = fixFlatArray(report.skillGaps || [],           ['skill', 'severity']);
  report.preparationPlan      = fixFlatArray(report.preparationPlan || [],      ['day', 'focus', 'tasks'], true);

  // Ensure correct types
  report.preparationPlan = report.preparationPlan.map(item => ({
    ...item,
    day: Number(item.day) || 1
  }));

  if (report.skillGaps) {
    report.skillGaps = report.skillGaps.map(gap => ({
      ...gap,
      severity: String(gap.severity || '').toLowerCase()
    }));
  }

  console.log("Heavily fixed report:", JSON.stringify(report, null, 2));
  return report;
}

module.exports = generateInterviewReport;