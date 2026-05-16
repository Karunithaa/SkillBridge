import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AskQuestionModal from "./components/AskQuestionModal";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { useRequireAuth } from "./hooks/useRequireAuth";

export default function App() {
  const [askOpen, setAskOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { requireAuth } = useRequireAuth();

  const bump = () => setRefreshKey((k) => k + 1);

  const handleAsk = () => {
    if (requireAuth("Sign in to ask a question.")) setAskOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<Home refreshKey={refreshKey} onAsk={handleAsk} />}
        />
        <Route
          path="/questions"
          element={<Questions refreshKey={refreshKey} onAsk={handleAsk} />}
        />
        <Route path="/leaderboard" element={<Leaderboard refreshKey={refreshKey} />} />
        <Route path="/profile" element={<Profile refreshKey={refreshKey} />} />
      </Routes>

      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} onSuccess={bump} />
    </>
  );
}
