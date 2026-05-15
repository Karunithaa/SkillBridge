import express from "express";
import {register,getLeaderboard,getUserByName,updateUser,deleteUser,} from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.get("/leaderboard", getLeaderboard);
router.get("/:name", getUserByName);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
