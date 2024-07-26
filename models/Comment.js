import mongoose from "mongoose";

const CommentModel = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            unique: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Comment", CommentModel);
