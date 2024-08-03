import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const posts = await PostModel.find()
            .sort({ [sortBy]: sortOrder })
            .populate("user")
            .populate({
                path: "comments",
                populate: {
                    path: "user", // Если нужно популировать пользователя в комментариях
                    select: "fullName avatarUrl", // Выберите поля, которые хотите популировать
                },
            })
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't get articles, sorry",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId)
            .populate("user")
            .populate({
                path: "comments",
                populate: {
                    path: "user", // Если нужно популировать пользователя в комментариях
                    select: "fullName avatarUrl", // Выберите поля, которые хотите популировать
                },
            })
            .exec();
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

export const getLastTags = async (req, res) => {
    try {
        // Получение всех постов, отсортированных по дате создания в порядке убывания
        const posts = await PostModel.find().sort({ createdAt: -1 }).exec();

        // Получение всех тегов из постов и преобразование их в один массив
        const allTags = posts.map((post) => post.tags).flat();

        // Получение уникальных тегов
        const uniqueTags = [...new Set(allTags)];

        // Ограничение массива уникальных тегов до 5 элементов
        const tags = uniqueTags.slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "We couldn't get tags, sorry",
        });
    }
};

export const getPostsByTag = async (req, res) => {
    try {
        const tagName = req.params.name;
        const posts = await PostModel.find({ tags: tagName })
            .populate("user")
            .populate({
                path: "comments",
                populate: {
                    path: "user", // Если нужно популировать пользователя в комментариях
                    select: "fullName avatarUrl", // Выберите поля, которые хотите популировать
                },
            })
            .exec();

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Posts not found",
            });
        }

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Could not receive posts by tag",
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
            tags: req.body.tags,
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
