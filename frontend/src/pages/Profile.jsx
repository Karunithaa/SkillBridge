import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { getBadgeLevel, getInitials, nextLevelPoints } from "../utils";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

export default function Profile({ refreshKey }) {
  const { showToast } = useToast();
  // FIX #1: was missing `isAuthenticated` and `user as authUser` — caused crash on load
  const { user: authUser, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchName, setSearchName] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [answeredPosts, setAnsweredPosts] = useState([]);
  const [stats, setStats] = useState({ answersGiven: 0, bestAnswers: 0 });
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async (name) => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const u = await api.getUser(name.trim());
      setUser(u);
      const allPosts = await api.getPosts();
      // Questions this user asked
      const userPosts = allPosts.filter((p) => p.studentName === u.studentName);
      // Posts where this user answered
      const userAnsweredPosts = allPosts.filter(
        (p) => p.answers.some((a) => a.studentName === u.studentName)
      );
      const answersGiven = allPosts.reduce(
        (s, p) => s + p.answers.filter((a) => a.studentName === u.studentName).length,
        0
      );
      const bestAnswers = allPosts.reduce(
        (s, p) =>
          s + p.answers.filter((a) => a.studentName === u.studentName && a.isBestAnswer).length,
        0
      );
      setPosts(userPosts);
      setAnsweredPosts(userAnsweredPosts);
      setStats({ answersGiven, bestAnswers });
    } catch (err) {
      if (err.status === 404) showToast("User not found", false);
      else showToast("Server error. Is the backend running?", false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      setSearchName(name);
      loadProfile(name);
    } else if (isAuthenticated && authUser?.studentName) {
      // FIX #1: auto-load logged-in user's profile when no ?name= param
      setSearchName(authUser.studentName);
      loadProfile(authUser.studentName);
    }
  }, [searchParams, loadProfile, refreshKey, isAuthenticated, authUser]);

  const handleSearch = (e) => {
    e?.preventDefault();
    loadProfile(searchName);
  };

  const handleAddBadge = async (e) => {
    e.preventDefault();
    if (!user) return showToast("No user loaded", false);
    if (!badgeName.trim()) return showToast("Enter a badge name", false);
    try {
      const updated = await api.updateUser(user._id, {
        badges: [...(user.badges || []), badgeName.trim()],
      });
      showToast("Badge added! 🏅");
      setBadgeName("");
      setBadgeOpen(false);
      setUser(updated);
    } catch (err) {
      showToast(err.data?.message || "Failed", false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await api.deleteUser(user._id);
      showToast("Account deleted");
      setDeleteOpen(false);
      setUser(null);
      setSearchName("");
    } catch {
      showToast("Failed to delete", false);
    }
  };

  const badge = user ? getBadgeLevel(user.points) : null;
  const nextLvl = user ? nextLevelPoints(user.points) : null;
  const progress =
    user && nextLvl ? Math.min(100, Math.round((user.points / nextLvl) * 100)) : 100;
  const joinDate = user
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <Navbar />

      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col gap-1 border-r border-outline-variant bg-surface py-lg md:flex">
        <Link to="/" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
          <span className="material-symbols-outlined">home</span><span>Home</span>
        </Link>
        <Link to="/questions" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
          <span className="material-symbols-outlined">quiz</span><span>Questions</span>
        </Link>
        <Link to="/leaderboard" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
          <span className="material-symbols-outlined">leaderboard</span><span>Leaderboard</span>
        </Link>
        <Link to="/profile" className="mx-2 flex items-center gap-3 rounded-full bg-primary-container px-4 py-3 font-label-md text-label-md text-on-primary-container">
          <span className="material-symbols-outlined filled">person</span><span>Profile</span>
        </Link>
      </aside>

      <main className="mx-auto w-full max-w-container-max flex-1 p-md pt-20 md:ml-64 md:p-xl">
        <form onSubmit={handleSearch} className="mb-xl max-w-lg">
          <label className="mb-2 block font-label-md text-label-md text-on-surface-variant">
            Look up a student profile
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter student name..."
              className="flex-1 rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="primary-gradient rounded-lg px-lg py-3 font-label-md text-label-md text-white transition-all active:scale-95 disabled:opacity-60"
            >
              Search
            </button>
          </div>
        </form>

        {!user && !loading && (
          <div className="py-16 text-center text-on-surface-variant">
            <span className="material-symbols-outlined mb-4 block text-[64px] text-outline">
              person_search
            </span>
            <p className="font-body-lg text-body-lg">
              {isAuthenticated
                ? "Loading your profile..."
                : "Search for a student by name above to view their profile."}
            </p>
            {!isAuthenticated && (
              <p className="mt-2 font-body-md text-body-md">
                Or{" "}
                <Link to="/leaderboard" className="text-primary hover:underline">
                  browse the leaderboard
                </Link>{" "}
                to discover top contributors.
              </p>
            )}
          </div>
        )}

        {loading && <p className="py-8 text-center text-on-surface-variant">Loading...</p>}

        {user && badge && (
          <div className="grid grid-cols-1 gap-lg md:grid-cols-12">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-lg md:col-span-4">
              <section className="ambient-card flex flex-col items-center rounded-xl bg-white p-xl text-center transition-all">
                <div className="relative mb-md h-28 w-28">
                  <div className="primary-gradient flex h-full w-full items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-lg">
                    {getInitials(user.studentName)}
                  </div>
                  <div className="primary-gradient absolute bottom-1 right-1 rounded-full border-2 border-white p-1 text-white">
                    <span className="material-symbols-outlined filled text-[14px]">{badge.icon}</span>
                  </div>
                </div>
                <h2 className="mb-xs font-headline-md text-headline-md text-on-surface">
                  {user.studentName}
                </h2>
                <p className="mb-md font-label-sm text-label-sm text-on-surface-variant">
                  {user.email}
                </p>
                <span className={`mb-lg rounded-full px-3 py-1 font-label-md text-label-md ${badge.bg} ${badge.color}`}>
                  {badge.label}
                </span>

                <div className="mb-lg w-full text-left">
                  <div className="mb-sm flex justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Level Progress
                    </span>
                    <span className="font-label-md text-label-md text-primary">
                      {nextLvl ? `${user.points}/${nextLvl}` : "MAX"}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className="progress-bar-fill h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {nextLvl ? (
                    <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
                      {nextLvl - user.points} pts to next level
                    </p>
                  ) : (
                    <p className="mt-xs font-label-sm text-label-sm text-amber-600">
                      🏆 Maximum level reached!
                    </p>
                  )}
                </div>

                {/* FIX #2: Stats grid shows Points, Questions Asked, Questions Answered, Best Answers */}
                <div className="mb-lg grid w-full grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface-container-low p-3 text-center">
                    <p className="font-headline-md text-[20px] font-bold text-primary">
                      {user.points}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Points</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-3 text-center">
                    <p className="font-headline-md text-[20px] font-bold text-secondary">
                      {posts.length}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Asked</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-3 text-center">
                    <p className="font-headline-md text-[20px] font-bold text-tertiary">
                      {stats.answersGiven}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Answered</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-3 text-center">
                    <p className="font-headline-md text-[20px] font-bold text-[#f59e0b]">
                      {stats.bestAnswers}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Best Ans.</p>
                  </div>
                </div>

                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Member since {joinDate}
                </p>

                <div className="mt-lg flex w-full flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setBadgeOpen(true)}
                    className="primary-gradient rounded-lg py-2 font-label-md text-label-md text-white transition-all active:scale-95"
                  >
                    + Add Badge
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="rounded-lg border border-error py-2 font-label-md text-label-md text-error transition-all hover:bg-error/5 active:scale-95"
                  >
                    Delete Account
                  </button>
                </div>
              </section>

              <section className="ambient-card rounded-xl bg-white p-lg transition-all">
                <h3 className="mb-md flex items-center gap-2 font-headline-md text-[18px] text-on-surface">
                  <span className="material-symbols-outlined filled text-primary">military_tech</span>{" "}
                  Badges
                </h3>
                {user.badges?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-primary/10 px-3 py-1.5 font-label-md text-label-md text-primary"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center font-body-md text-body-md text-on-surface-variant">
                    No badges yet. Keep contributing to earn badges!
                  </p>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-lg md:col-span-8">
              {/* Contribution Summary */}
              <section className="ambient-card rounded-xl bg-white p-lg transition-all">
                <h3 className="mb-md flex items-center gap-2 font-headline-md text-[18px] text-on-surface">
                  <span className="material-symbols-outlined filled text-secondary">forum</span>{" "}
                  Contribution Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { value: posts.length, label: "Questions Asked", color: "text-primary" },
                    { value: stats.answersGiven, label: "Answers Given", color: "text-secondary" },
                    { value: stats.bestAnswers, label: "Best Answers", color: "text-[#f59e0b]" },
                    { value: user.points, label: "Total Points", color: "text-tertiary" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-surface-container-low p-md text-center">
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Questions Asked */}
              <section className="ambient-card rounded-xl bg-white p-lg transition-all">
                <h3 className="mb-md flex items-center gap-2 font-headline-md text-[18px] text-on-surface">
                  <span className="material-symbols-outlined filled text-primary">quiz</span>{" "}
                  Questions Asked
                </h3>
                {posts.length ? (
                  posts.map((p) => (
                    <Link
                      key={p._id}
                      to="/questions"
                      className="flex items-start gap-3 border-b border-outline-variant p-3 transition-colors last:border-0 hover:bg-surface-container-low"
                    >
                      <div className="flex-1">
                        <p className="font-label-md text-label-md text-on-surface">{p.title}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {p.category}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              p.status === "open"
                                ? "bg-green-100 text-green-700"
                                : p.status === "answered"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-label-md text-label-md text-primary">
                          {p.answers.length} ans
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {p.points} pts
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="py-6 text-center font-body-md text-body-md text-on-surface-variant">
                    No questions posted yet.
                  </p>
                )}
              </section>

              {/* FIX #2: Questions Answered section */}
              <section className="ambient-card rounded-xl bg-white p-lg transition-all">
                <h3 className="mb-md flex items-center gap-2 font-headline-md text-[18px] text-on-surface">
                  <span className="material-symbols-outlined filled text-secondary">rate_review</span>{" "}
                  Questions Answered
                </h3>
                {answeredPosts.length ? (
                  answeredPosts.map((p) => {
                    const myAnswers = p.answers.filter(
                      (a) => a.studentName === user.studentName
                    );
                    const hasBest = myAnswers.some((a) => a.isBestAnswer);
                    return (
                      <Link
                        key={p._id}
                        to="/questions"
                        className="flex items-start gap-3 border-b border-outline-variant p-3 transition-colors last:border-0 hover:bg-surface-container-low"
                      >
                        <div className="flex-1">
                          <p className="font-label-md text-label-md text-on-surface">{p.title}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {p.category}
                            </span>
                            {hasBest && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                ★ Best Answer
                              </span>
                            )}
                            <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                              {myAnswers.length} answer{myAnswers.length > 1 ? "s" : ""} given
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-label-sm text-label-sm text-on-surface-variant">
                            {p.answers.length} total ans
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <p className="py-6 text-center font-body-md text-body-md text-on-surface-variant">
                    No answers given yet. Start helping others to earn points!
                  </p>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      <Footer className="md:ml-64" />

      <Modal open={badgeOpen} onClose={() => setBadgeOpen(false)}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md">Add Badge</h2>
          <button type="button" onClick={() => setBadgeOpen(false)} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleAddBadge} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">
              Badge Name
            </label>
            <input
              type="text"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              placeholder="e.g. Python Expert, Top Helper"
              className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md"
            />
          </div>
          <button
            type="submit"
            className="primary-gradient rounded-lg py-3 font-label-md text-label-md text-white active:scale-95"
          >
            Add Badge
          </button>
        </form>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <h2 className="mb-3 font-headline-md text-headline-md text-error">Delete Account</h2>
        <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
          Are you sure you want to delete this account? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDeleteOpen(false)}
            className="flex-1 rounded-lg border border-outline-variant py-3 font-label-md text-label-md text-on-surface active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 rounded-lg bg-error py-3 font-label-md text-label-md text-on-error active:scale-95"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
