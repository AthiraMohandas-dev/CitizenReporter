const { generateFullReport } = require("../services/reportService");

async function createReport(req, res) {
    try {

        const { issue } = req.body;

        if (!issue) {
            return res.status(400).json({
                success: false,
                message: "Issue is required"
            });
        }

        const report = await generateFullReport(issue);

        res.json({
            success: true,
            data: report
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = {
    createReport
};