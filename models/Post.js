import mongoose from "mongoose";

const PostModel = new mongoose.Schema(
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
PostModel.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "postId",
    justOne: false,
});

// Включение виртуальных полей при сериализации в JSON и объекты
PostModel.set("toJSON", { virtuals: true });
PostModel.set("toObject", { virtuals: true });

export default mongoose.model("Post", PostModel);
