import { body } from "express-validator";

export const postCreateValidation = [
    body("title", "Write title of article").isLength({ min: 3 }).isString(),
    body("text", "Write text of article").isLength({ min: 10 }).isString(),
    body("tags", "Write format of tags(indicate array)").optional().isString(),
    body("imageUrl", "Wrong link to image").optional().isString(),
];
