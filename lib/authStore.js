import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function getStore() {
  if (!globalThis.__liferxAuthStore) {
    globalThis.__liferxAuthStore = {
      pendingSignups: new Map(),
      users: new Map(),
    };
  }

  return globalThis.__liferxAuthStore;
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (incomingHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, storedHashBuffer);
}

export function queueSignup({ email, fullName, password }) {
  const store = getStore();
  const normalizedEmail = normalizeEmail(email);
  const existingUser = store.users.get(normalizedEmail);

  if (existingUser) {
    throw new Error("An account already exists for this email.");
  }

  const otp = createOtp();
  const pendingSignup = {
    email: normalizedEmail,
    expiresAt: Date.now() + 10 * 60 * 1000,
    fullName: fullName.trim(),
    otp,
    passwordHash: hashPassword(password),
  };

  store.pendingSignups.set(normalizedEmail, pendingSignup);

  return pendingSignup;
}

export function confirmSignup({ email, otp }) {
  const store = getStore();
  const normalizedEmail = normalizeEmail(email);
  const pendingSignup = store.pendingSignups.get(normalizedEmail);

  if (!pendingSignup) {
    throw new Error("No signup request found for this email.");
  }

  if (pendingSignup.expiresAt < Date.now()) {
    store.pendingSignups.delete(normalizedEmail);
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (pendingSignup.otp !== otp.trim()) {
    throw new Error("Incorrect OTP. Please try again.");
  }

  const user = {
    createdAt: new Date().toISOString(),
    email: normalizedEmail,
    fullName: pendingSignup.fullName,
    passwordHash: pendingSignup.passwordHash,
  };

  store.users.set(normalizedEmail, user);
  store.pendingSignups.delete(normalizedEmail);

  return {
    email: user.email,
    fullName: user.fullName,
  };
}

export function loginUser({ email, password }) {
  const store = getStore();
  const normalizedEmail = normalizeEmail(email);
  const user = store.users.get(normalizedEmail);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Invalid email or password.");
  }

  return {
    email: user.email,
    fullName: user.fullName,
  };
}
