const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (!process.env.BACKEND_PUBLIC_URL) {
    console.warn(
      "BACKEND_PUBLIC_URL is not set. QR URLs will use request host/protocol."
    );
  }
};

module.exports = validateEnv;
