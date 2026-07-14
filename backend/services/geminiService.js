const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateComplaint(issue, category) {
    const prompt = `
You are helping Indian citizens report civic issues.

The user will describe an issue.

Generate ONLY valid JSON.

Ask authority to take action.

Fields:
category
district
subject
body

Rules:

1. Subject should be short.
2. Email should be professional.
3. If district isn't mentioned, return "Unknown".
4. Don't explain anything.
5. Return JSON only.

Category: 
${category}

Issue:

${issue}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}

module.exports = {
    generateComplaint,
};