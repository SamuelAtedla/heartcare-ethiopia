// src/v1/controllers/serviceController.js
const { Service } = require('../../models');

const getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            order: [['order', 'ASC']]
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: 'Error creating service', error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Service.update(req.body, {
            where: { id }
        });
        if (updated) {
            const updatedService = await Service.findByPk(id);
            return res.json(updatedService);
        }
        throw new Error('Service not found');
    } catch (error) {
        res.status(400).json({ message: 'Error updating service', error: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Service.destroy({
            where: { id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        throw new Error('Service not found');
    } catch (error) {
        res.status(400).json({ message: 'Error deleting service', error: error.message });
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService
};
