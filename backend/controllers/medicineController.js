const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const DoseLog = require("../models/DoseLog");

const addMedicine = async (req, res, next) => {
	try {
		const { name, dosage, frequency, timeSlots, startDate, endDate, instructions } =
			req.body;

		if (!name || !dosage) {
			return res
				.status(400)
				.json({ message: "name and dosage are required fields." });
		}

		const medicine = await Medicine.create({
			patientId: req.user.id,
			name,
			dosage,
			frequency: frequency || "daily",
			timeSlots: Array.isArray(timeSlots) ? timeSlots : [],
			startDate: startDate || Date.now(),
			endDate,
			instructions,
		});

		return res.status(201).json({
			message: "Medicine added successfully.",
			medicine,
		});
	} catch (error) {
		return next(error);
	}
};

const getMyMedicines = async (req, res, next) => {
	try {
		const medicines = await Medicine.find({
			patientId: req.user.id,
			isActive: true,
		}).sort({ createdAt: -1 });

		return res.status(200).json({ medicines });
	} catch (error) {
		return next(error);
	}
};

const logDose = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { status, scheduledTime } = req.body;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid medicine id." });
		}

		if (!["taken", "missed"].includes(status)) {
			return res
				.status(400)
				.json({ message: "status must be either taken or missed." });
		}

		const medicine = await Medicine.findOne({ _id: id, patientId: req.user.id });
		if (!medicine) {
			return res.status(404).json({ message: "Medicine not found for this patient." });
		}

		const doseLog = await DoseLog.create({
			medicineId: medicine._id,
			patientId: req.user.id,
			status,
			scheduledTime: scheduledTime || Date.now(),
		});

		return res.status(201).json({
			message: "Dose logged successfully.",
			doseLog,
		});
	} catch (error) {
		return next(error);
	}
};

const getAdherenceSummary = async (req, res, next) => {
	try {
		const { medicineId } = req.query;
		const matchStage = { patientId: new mongoose.Types.ObjectId(req.user.id) };

		if (medicineId) {
			if (!mongoose.Types.ObjectId.isValid(medicineId)) {
				return res.status(400).json({ message: "Invalid medicineId query value." });
			}
			matchStage.medicineId = new mongoose.Types.ObjectId(medicineId);
		}

		const summary = await DoseLog.aggregate([
			{ $match: matchStage },
			{
				$group: {
					_id: "$medicineId",
					total: { $sum: 1 },
					taken: {
						$sum: {
							$cond: [{ $eq: ["$status", "taken"] }, 1, 0],
						},
					},
					missed: {
						$sum: {
							$cond: [{ $eq: ["$status", "missed"] }, 1, 0],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					medicineId: "$_id",
					total: 1,
					taken: 1,
					missed: 1,
					adherencePercent: {
						$round: [
							{
								$multiply: [
									{
										$cond: [
											{ $eq: ["$total", 0] },
											0,
											{ $divide: ["$taken", "$total"] },
										],
									},
									100,
								],
							},
							2,
						],
					},
				},
			},
		]);

		return res.status(200).json({ summary });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	addMedicine,
	getMyMedicines,
	logDose,
	getAdherenceSummary,
};
