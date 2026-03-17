const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const {
	checkSymptoms,
	getMySymptomHistory,
} = require("../controllers/symptomController");

const router = express.Router();

router.use(verifyToken, requireRole("patient"));

router.post("/check", checkSymptoms);
router.get("/history", getMySymptomHistory);

module.exports = router;
