// ✅ AFTER (reads from environment)
const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

module.exports = { SECRET };
