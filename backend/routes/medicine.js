const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const {
	addMedicine,
	getMyMedicines,
	logDose,
	getAdherenceSummary,
} = require("../controllers/medicineController");

const router = express.Router();

router.use(verifyToken, requireRole("patient"));

router.post("/", addMedicine);
router.get("/", getMyMedicines);
router.post("/:id/log", logDose);
router.get("/adherence", getAdherenceSummary);

module.exports = router;
