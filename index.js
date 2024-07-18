import express from "express";
import multer from "multer";

import cors from "cors";

import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

import { UserController, PostController } from "./controllers/index.js";

import { handleValidationErrors, checkAuth } from "./utils/utils.js";

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose
    .connect(
        "mongodb+srv://islampucigov:Nx0MWP3zXW3qe0As@cluster0.cwd1l5c.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Could not connect to MongoDB...", err);
        process.exit(1);
    });

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    loginValidation,
    PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidation,
    loginValidation,
    PostController.update
);

const port = process.env.PORT || 4444;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
