const { generateComplaint } = require("./geminiService");
const { getOfficer } = require("./officerService");
const parseGeminiResponse = require("../utils/parseGeminiResponse");
const { generateMailto } = require("./mailService");

async function generateFullReport(issue, category) {
    const aiResponse = await generateComplaint(issue, category);

    const parsed = parseGeminiResponse(aiResponse);

    const officer = getOfficer(
        category,
        parsed.district
    );

    const mailto = generateMailto(
        officer?.email,
        parsed.subject,
        parsed.body
    );

    return {
        ...parsed,
        officer,
        mailto
    };
}

module.exports = {
    generateFullReport
};