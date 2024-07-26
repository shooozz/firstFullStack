import CommentModel from "../models/Comment.js";

// Получение всех комментариев
export const getAllComments = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .sort({ createdAt: "desc" })
            .limit(5)
            .populate("user")
            .exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't get comments, sorry",
        });
    }
};
// Создание нового комментария
export const createComment = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
            postId: req.body.postId,
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, couldn't create comment",
        });
    }
};
// Получение комментариев для конкретного поста
export const getByPostId = async (req, res) => {
    try {
        const comments = await CommentModel.find({ postId: req.params.postId })
            .sort({ createdAt: "desc" })
            .populate("user")
            .exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't get comments, sorry",
        });
    }
};
// Удаление комментария
export const removeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await CommentModel.findOneAndDelete({ _id: commentId });

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't remove the comment",
        });
    }
};
