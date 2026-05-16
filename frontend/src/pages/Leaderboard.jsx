import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getBadgeLevel, getInitials } from "../utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Leaderboard({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .getLeaderboard()
      .then((data) => {
        setUsers(data);
        setError(false);
      })
      .catch(() => setError(true));
  }, [refreshKey]);

  const top = users.slice(0, 3);
  const podiumOrder = top.length >= 3 ? [top[1], top[0], top[2]] : top.length === 2 ? [top[1], top[0]] : top;
  const heights = top.length >= 3 ? ["h-40", "h-56", "h-32"] : ["h-44", "h-56"];
  const gradients = ["silver-gradient", "gold-gradient", "bronze-gradient"];
  const textColors = ["text-gray-600", "text-amber-600", "text-orange-600"];
  const medals = ["🥈", "🥇", "🥉"];
  const ranks = top.length >= 3 ? [2, 1, 3] : [2, 1];

  const rankColors = [
    "border-l-4 border-amber-400 bg-amber-50",
    "border-l-4 border-gray-400 bg-gray-50",
    "border-l-4 border-orange-400 bg-orange-50",
  ];
  const rankIcons = ["🥇", "🥈", "🥉"];

  return (
    <div className="overflow-x-hidden bg-background font-body-md text-on-surface">
      <Navbar />

      <div className="flex min-h-screen pt-16">
        <aside className="fixed left-0 top-16 z-40 hidden h-screen w-64 flex-col gap-sm border-r border-outline-variant bg-surface py-lg shadow-sm md:flex">
          <div className="mb-lg px-md">
            <div className="flex items-center gap-md rounded-xl bg-surface-container-high p-md">
              <div className="gold-gradient flex h-10 w-10 items-center justify-center rounded-lg shadow-lg">
                <span className="material-symbols-outlined filled text-white">star</span>
              </div>
              <div>
                <p className="font-label-md font-bold text-primary">Leaderboard</p>
                <p className="text-[10px] uppercase tracking-wider text-outline">Top Contributors</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined">home</span><span>Home</span>
            </Link>
            <Link to="/questions" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined">quiz</span><span>Questions</span>
            </Link>
            <Link to="/leaderboard" className="mx-2 flex items-center gap-3 rounded-full bg-primary-container px-4 py-3 font-label-md text-label-md text-on-primary-container">
              <span className="material-symbols-outlined filled">leaderboard</span><span>Leaderboard</span>
            </Link>
            <Link to="/profile" className="mx-2 flex items-center gap-3 rounded-full px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high">
              <span className="material-symbols-outlined">person</span><span>Profile</span>
            </Link>
          </nav>
        </aside>

        <main className="min-h-screen w-full px-md pb-xl pt-12 md:ml-64 md:px-2xl">
          <div className="mx-auto max-w-4xl">
            <header className="mb-3xl text-center">
              <h1 className="mb-sm font-display-lg text-display-lg text-on-surface">Global Leaderboard</h1>
              <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                Celebrating our top contributors and knowledge masters. Keep sharing to climb the ranks!
              </p>
            </header>

            <div className="mb-3xl flex flex-col items-end justify-center gap-lg md:flex-row md:gap-xl" id="podium">
              {error ? (
                <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">
                  Could not connect to backend. Make sure the server is running on port 8000.
                </p>
              ) : top.length === 0 ? (
                <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">No users yet. Be the first to join!</p>
              ) : (
                podiumOrder.map((u, i) => (
                  <Link
                    key={u._id}
                    to={`/profile?name=${encodeURIComponent(u.studentName)}`}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-2xl font-bold text-white shadow-lg ${gradients[i]}`}>
                      {getInitials(u.studentName)}
                    </div>
                    <div className="text-center">
                      <p className="font-label-md text-label-md text-on-surface">{u.studentName}</p>
                      <p className={`font-label-sm text-label-sm font-bold ${textColors[i]}`}>{u.points} pts</p>
                    </div>
                    <div className={`${gradients[i]} ${heights[i]} relative flex w-32 items-start justify-center rounded-t-xl pt-3 shadow-lg md:w-36`}>
                      <span className="text-3xl">{medals[i]}</span>
                      <span className="absolute bottom-3 text-xl font-bold text-white">#{ranks[i]}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="card-shadow overflow-hidden rounded-xl bg-white">
              <div className="flex items-center justify-between border-b border-outline-variant p-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface">All Rankings</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{error ? "—" : `${users.length} members`}</span>
              </div>
              <div>
                {error ? (
                  <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">No data available.</p>
                ) : users.length === 0 ? (
                  <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">No users yet.</p>
                ) : (
                  users.map((u, i) => {
                    const badge = getBadgeLevel(u.points);
                    const isTop = i < 3;
                    return (
                      <Link
                        key={u._id}
                        to={`/profile?name=${encodeURIComponent(u.studentName)}`}
                        className={`flex cursor-pointer items-center gap-4 border-b border-outline-variant px-lg py-4 transition-colors ${isTop ? rankColors[i] : "hover:bg-surface-container-low"}`}
                      >
                        <div className={`w-8 text-center font-bold ${isTop ? "text-xl" : ""}`}>{isTop ? rankIcons[i] : `#${i + 1}`}</div>
                        <div className="primary-gradient flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                          {getInitials(u.studentName)}
                        </div>
                        <div className="flex-1">
                          <p className="font-label-md text-label-md text-on-surface">{u.studentName}</p>
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.color}`}>{badge.label}</span>
                            {(u.badges || []).slice(0, 2).map((b) => (
                              <span key={b} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{b}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-label-md text-label-md font-bold text-primary">{u.points}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">points</p>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer className="md:ml-64" />
    </div>
  );
}
