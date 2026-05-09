import express from "express";

import { create, fetch, update, deletePost, addAnswer } from "../controller/postController.js";

const route = express.Router();

route.get("/getallposts", fetch);

route.post("/create", create);

route.put("/update/:id", update);

route.delete("/delete/:id", deletePost);

route.post("/answer/:id", addAnswer);

export default route;
