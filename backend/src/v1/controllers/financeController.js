const { Appointment, User, Payment } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment');

// Get All Transactions (For Finance & Admin)
const getAllTransactions = async (req, res) => {
    try {
        const { startDate, endDate, status, query } = req.query;
        console.log(`Fetching Transactions for User: ${req.user.id} (${req.user.role})`);

        let whereClause = {};

        // Filter by Status
        if (status) {
            whereClause.status = status;
        }

        // Filter by Date
        if (startDate && endDate) {
            whereClause.scheduledAt = {
                [Op.between]: [moment(startDate).startOf('day').toDate(), moment(endDate).endOf('day').toDate()]
            };
        }

        // Include Logic
        const includeOptions = [
            {
                model: User,
                as: 'doctor',
                attributes: ['fullName', 'specialty']
            },
            {
                model: User,
                as: 'patient',
                attributes: ['fullName', 'phone'],
                where: query ? {
                    [Op.or]: [
                        { fullName: { [Op.iLike]: `%${query}%` } },
                        { phone: { [Op.like]: `%${query}%` } }
                    ]
                } : {}
            }
        ];

        // Fetch Appointments (acting as transactions here mainly)
        // Ideally, we should look at a Payment model if it exists properly linked, 
        // but Appointment holds paymentReference and status.
        const transactions = await Appointment.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['scheduledAt', 'DESC']]
        });

        // If Role is 'admin', they see everything (which is what we fetched).
        // If Role is 'finance', they also see everything detailed.
        // The requirement was: 
        // "finance being modified to show individual transaction and for the admin showing all transactions."
        // This implies both see the list. Maybe admin sees aggregated stats? 
        // For now, I'll return the list for both as "individual transaction" view.

        res.json(transactions);

    } catch (error) {
        console.error("Get All Transactions Error:", error);
        res.status(500).json({ error: 'Failed to fetch transactions.' });
    }
};

module.exports = {
    getAllTransactions
};
