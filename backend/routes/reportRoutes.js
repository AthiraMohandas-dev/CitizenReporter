const express = require("express");
const router = express.Router();

const { createReport } = require("../controllers/reportController");

router.post("/generate", createReport);

module.exports = router;