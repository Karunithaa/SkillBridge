import Posts from "../model/postModels.js";

export const create = async (req, res) => {
  try {
    const postData = new Posts(req.body);

    const { title } = postData;

    const postExist = await Posts.findOne({ title });

    if (postExist) {
      return res.status(400).json({
        message: "Post already exists.",
      });
    }

    const savedPost = await postData.save();

    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

// FETCH ALL POSTS
export const fetch = async (req, res) => {
  try {
    const posts = await Posts.find();

    if (posts.length === 0) {
      return res.status(404).json({
        message: "No posts found.",
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const postExist = await Posts.findById(id);

    if (!postExist) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    const updatedPost = await Posts.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const postExist = await Posts.findById(id);

    if (!postExist) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    await Posts.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    post.answers.push(req.body);

    await post.save();

    res.status(200).json({
      message: "Answer added successfully.",
      post,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error.",
    });
  }
};