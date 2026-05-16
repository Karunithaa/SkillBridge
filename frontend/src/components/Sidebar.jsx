import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onAsk }) {
  const { pathname } = useLocation();

  const item = (to, icon, label, filled = false) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md transition-colors ${
          active
            ? "bg-primary-container text-on-primary-container"
            : "text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        <span className={`material-symbols-outlined ${filled ? "filled" : ""}`}>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col gap-sm overflow-y-auto border-r border-outline-variant bg-surface py-lg md:flex">
      <div className="mb-md px-lg">
        <div className="flex items-center gap-3">
          <div className="primary-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <p className="font-label-md font-bold text-primary">SkillBridge</p>
            <p className="text-[10px] uppercase tracking-wider text-outline">Knowledge Exchange</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {item("/", "home", "Home")}
        {item("/questions", "quiz", "Questions", true)}
        <button
          type="button"
          onClick={onAsk}
          className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Ask Question</span>
        </button>
        {item("/leaderboard", "leaderboard", "Leaderboard")}
        {item("/profile", "person", "Profile")}
      </nav>
      <div className="mt-auto px-lg pb-xl">
        <button
          type="button"
          onClick={onAsk}
          className="primary-gradient w-full rounded-xl py-4 font-label-md text-label-md text-white shadow-lg transition-all active:scale-95"
        >
          Ask Question
        </button>
      </div>
    </aside>
  );
}
