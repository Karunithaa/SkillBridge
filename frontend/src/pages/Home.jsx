import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getInitials } from "../utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home({ refreshKey, onAsk }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, u] = await Promise.all([api.getPosts(), api.getLeaderboard()]);
        setPosts(p);
        setUsers(u);
        setError(false);
      } catch {
        setError(true);
      }
    })();
  }, [refreshKey]);

  const topUsers = users.slice(0, 4);
  const colors = ["text-primary", "text-secondary", "text-tertiary", "text-on-surface-variant"];
  const bgColors = ["bg-primary/10", "bg-secondary/10", "bg-tertiary/10", "bg-surface-container"];

  return (
    <div className="overflow-x-hidden bg-surface font-body-md text-on-surface">
      <Navbar onAsk={onAsk} />

      <main className="pt-16">
        <section className="relative overflow-hidden pb-3xl pt-2xl md:py-3xl">
          <div className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-xl px-lg lg:grid-cols-12">
            <div className="z-10 space-y-lg lg:col-span-6">
              <div className="inline-flex items-center gap-sm rounded-full border border-primary-fixed-dim bg-primary-fixed px-md py-xs text-on-primary-fixed-variant">
                <span className="material-symbols-outlined filled text-[18px]">auto_awesome</span>
                <span className="font-label-md text-label-md">Join Active Learners</span>
              </div>
              <h1 className="font-display-lg text-display-lg leading-tight tracking-tight text-on-surface">
                Learn Together.
                <br />
                <span className="hero-gradient-text">Grow Together.</span>              </h1>
              <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
                Ask questions, share knowledge, earn rewards. SkillBridge is the ultimate community for curious minds.
              </p>
              <div className="flex flex-wrap gap-md pt-sm">
                <button type="button" onClick={onAsk} className="hero-gradient flex items-center gap-sm rounded-lg px-xl py-md font-label-md text-label-md text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-[0.98]">
                  <span className="material-symbols-outlined filled">add_circle</span>
                  Ask Question
                </button>
                <Link to="/questions" className="inline-flex items-center rounded-lg border-[1.5px] border-primary px-xl py-md font-label-md text-label-md text-primary transition-all hover:bg-primary/5 active:scale-[0.98]">
                  Explore Questions
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-6">
              <div className="relative aspect-square w-full md:aspect-video lg:aspect-square">
                <div className="absolute inset-0 -rotate-3 rounded-3xl bg-primary/5" />
                <div className="hero-gradient relative z-10 flex h-full w-full items-center justify-center rounded-3xl shadow-2xl">
                  <div className="p-2xl text-center text-on-primary">
                    <span className="material-symbols-outlined filled mb-4 block text-[80px]">school</span>
                    <p className="font-headline-lg text-headline-lg font-bold">Knowledge Exchange</p>
                    <p className="mt-sm font-body-md text-body-md opacity-80">Ask · Answer · Earn Points</p>
                  </div>
                </div>
                <div className="glass-card card-shadow absolute -right-4 -top-4 z-20 flex items-center gap-sm rounded-lg p-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-container">
                    <span className="material-symbols-outlined filled text-on-tertiary-container">military_tech</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Weekly Top</p>
                    <p className="font-label-md text-label-md text-on-surface">{error ? "N/A" : users[0]?.studentName || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant bg-surface-container-low py-2xl">
          <div className="mx-auto max-w-container-max px-lg">
            <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
              {[
                { icon: "quiz", color: "text-primary", label: "Questions Posted", value: error ? "—" : posts.length },
                { icon: "groups", color: "text-secondary", label: "Active Learners", value: error ? "—" : users.length },
                { icon: "task_alt", color: "text-tertiary", label: "Answered Questions", value: error ? "—" : posts.filter((p) => p.status !== "open").length },
              ].map((s) => (
                <div key={s.label} className="card-shadow flex items-center gap-lg rounded-xl bg-surface p-lg">
                  <div className={`rounded-lg p-md ${s.color.replace("text-", "bg-")}/10`}>
                    <span className={`material-symbols-outlined text-3xl ${s.color}`}>{s.icon}</span>
                  </div>
                  <div>
                    <p className={`font-headline-lg text-headline-lg ${s.color}`}>{s.value}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-3xl">
          <div className="mx-auto max-w-container-max px-lg">
            <div className="mb-2xl flex items-end justify-between">
              <div className="space-y-sm">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Top Contributors</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">The minds shaping our learning community.</p>
              </div>
              <Link to="/leaderboard" className="flex items-center gap-xs font-label-md text-label-md text-primary transition-all hover:gap-sm">
                View Leaderboard <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
              {error ? (
                <p className="col-span-4 py-8 text-center font-body-md text-body-md text-on-surface-variant">
                  Could not connect to backend. Make sure the server is running on port 8000.
                </p>
              ) : topUsers.length === 0 ? (
                <p className="col-span-4 py-8 text-center font-body-md text-body-md text-on-surface-variant">
                  No contributors yet. Be the first!
                </p>
              ) : (
                topUsers.map((u, i) => (
                  <Link
                    key={u._id}
                    to={`/profile?name=${encodeURIComponent(u.studentName)}`}
                    className="card-shadow card-shadow-hover group cursor-pointer rounded-xl bg-surface p-lg transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-md text-center">
                      <div className="relative">
                        <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface-container text-2xl font-bold ${bgColors[i]} ${colors[i]}`}>
                          {getInitials(u.studentName)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface ${i === 0 ? "bg-tertiary" : i === 1 ? "bg-secondary" : "bg-primary"}`}>
                          <span className="material-symbols-outlined filled text-[12px] text-on-primary">
                            {i === 0 ? "workspace_premium" : i === 1 ? "star" : "emoji_events"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface">{u.studentName}</h3>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{u.badges?.[0] || "Community Member"}</p>
                      </div>
                      <div className="flex w-full justify-around border-t border-outline-variant py-sm">
                        <div>
                          <p className={`font-label-md text-label-md ${colors[i]}`}>{u.points}</p>
                          <p className="text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant">Points</p>
                        </div>
                        <div>
                          <p className={`font-label-md text-label-md ${colors[i]}`}>{u.badges?.length || 0}</p>
                          <p className="text-[10px] font-label-sm uppercase tracking-wider text-on-surface-variant">Badges</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="px-lg py-3xl">
          <div className="hero-gradient relative mx-auto max-w-container-max overflow-hidden rounded-3xl p-2xl text-on-primary">
            <div className="absolute right-0 top-0 flex h-full w-1/2 items-center justify-end pr-8 opacity-10">
              <span className="material-symbols-outlined filled text-[220px]">lightbulb</span>
            </div>
            <div className="relative z-10 mx-auto max-w-2xl space-y-lg text-center">
              <h2 className="font-display-lg text-headline-lg leading-tight md:text-display-lg">Got a question on your mind?</h2>
              <p className="font-body-lg text-body-lg text-on-primary/90">Our community is waiting to help you bridge the gap between curiosity and mastery.</p>
              <div className="flex flex-col justify-center gap-md pt-md sm:flex-row">
                <button type="button" onClick={onAsk} className="rounded-lg bg-surface px-2xl py-md font-label-md text-label-md text-primary transition-colors hover:bg-surface-bright active:scale-95">
                  Ask Now
                </button>
                <Link to="/login?mode=register" className="rounded-lg border border-surface px-2xl py-md font-label-md text-label-md text-on-primary transition-colors hover:bg-surface/10 active:scale-95">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
