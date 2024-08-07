import mongoose from "mongoose";
import CommentModel from "./Comment.js";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

// Виртуальное поле для комментариев
PostSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId",
    justOne: false,
});

// Включение виртуальных полей при сериализации в JSON и объекты
PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

// Middleware для удаления комментариев при удалении поста
PostSchema.pre("findOneAndDelete", async function (next) {
    const postId = this.getQuery()["_id"];
    await CommentModel.deleteMany({ postId });
    next();
});

export default mongoose.model("Post", PostSchema);
