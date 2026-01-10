const { Article, User, Appointment } = require('../../models');

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

const getStats = async (req, res) => {
    try {
        const patientsHelped = await Appointment.count({
            where: { status: 'completed' },
            distinct: true,
            col: 'patientId'
        });
        res.json({ patientsHelped });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

module.exports = { getArticles, getDoctors, getStats };
