const SymptomLog = require("../models/SymptomLog");

const analyzeSymptomsFallback = (symptomText) => {
	const text = symptomText.toLowerCase();

	const conditions = [];
	let specialistType = "General Physician";
	let urgency = "low";
	let advice = "Rest, hydrate, and monitor your symptoms for 24-48 hours.";

	if (text.includes("chest pain") || text.includes("shortness of breath")) {
		conditions.push("Cardiac or respiratory concern");
		specialistType = "Cardiologist";
		urgency = "high";
		advice =
			"Seek urgent medical care immediately, especially if symptoms are sudden or severe.";
	}

	if (text.includes("fever") || text.includes("cough") || text.includes("sore throat")) {
		conditions.push("Viral or respiratory infection");
		specialistType = specialistType === "General Physician" ? "General Physician" : specialistType;
		urgency = urgency === "high" ? "high" : "medium";
		advice =
			urgency === "high"
				? advice
				: "Hydrate, rest, and consult a physician if fever persists beyond 2 days.";
	}

	if (text.includes("stomach") || text.includes("vomit") || text.includes("nausea")) {
		conditions.push("Gastrointestinal irritation");
		specialistType = specialistType === "General Physician" ? "Gastroenterologist" : specialistType;
		urgency = urgency === "high" ? "high" : "medium";
		advice =
			urgency === "high"
				? advice
				: "Prefer light meals, fluids, and consult a doctor if symptoms persist or worsen.";
	}

	if (text.includes("headache") || text.includes("migraine") || text.includes("dizziness")) {
		conditions.push("Neurological or stress-related symptom");
		specialistType = specialistType === "General Physician" ? "Neurologist" : specialistType;
		urgency = urgency === "high" ? "high" : urgency;
	}

	if (conditions.length === 0) {
		conditions.push("Non-specific symptoms");
	}

	return {
		aiConditions: conditions.slice(0, 5),
		specialistType,
		urgency,
		advice,
	};
};

const checkSymptoms = async (req, res, next) => {
	try {
		const { symptoms } = req.body;

		if (!symptoms || typeof symptoms !== "string") {
			return res.status(400).json({ message: "symptoms must be a non-empty string." });
		}

		const normalizedSymptoms = symptoms.trim();
		if (normalizedSymptoms.length < 3 || normalizedSymptoms.length > 1000) {
			return res.status(400).json({
				message: "symptoms length must be between 3 and 1000 characters.",
			});
		}

		const analysis = analyzeSymptomsFallback(normalizedSymptoms);

		const symptomLog = await SymptomLog.create({
			patientId: req.user.id,
			symptoms: normalizedSymptoms,
			...analysis,
		});

		return res.status(201).json({
			message: "Symptom analysis completed.",
			result: {
				id: symptomLog._id,
				symptoms: symptomLog.symptoms,
				aiConditions: symptomLog.aiConditions,
				specialistType: symptomLog.specialistType,
				urgency: symptomLog.urgency,
				advice: symptomLog.advice,
				createdAt: symptomLog.createdAt,
			},
		});
	} catch (error) {
		return next(error);
	}
};

const getMySymptomHistory = async (req, res, next) => {
	try {
		const logs = await SymptomLog.find({ patientId: req.user.id })
			.sort({ createdAt: -1 })
			.limit(50);

		return res.status(200).json({ logs });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	checkSymptoms,
	getMySymptomHistory,
};
