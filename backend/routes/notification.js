const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
	getMyNotifications,
	getUnreadCount,
	markNotificationRead,
} = require("../controllers/notificationController");
const {
	validateNotificationsQuery,
	validateNotificationIdParam,
} = require("../middleware/requestValidation");

const router = express.Router();

router.use(verifyToken);

router.get("/", validateNotificationsQuery, getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", validateNotificationIdParam, markNotificationRead);

module.exports = router;
