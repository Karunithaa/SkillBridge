import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { CAT_COLORS, statusClass } from "../utils";
import { useToast } from "../context/ToastContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import Modal from "./Modal";

export default function PostDetailModal({ postId, open, onClose, onUpdate }) {
  const { showToast } = useToast();
  const { user, refreshUser, isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();
  const [post, setPost] = useState(null);
  const [ansText, setAnsText] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !postId) return;
    api
      .getPost(postId)
      .then(setPost)
      .catch(() => showToast("Failed to load post", false));
  }, [open, postId, showToast]);

  const reload = async () => {
    const data = await api.getPost(postId);
    setPost(data);
    await refreshUser();
    onUpdate?.();
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      setPdfName("");
      return;
    }
    setPdfFile(file);
    setPdfName(file.name);
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!requireAuth("Sign in to submit an answer.")) return;
    if (!ansText.trim()) {
      showToast("Answer text is required", false);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("answerText", ansText.trim());
      if (pdfFile) formData.append("image", pdfFile); // field name stays "image" for backend route compat
      await api.addAnswer(postId, formData);
      showToast("Answer submitted! +1 pt");
      setAnsText("");
      setPdfFile(null);
      setPdfName("");
      await reload();
    } catch (err) {
      showToast(err.data?.message || "Failed", false);
    } finally {
      setLoading(false);
    }
  };

  const upvote = async (answerId) => {
    try {
      const data = await api.upvoteAnswer(postId, answerId);
      setPost((p) => ({
        ...p,
        answers: p.answers.map((a) =>
          a._id === answerId ? { ...a, upvotes: data.upvotes } : a
        ),
      }));
      showToast("Upvoted!");
    } catch (err) {
      showToast(err.data?.message || "Failed", false);
    }
  };

  const markBest = async (answerId) => {
    if (!requireAuth("Sign in to mark the best answer.")) return;
    try {
      const data = await api.markBestAnswer(postId, answerId);
      const bonus = data.bonusAwarded ?? 5;
      showToast(bonus > 0 ? `Best answer marked! +${bonus} bonus pts` : "Best answer updated");
      await reload();
    } catch (err) {
      showToast(err.data?.message || "Failed", false);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.deletePost(postId);
      showToast("Post deleted");
      onClose();
      onUpdate?.();
    } catch {
      showToast("Failed to delete", false);
    }
  };

  if (!open) return null;

  const catCls = post ? CAT_COLORS[post.category] || "bg-outline text-on-primary" : "";
  const stCls = post ? statusClass(post.status) : "";
  const isOwner = user && post && post.studentName === user.studentName;

  return (
    <Modal open={open} onClose={onClose} wide>
      {!post ? (
        <p className="py-8 text-center text-on-surface-variant">Loading...</p>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${catCls}`}>
                {post.category}
              </span>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${stCls}`}>
                {post.status}
              </span>
            </div>
            <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <h2 className="mb-3 font-headline-lg text-headline-lg text-on-surface">{post.title}</h2>
          <p className="mb-3 font-body-md text-body-md text-on-surface-variant">{post.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {(post.tags || []).map((t) => (
              <span key={t} className="rounded bg-primary/5 px-2 py-1 font-label-sm text-label-sm text-primary">
                {t.startsWith("#") ? t : `#${t}`}
              </span>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {post.studentName.charAt(0).toUpperCase()}
            </div>
            <span className="font-label-md text-label-md text-on-surface">{post.studentName}</span>
          </div>

          <h3 className="mb-3 font-headline-md text-[18px] text-on-surface">
            {post.answers.length} Answer{post.answers.length !== 1 ? "s" : ""}
          </h3>

          <div className="mb-6 space-y-3">
            {post.answers.length === 0 ? (
              <p className="py-6 text-center font-body-md text-body-md text-on-surface-variant">
                No answers yet. Be the first to help!
              </p>
            ) : (
              post.answers.map((a) => (
                <div
                  key={a._id}
                  className={`rounded-lg border p-4 ${
                    a.isBestAnswer
                      ? "best-answer border-amber-300"
                      : "border-outline-variant bg-surface-container-low"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                        {a.studentName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-label-md text-label-md text-on-surface">{a.studentName}</span>
                      {a.isBestAnswer && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          ★ Best Answer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => upvote(a._id)}
                        className="flex items-center gap-1 rounded-full bg-surface-container px-2 py-1 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">thumb_up</span> {a.upvotes}
                      </button>
                      {isOwner && !a.isBestAnswer && post.status !== "closed" && (
                        <button
                          type="button"
                          onClick={() => markBest(a._id)}
                          className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-label-sm text-label-sm text-amber-700 transition-colors hover:bg-amber-100"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span> Best
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface">{a.answerText}</p>
                  {/* FIX #3: Show PDF attachment link instead of image */}
                  {(a.pdfUrl || a.imageUrl) && (
                    <a
                      href={a.pdfUrl || a.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-label-sm text-label-sm text-primary hover:bg-primary/5"
                    >
                      <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                      View attached PDF
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {post.status !== "closed" ? (
            <div className="border-t border-outline-variant pt-4">
              {isAuthenticated ? (
                <>
                  <h4 className="mb-3 font-label-md text-label-md text-on-surface">Add Your Answer</h4>
                  <form onSubmit={submitAnswer} className="flex flex-col gap-3">
                    <textarea
                      value={ansText}
                      onChange={(e) => setAnsText(e.target.value)}
                      rows={3}
                      placeholder="Write your answer..."
                      className="resize-none rounded-lg border border-outline-variant px-4 py-2 font-body-md text-body-md"
                    />
                    {/* FIX #3: PDF only upload */}
                    <div>
                      <label className="mb-1 block font-label-sm text-label-sm text-on-surface-variant">
                        Attach PDF (optional)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        className="w-full text-sm text-on-surface-variant file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:font-label-md file:text-primary"
                      />
                      {pdfName && (
                        <p className="mt-2 flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-primary">picture_as_pdf</span>
                          {pdfName}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="primary-gradient rounded-lg py-3 font-label-md text-label-md text-white transition-all active:scale-95 disabled:opacity-60"
                    >
                      Submit Answer (+1 pt)
                    </button>
                  </form>
                </>
              ) : (
                <p className="py-4 text-center font-body-md text-body-md text-on-surface-variant">
                  <Link
                    to={`/login?redirect=${encodeURIComponent("/questions")}`}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to submit an answer and earn points.
                </p>
              )}
            </div>
          ) : (
            <p className="border-t border-outline-variant py-4 text-center font-body-md text-body-md text-on-surface-variant">
              This question is closed.
            </p>
          )}

          {isOwner && (
            <div className="mt-2 flex justify-between border-t border-outline-variant pt-4">
              <button
                type="button"
                onClick={deletePost}
                className="font-label-sm text-label-sm text-error hover:underline"
              >
                Delete Post
              </button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
