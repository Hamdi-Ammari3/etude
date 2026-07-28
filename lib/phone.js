// lib/phone.js

// Accepts messy input ("22 942 420", "+21622942420", "0021622942420", "22942420")
// and returns the canonical 8-digit Tunisian mobile number, or null if invalid.
// The returned value is digits-only with no spaces/prefixes — e.g. "51510183".
function normalizePhone(raw) {
  if (!raw) return null;
  let digits = String(raw).replace(/\D/g, "");
  digits = digits.replace(/^00216/, "").replace(/^216/, "");
  if (!/^\d{8}$/.test(digits)) return null;
  return digits;
}

// The Firestore doc id / Firebase Auth uid IS the canonical phone number
// now — no prefix. Kept as a named function so call sites stay readable
// and so there's one place to change if this ever needs to differ again.
function buildUid(canonicalPhone) {
  return canonicalPhone;
}

module.exports = { normalizePhone, buildUid };