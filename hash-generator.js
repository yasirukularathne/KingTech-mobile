const crypto = require("crypto");

async function hashPassword(password) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("base64");
}

hashPassword("admin123")
  .then((hash) => {
    console.log("Password: admin123");
    console.log("Hash: " + hash);
    console.log("");
    console.log("Copy this line to your .env file:");
    console.log('HASHED_ADMIN_PASSWORD="' + hash + '"');
  })
  .catch((err) => {
    console.error("Error:", err);
  });
