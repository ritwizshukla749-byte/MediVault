const MedRecord = require("../models/MedRecord");
const User = require("../models/User");

// Create a new medical record
// Called by: doctor observation, file upload, symptom checker
const createRecord = async (req, res, next) => {
  try {
    const { patientId, diagnosis, notes, medicines, fileUrls, aiSummary } =
      req.body;

    // Verify the patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found." });
    }

    // If a doctor is creating this, verify the patient is assigned to them
    if (req.user.role === "doctor") {
      if (
        !patient.assignedDoctorId ||
        patient.assignedDoctorId.toString() !== req.user.id
      ) {
        return res.status(403).json({
          message: "This patient is not assigned to you.",
        });
      }
    }

    const record = await MedRecord.create({
      patientId,
      doctorId: req.user.role === "doctor" ? req.user.id : null,
      diagnosis,
      notes,
      medicines: Array.isArray(medicines) ? medicines : [],
      fileUrls: Array.isArray(fileUrls) ? fileUrls : [],
      aiSummary,
      date: req.body.date || Date.now(),
    });

    return res.status(201).json({
      message: "Medical record created successfully.",
      record,
    });
  } catch (error) {
    return next(error);
  }
};

// Get all records for the logged in patient
const getMyRecords = async (req, res, next) => {
  try {
    const records = await MedRecord.find({ patientId: req.user.id }).sort({
      date: -1,
    });

    return res.status(200).json({ records });
  } catch (error) {
    return next(error);
  }
};

// Get a single record by ID
const getRecordById = async (req, res, next) => {
  try {
    const record = await MedRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    // Patients can only view their own records
    if (
      req.user.role === "patient" &&
      record.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Doctors can only view records of their assigned patients
    if (req.user.role === "doctor") {
      const patient = await User.findById(record.patientId);
      if (
        !patient.assignedDoctorId ||
        patient.assignedDoctorId.toString() !== req.user.id
      ) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    return res.status(200).json({ record });
  } catch (error) {
    return next(error);
  }
};

// Doctor views full record history of an assigned patient
const getPatientRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Verify patient is assigned to this doctor
    if (
      !patient.assignedDoctorId ||
      patient.assignedDoctorId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "This patient is not assigned to you.",
      });
    }

    const records = await MedRecord.find({ patientId }).sort({ date: -1 });

    return res.status(200).json({
      patient: {
        id: patient._id,
        name: patient.name,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
      },
      records,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRecord,
  getMyRecords,
  getRecordById,
  getPatientRecords,
};
