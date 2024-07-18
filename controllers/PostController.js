import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const posts = await PostModel.find()
            .sort({ [sortBy]: sortOrder })
            .populate("user")
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We coudn't get articles, sorry",
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((post) => post.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't get tags, sorry",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId).populate("user");
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        post.viewsCount++;
        await post.save();
        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Could not receive post",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndDelete({ _id: postId });

        if (!post) {
            return res.status(404).json({
                message: "Article is not defined",
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't remove the article",
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Sorry, don't did create article",
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findByIdAndUpdate(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(","),
                user: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't update the article",
        });
    }
};
