import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/questions", label: "Questions" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar({ onAsk, search }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const profileTo = isAuthenticated
    ? `/profile?name=${encodeURIComponent(user.studentName)}`
    : "/profile";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-md md:px-xl">
        <Link to="/" className="font-headline-md text-headline-md font-extrabold text-primary">
          SkillBridge
        </Link>
        <div className="hidden items-center gap-xl md:flex">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to === "/profile" ? profileTo : to}
              className={`font-body-md text-body-md transition-all duration-200 ${
                pathname === to || (to === "/profile" && pathname === "/profile")
                  ? "border-b-2 border-primary pb-1 font-bold text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-md">
          {search}
          {isAuthenticated ? (
            <>
              <span className="hidden font-label-md text-label-md text-on-surface-variant md:inline">
                {user.studentName} · {user.points} pts
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="hidden rounded-full border-[1.5px] border-outline-variant px-md py-sm font-label-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95 md:block"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full border-[1.5px] border-primary px-md py-sm font-label-md text-label-md text-primary transition-all hover:bg-primary/5 active:scale-95 md:inline-flex"
            >
              Sign in
            </Link>
          )}
          {onAsk && (
            <button
              type="button"
              onClick={onAsk}
              className="hero-gradient rounded-full px-md py-sm font-label-md text-label-md text-on-primary transition-all active:scale-95"
            >
              Ask
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
