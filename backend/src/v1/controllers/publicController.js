const { Article, User } = require('../models');

const getArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            include: [{ model: User, attributes: ['fullName'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: ['id', 'fullName', 'specialty', 'bio', 'credentials', 'profileImage']
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

module.exports = { getArticles, getDoctors };
