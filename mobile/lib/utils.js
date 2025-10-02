// lib/utils.js
export function formatDate(dateString) {
  // format date nicely
  // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Build a UPI payment URI per NPCI spec
export function buildUpiUri({ payeeVpa, payeeName, amount, transactionNote, transactionRef, currency = "INR" }) {
  if (!payeeVpa) throw new Error("payeeVpa is required");
  const params = new URLSearchParams();
  params.set("pa", payeeVpa);
  if (payeeName) params.set("pn", payeeName);
  if (amount != null) params.set("am", String(amount));
  if (transactionNote) params.set("tn", transactionNote);
  if (transactionRef) params.set("tr", transactionRef);
  if (currency) params.set("cu", currency);
  return `upi://pay?${params.toString()}`;
}

// Parse a UPI URI into an object
export function parseUpiUri(upiUri) {
  try {
    const uri = new URL(upiUri);
    const params = Object.fromEntries(uri.searchParams.entries());
    return { scheme: `${uri.protocol}//`.replace(":", ""), ...params };
  } catch (e) {
    return null;
  }
}

// Simple validation helpers
export function isValidVpa(vpa) {
  // Basic VPA pattern: local@handle
  return typeof vpa === "string" && /^(?!\.)[\w.\-]{2,}@[\w\-]{2,}$/i.test(vpa);
}

export function isPositiveAmount(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
}