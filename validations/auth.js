import { body } from "express-validator";

export const loginValidation = [
    body("email", "Wrong Email, check it again, please").isEmail(),
    body("password", "Password must be has 5 symbols").isLength({ min: 5 }),
];

export const registerValidation = [
    body("email", "Wrong Email, check it again, please").isEmail(),
    body("password", "Password must be has 5 symbols").isLength({ min: 5 }),
    body("fullName", "Write your real name").isLength({ min: 3 }),
    body("avatarUrl", "Wrong link to avatar").optional().isURL(),
];
