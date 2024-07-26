import { body } from "express-validator";

export const commentCreateValidation = [
    body("text", "Write text of comment").isLength({ min: 1 }).isString(),
    body("postId", "Invalid post ID").isMongoId(),
];
