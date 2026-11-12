import { apiRequest } from "./api";

const CONSENT_KEY = "redwine-analytics-consent";
const VISITOR_KEY = "redwine-analytics-visitor";
const SESSION_KEY = "redwine-analytics-session";

export function getAnalyticsConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY) || "unset";
  } catch (error) {
    console.error("Unable to read analytics consent:", error);
    return "unset";
  }
}

function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateId(storage, key) {
  let id = storage.getItem(key);
  if (!id) {
    id = createId();
    storage.setItem(key, id);
  }
  return id;
}

export function getVisitorId() {
  return getOrCreateId(window.localStorage, VISITOR_KEY);
}

export async function saveAnalyticsConsent(consent) {
  const visitorId = getVisitorId();
  await apiRequest("/analytics/consent", {
    anonymous: true,
    method: "POST",
    body: JSON.stringify({ visitorId, consent })
  });
  window.localStorage.setItem(CONSENT_KEY, consent ? "accepted" : "rejected");
  if (!consent) {
    window.localStorage.removeItem(VISITOR_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

export async function trackAnalyticsEvent(type, path, target = "") {
  if (getAnalyticsConsent() !== "accepted") return;
  const visitorId = getVisitorId();
  const sessionId = getOrCreateId(window.sessionStorage, SESSION_KEY);
  await apiRequest("/analytics/events", {
    anonymous: true,
    method: "POST",
    body: JSON.stringify({ visitorId, sessionId, type, path, target })
  });
}
