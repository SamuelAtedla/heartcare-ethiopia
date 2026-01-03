const { Article } = require('../models');

const createArticle = async (req, res) => {
    try {
        const article = await Article.create({
            ...req.body,
            doctorId: req.user.id
        });
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create article' });
    }
};

const getMyArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { doctorId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your articles' });
    }
};

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findOne({ where: { id, doctorId: req.user.id } });

        if (!article) return res.status(404).json({ error: 'Article not found' });

        await article.update(req.body);
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Article.destroy({ where: { id, doctorId: req.user.id } });

        if (!deleted) return res.status(404).json({ error: 'Article not found' });

        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
};

module.exports = { createArticle, getMyArticles, updateArticle, deleteArticle };
