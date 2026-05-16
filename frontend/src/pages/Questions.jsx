import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { CAT_COLORS, CATEGORIES, statusClass, timeAgo } from "../utils";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import PostDetailModal from "../components/PostDetailModal";

const PER_PAGE = 10;

export default function Questions({ refreshKey, onAsk }) {
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      const data = await api.getPosts();
      setAllPosts(data);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, refreshKey]);

  const filtered = useMemo(() => {
    let posts = [...allPosts];
    if (category) posts = posts.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === "oldest") posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sort === "most-answers") posts.sort((a, b) => b.answers.length - a.answers.length);
    else posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return posts;
  }, [allPosts, category, search, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const searchInput = (
    <div className="relative hidden sm:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-64 rounded-full border-none bg-surface-container py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
        placeholder="Search questions..."
        type="text"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <Navbar search={searchInput} />
      <div className="flex min-h-screen pt-16">
        <Sidebar onAsk={onAsk} />
        <main className="flex-1 bg-background p-md md:ml-64 md:p-xl">
          <div className="mx-auto max-w-4xl">
            <header className="mb-xl">
              <div className="mb-lg flex flex-col justify-between gap-md md:flex-row md:items-end">
                <div>
                  <h1 className="mb-xs font-headline-lg text-headline-lg text-on-surface">Explore Questions</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">Learn from the community or share your expertise.</p>
                </div>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="most-answers">Most Answers</option>
                </select>
              </div>
              <div className="flex gap-sm overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold ${!category ? "primary-gradient text-white shadow-md" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"}`}
                >
                  All Topics
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                      category === cat ? "primary-gradient text-white shadow-md" : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid gap-lg">
              {error ? (
                <p className="py-12 text-center font-body-md text-body-md text-on-surface-variant">
                  Could not connect to backend at port 8000.
                  <br />
                  Make sure the server is running.
                </p>
              ) : pagePosts.length === 0 ? (
                <p className="py-16 text-center font-body-md text-body-md text-on-surface-variant">No questions found. Be the first to ask!</p>
              ) : (
                pagePosts.map((p) => {
                  const catCls = CAT_COLORS[p.category] || "bg-outline text-on-primary";
                  const stCls = statusClass(p.status);
                  const bestCount = p.answers.filter((a) => a.isBestAnswer).length;
                  return (
                    <article
                      key={p._id}
                      onClick={() => setDetailId(p._id)}
                      className="question-card-shadow group cursor-pointer rounded-lg border border-transparent bg-white p-lg transition-all hover:border-primary/10"
                    >
                      <div className="flex flex-col gap-lg md:flex-row">
                        <div className="flex min-w-[80px] items-center gap-md md:flex-col md:justify-center">
                          <div className="text-center">
                            <p className={`font-headline-md text-headline-md ${p.answers.length > 0 ? "text-primary" : "text-on-surface-variant"}`}>{p.answers.length}</p>
                            <p className="font-label-sm text-label-sm uppercase tracking-tighter text-outline">Answers</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-sm flex flex-wrap items-center gap-sm">
                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${catCls}`}>{p.category}</span>
                            <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${stCls}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${p.status === "open" ? "bg-green-500" : p.status === "answered" ? "bg-blue-500" : "bg-gray-400"}`} />
                              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                            </span>
                            {bestCount > 0 && (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">✓ Best Answer</span>
                            )}
                          </div>
                          <h2 className="mb-sm font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">{p.title}</h2>
                          <p className="mb-md line-clamp-2 font-body-md text-body-md text-on-surface-variant">{p.description}</p>
                          <div className="flex flex-wrap items-center justify-between gap-md">
                            <div className="flex flex-wrap gap-2">
                              {(p.tags || []).slice(0, 3).map((t) => (
                                <span key={t} className="rounded bg-primary/5 px-2 py-1 font-label-sm text-label-sm text-primary">
                                  {t.startsWith("#") ? t : `#${t}`}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                {p.studentName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-label-md text-label-md text-on-surface">{p.studentName}</span>
                              <span className="text-label-sm text-outline">• {timeAgo(p.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-3xl flex items-center justify-center gap-md">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-10 w-10 rounded-lg font-bold ${n === page ? "primary-gradient text-white" : "border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low"}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-outline-variant p-2 transition-colors hover:bg-surface-container-low disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="primary-gradient group fixed bottom-lg right-lg z-50 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      <Footer className="md:ml-64" />
      <PostDetailModal postId={detailId} open={!!detailId} onClose={() => setDetailId(null)} onUpdate={loadPosts} />
    </div>
  );
}
