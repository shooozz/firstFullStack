import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import UserModel from "../models/Users.js";

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
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
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "User is not defined",
            });
        }

        const isValidPass = await bcryptjs.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(403).json({
                message: "Wrong login or password",
            });
        }

        const token = jwt.sign(
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
            message: "Can't assignant",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User is not definded",
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "don't have access",
        });
    }
};
