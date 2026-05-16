import { useState } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import { setStoredStudentName } from "../utils";
import Modal from "./Modal";

export default function RegisterModal({ open, onClose, onSuccess }) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast("Please fill all fields", false);
      return;
    }
    setLoading(true);
    try {
      const user = await api.registerUser({ studentName: name.trim(), email: email.trim() });
      setStoredStudentName(name.trim());
      showToast(user.welcomeBack ? `Welcome back, ${name.trim()}!` : "Profile saved! You can ask and answer anytime.");
      setName("");
      setEmail("");
      onClose();
      onSuccess?.();
    } catch (err) {
      showToast(err.data?.message || "Registration failed", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface">Save your profile</h2>
        <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
        Optional — you can ask and answer without this. Saving only links your name and email to points on the leaderboard.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md transition-all"
          />
        </div>
        <div>
          <label className="mb-1 block font-label-md text-label-md text-on-surface-variant">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-outline-variant px-4 py-3 font-body-md text-body-md transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="hero-gradient mt-2 rounded-lg py-3 font-label-md text-label-md text-on-primary transition-all active:scale-95 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save profile"}
        </button>
      </form>
    </Modal>
  );
}
