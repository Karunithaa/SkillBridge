import bcrypt from "bcryptjs";
import Users from "../model/userModel.js";
import { signToken } from "../middleware/auth.js";

function userResponse(user, token) {
  return {
    token,
    user: {
      _id: user._id,
      studentName: user.studentName,
      email: user.email,
      points: user.points,
      badges: user.badges,
      joinedAt: user.joinedAt,
    },
  };
}

export const register = async (req, res) => {
  try {
    const { studentName, email, password } = req.body;

    if (!studentName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await Users.findOne({
      $or: [{ studentName: studentName.trim() }, { email: email.trim().toLowerCase() }],
    });
    if (existing) {
      return res.status(409).json({ message: "An account with this name or email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await Users.create({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
    });

    const token = signToken(user);
    res.status(201).json(userResponse(user, token));
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await Users.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    res.status(200).json(userResponse(user, token));
  } catch (error) {
    res.status(500).json({ message: "Login failed.", details: error.message });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};
