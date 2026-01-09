const { Availability } = require('../../models');

const availabilityController = {
    // GET /availability - Get all availability for the logged-in doctor
    getAvailability: async (req, res) => {
        try {
            const availabilities = await Availability.findAll({
                where: { doctorId: req.user.id },
                order: [['dayOfWeek', 'ASC']]
            });
            res.json(availabilities);
        } catch (error) {
            console.error('Fetch Availability Error:', error);
            res.status(500).json({ error: 'Failed to fetch availability.' });
        }
    },

    // POST /availability - Set/Update availability for a day
    updateAvailability: async (req, res) => {
        try {
            const { dayOfWeek, startTime, endTime, slotDuration, isActive } = req.body;

            // Validation
            if (dayOfWeek < 0 || dayOfWeek > 6) {
                return res.status(400).json({ error: 'Invalid day of week.' });
            }

            const [availability, created] = await Availability.findOrCreate({
                where: { doctorId: req.user.id, dayOfWeek },
                defaults: { startTime, endTime, slotDuration, isActive }
            });

            if (!created) {
                await availability.update({ startTime, endTime, slotDuration, isActive });
            }

            res.status(200).json({ message: 'Availability updated successfully.', availability });
        } catch (error) {
            console.error('Update Availability Error:', error);
            res.status(500).json({ error: 'Failed to update availability.' });
        }
    },

    // POST /availability/bulk - Bulk update
    bulkUpdateAvailability: async (req, res) => {
        try {
            const { availabilities } = req.body; // Array of availability objects

            for (const av of availabilities) {
                const { dayOfWeek, startTime, endTime, slotDuration, isActive } = av;
                const [item, created] = await Availability.findOrCreate({
                    where: { doctorId: req.user.id, dayOfWeek },
                    defaults: { startTime, endTime, slotDuration, isActive }
                });

                if (!created) {
                    await item.update({ startTime, endTime, slotDuration, isActive });
                }
            }

            res.status(200).json({ message: 'Bulk availability updated successfully.' });
        } catch (error) {
            console.error('Bulk Update Availability Error:', error);
            res.status(500).json({ error: 'Failed to bulk update availability.' });
        }
    }
};

module.exports = availabilityController;
