const STUDENT_NAME_KEY = "skillbridge_studentName";

/** Optional display name in browser — not a login session. */
export function getStoredStudentName() {
  try {
    return localStorage.getItem(STUDENT_NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredStudentName(name) {
  try {
    if (name?.trim()) localStorage.setItem(STUDENT_NAME_KEY, name.trim());
  } catch {
    /* ignore */
  }
}

export const CATEGORIES = [
  "Coding", "Design", "Mathematics", "Science", "Language", "Business", "IT", "Other",
];

export const CAT_COLORS = {
  Coding: "bg-primary text-white",
  Design: "bg-secondary text-white",
  Mathematics: "bg-[#7c3aed] text-white",
  Science: "bg-[#0891b2] text-white",
  Language: "bg-[#059669] text-white",
  Business: "bg-tertiary-container text-on-tertiary-container",
  IT: "bg-[#0369a1] text-white",
  Other: "bg-outline text-on-primary",
};

export function getInitials(name) {
  return name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
}

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function statusClass(s) {
  return s === "open" ? "status-open" : s === "answered" ? "status-answered" : "status-closed";
}

export function getBadgeLevel(points) {
  if (points >= 200)
    return { label: "Legend", color: "text-amber-600", bg: "bg-amber-50", icon: "workspace_premium" };
  if (points >= 100)
    return { label: "Expert", color: "text-purple-600", bg: "bg-purple-50", icon: "military_tech" };
  if (points >= 50)
    return { label: "Advanced", color: "text-blue-600", bg: "bg-blue-50", icon: "star" };
  if (points >= 20)
    return { label: "Learner", color: "text-green-600", bg: "bg-green-50", icon: "school" };
  return { label: "Newcomer", color: "text-gray-500", bg: "bg-gray-100", icon: "person" };
}

export function nextLevelPoints(points) {
  if (points < 20) return 20;
  if (points < 50) return 50;
  if (points < 100) return 100;
  if (points < 200) return 200;
  return null;
}
