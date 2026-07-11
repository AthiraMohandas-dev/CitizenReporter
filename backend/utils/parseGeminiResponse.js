function parseGeminiResponse(text) {
    try {
        // Remove markdown code fences
        let cleaned = text.replace(/```json/g, "");
        cleaned = cleaned.replace(/```/g, "");
        cleaned = cleaned.trim();

        return JSON.parse(cleaned);

    } catch (error) {
        throw new Error("Invalid JSON received from Gemini");
    }
}

module.exports = parseGeminiResponse;