import Users from "../model/userModel.js";

export const register = async (_req, res) => {
  res.status(410).json({
    message: "Use POST /api/auth/register with email and password to create an account.",
  });
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await Users.find().sort({ points: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const getUserByName = async (req, res) => {
  try {
    const user = await Users.findOne({ studentName: req.params.name });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};