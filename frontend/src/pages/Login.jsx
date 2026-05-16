import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState(initialMode);
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
        showToast("Welcome back!");
      } else {
        if (!studentName.trim()) {
          showToast("Please enter your name", false);
          setLoading(false);
          return;
        }
        await register(studentName.trim(), email.trim(), password);
        showToast("Account created! You're signed in.");
      }
      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      showToast(err.data?.message || err.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-lg py-xl">
        <Link to="/" className="mb-xl text-center font-headline-md text-headline-md font-extrabold text-primary">
          SkillBridge
        </Link>

        <div className="card-shadow rounded-2xl bg-white p-xl">
          <h1 className="mb-2 text-center font-headline-lg text-headline-lg text-on-surface">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mb-6 text-center font-body-md text-body-md text-on-surface-variant">
            {mode === "login"
              ? "Sign in to ask questions, answer, and earn points."
              : "Join the community and start learning together."}
          </p>

          <div className="mb-6 flex rounded-lg bg-surface-container-low p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2 font-label-md text-label-md transition-all ${
                mode === "login" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md py-2 font-label-md text-label-md transition-all ${
                mode === "register" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md"
                  required
                />
              </div>
            )}
            <div>
              <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                minLength={mode === "register" ? 6 : undefined}
                className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="hero-gradient mt-2 rounded-lg py-3 font-label-md text-label-md text-on-primary transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-body-md text-body-md text-on-surface-variant">
          <Link to="/" className="text-primary hover:underline">
            Continue browsing without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
