import Posts from "../model/postModels.js";
import Users from "../model/userModel.js";

const ANSWER_POINTS = 1;
const BEST_ANSWER_BONUS = 5;

// CREATE A POST (auth required)
export const create = async (req, res) => {
  try {
    const { title, description, category, points, tags } = req.body;
    const studentName = req.user.studentName;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "title, description, and category are required." });
    }

    const postExist = await Posts.findOne({ title });
    if (postExist) {
      return res.status(409).json({ message: "A post with this title already exists." });
    }

    const postData = new Posts({title,studentName,description,category,points,tags,});
    const savedPost = await postData.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const posts = await Posts.find(filter).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const fetchById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const postExist = await Posts.findById(id);
    if (!postExist) return res.status(404).json({ message: "Post not found." });

    const updatedPost = await Posts.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const postExist = await Posts.findById(id);
    if (!postExist) return res.status(404).json({ message: "Post not found." });

    await Posts.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const id = req.params.id;
    const answerText = req.body.answerText?.trim();
    const studentName = req.user.studentName;

    if (!answerText) {
      return res.status(400).json({ message: "Answer text is required." });
    }

    const post = await Posts.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.status === "closed") return res.status(400).json({ message: "This post is closed." });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    post.answers.push({ studentName, answerText, imageUrl });
    post.status = "answered";
    await post.save();

    await Users.findByIdAndUpdate(req.user._id, { $inc: { points: ANSWER_POINTS } });

    res.status(200).json({
      message: "Answer added successfully.",
      pointsAwarded: ANSWER_POINTS,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const markBestAnswer = async (req, res) => {
  try {
    const { postId, answerId } = req.params;

    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.studentName !== req.user.studentName) {
      return res.status(403).json({ message: "Only the question author can mark the best answer." });
    }

    const answer = post.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found." });
    if (answer.isBestAnswer) {
      return res.status(200).json({ message: "Already marked as best answer.", bonusAwarded: 0, post });
    }

    const previousBest = post.answers.find((a) => a.isBestAnswer);
    post.answers.forEach((a) => (a.isBestAnswer = false));
    answer.isBestAnswer = true;
    post.status = "closed";
    await post.save();

    let bonusAwarded = 0;
    if (previousBest) {
      const prevUser = await Users.findOne({ studentName: previousBest.studentName });
      if (prevUser) {
        await Users.findByIdAndUpdate(prevUser._id, { $inc: { points: -BEST_ANSWER_BONUS } });
      }
    }
    const answerer = await Users.findOne({ studentName: answer.studentName });
    if (answerer) {
      await Users.findByIdAndUpdate(answerer._id, { $inc: { points: BEST_ANSWER_BONUS } });
      bonusAwarded = BEST_ANSWER_BONUS;
    }

    res.status(200).json({
      message: "Best answer marked and bonus points awarded.",
      bonusAwarded,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};

export const upvoteAnswer = async (req, res) => {
  try {
    const { postId, answerId } = req.params;

    const post = await Posts.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const answer = post.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found." });

    answer.upvotes += 1;
    await post.save();

    res.status(200).json({ message: "Answer upvoted.", upvotes: answer.upvotes });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error.", details: error.message });
  }
};
