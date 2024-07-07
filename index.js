import express from "express";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";

import UserModel from "./models/Users.js";

const app = express();

app.use(express.json());

mongoose
    .connect(
        "mongodb+srv://islampucigov:Nx0MWP3zXW3qe0As@cluster0.cwd1l5c.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Could not connect to MongoDB...", err);
        process.exit(1);
    });

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jsonwebtoken.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...user._doc,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "This user already signed",
        });
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const port = process.env.PORT || 4444;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
