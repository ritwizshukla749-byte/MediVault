const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");
const {
  createRecord,
  getRecordById,
  getPatientRecords,
} = require("../controllers/recordController");
const { getPatientReports } = require("../controllers/reportController");
const {
	getMyAssignedPatients,
	assignPatientToDoctor,
	unassignPatientFromDoctor,
} = require("../controllers/doctorPatientController");
const {
	validateCreateRecord,
	validateRecordIdParam,
	validateDoctorPatientIdParam,
	validateDoctorPatientsQuery,
} = require("../middleware/requestValidation");

const router = express.Router();

router.use(verifyToken, requireRole("doctor"));


router.get("/dashboard", (req, res) => {
	res.status(200).json({
		message: "Doctor dashboard data fetched successfully.",
		user: req.user,
	});
});

router.get("/patients", validateDoctorPatientsQuery, getMyAssignedPatients);
router.post("/patients/:patientId/assign", validateDoctorPatientIdParam, assignPatientToDoctor);
router.post("/patients/:patientId/unassign", validateDoctorPatientIdParam, unassignPatientFromDoctor);

router.post("/records", validateCreateRecord, createRecord);
router.get("/records/:id", validateRecordIdParam, getRecordById);
router.get("/patients/:patientId/records", validateDoctorPatientIdParam, getPatientRecords);
router.get("/patients/:patientId/reports", validateDoctorPatientIdParam, getPatientReports);

module.exports = router;
