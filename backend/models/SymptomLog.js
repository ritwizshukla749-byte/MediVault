const mongoose = require("mongoose");

const symptomLogSchema = new mongoose.Schema(
	{
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		symptoms: {
			type: String,
			required: true,
			trim: true,
		},
		aiConditions: {
			type: [String],
			default: [],
		},
		specialistType: {
			type: String,
			trim: true,
			default: "General Physician",
		},
		urgency: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "low",
		},
		advice: {
			type: String,
			trim: true,
			default: "Monitor symptoms and consult a doctor if they worsen.",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("SymptomLog", symptomLogSchema);
