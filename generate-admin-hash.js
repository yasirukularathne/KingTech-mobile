// Generate SHA-512 hash for admin password
const crypto = require("crypto");

async function hashPassword(password) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("base64");
}

// Let's use "admin123" as the password (you can change this)
const password = "admin123";

hashPassword(password)
  .then((hash) => {
    console.log("Password:", password);
    console.log("SHA-512 Hash:", hash);
    console.log("\nUpdate your .env file with:");
    console.log(`HASHED_ADMIN_PASSWORD="${hash}"`);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
