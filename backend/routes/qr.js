const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const {
	getMyQrProfilePayload,
	getMyEmergencyQrPayload,
	scanPatientQr,
	accessEmergencyProfile,
	getMyScanAuditLogs,
} = require("../controllers/qrController");
const {
	validateQrEmergencyTokenParam,
	validateQrScan,
	validateQrAuditQuery,
} = require("../middleware/requestValidation");

const router = express.Router();

router.get("/emergency/:qrToken", validateQrEmergencyTokenParam, accessEmergencyProfile);

router.use(verifyToken);

router.get("/my-profile", requireRole("patient"), getMyQrProfilePayload);
router.get("/my-emergency-profile", requireRole("patient"), getMyEmergencyQrPayload);
router.post("/scan", requireRole("doctor"), validateQrScan, scanPatientQr);
router.get("/audit", requireRole("patient", "doctor"), validateQrAuditQuery, getMyScanAuditLogs);

module.exports = router;
