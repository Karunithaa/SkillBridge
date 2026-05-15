import express from "express";
import {create,fetch,fetchById,update,deletePost,addAnswer,markBestAnswer,upvoteAnswer,} from "../controller/postController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadAnswerImage } from "../middleware/upload.js";

const router = express.Router();

router.post("/", requireAuth, create);
router.get("/", fetch);
router.get("/:id", fetchById);
router.put("/:id", update);
router.delete("/:id", deletePost);
router.post(
  "/:id/answers",
  requireAuth,
  (req, res, next) => {
    uploadAnswerImage.single("image")(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  addAnswer
);
router.patch("/:postId/answers/:answerId/best", requireAuth, markBestAnswer);
router.patch("/:postId/answers/:answerId/upvote", upvoteAnswer);

export default router;
