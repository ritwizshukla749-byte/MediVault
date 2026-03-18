const express = require("express");
const { register, login, me } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const {
	validateRegister,
	validateLogin,
} = require("../middleware/authValidation");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", verifyToken, me);

module.exports = router;
