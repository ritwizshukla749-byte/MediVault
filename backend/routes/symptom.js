const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const {
	checkSymptoms,
	getMySymptomHistory,
} = require("../controllers/symptomController");
const { validateSymptomCheck } = require("../middleware/requestValidation");

const router = express.Router();

router.use(verifyToken, requireRole("patient"));

router.post("/check", validateSymptomCheck, checkSymptoms);
router.get("/history", getMySymptomHistory);

module.exports = router;
