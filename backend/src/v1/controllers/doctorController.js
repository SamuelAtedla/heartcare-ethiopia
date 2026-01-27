const { Appointment, User, MedicalAttachment } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment');

// 1. Get Schedule (Confirmed & Pending Payment Approval)
const getConfirmedQueue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log(`Fetching Doctor Queue for Doctor ID: ${req.user.id} with range: ${startDate} to ${endDate}`);

    let whereClause = {
      doctorId: req.user.id,
      status: { [Op.or]: ['confirmed', 'pending_approval'] }
    };

    if (startDate && endDate) {
      whereClause.scheduledAt = {
        [Op.between]: [moment(startDate).startOf('day').toDate(), moment(endDate).endOf('day').toDate()]
      };
    } else {
      // Default to today and future if no range provided
      whereClause.scheduledAt = {
        [Op.gte]: moment().startOf('day').toDate()
      };
    }

    const queue = await Appointment.findAll({
      where: whereClause,
      include: [{ model: User, as: 'patient', attributes: ['fullName', 'phone', 'profileImage', 'age'] }],
      order: [['scheduledAt', 'ASC']]
    });
    console.log(`Found ${queue.length} items in queue.`);
    res.json(queue);
  } catch (error) {
    console.error("Doctor Queue Error:", error);
    res.status(500).json({ error: 'Could not fetch queue.' });
  }
};

// 2. Search Patients (by Name or Phone)
const searchPatients = async (req, res) => {
  try {
    const { query } = req.query; // ?query=Abebe
    console.log(`Doctor Search Query: ${query}`);

    if (!query) return res.json([]);

    const patients = await User.findAll({
      where: {
        role: 'patient',
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'fullName', 'phone', 'profileImage', 'age']
    });

    console.log(`Search found ${patients.length} patients.`);
    res.json(patients);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: 'Search failed.' });
  }
};

// 3. Get Patient History (Read-only for doctor)
const getDetailedHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(`Fetching history for Patient: ${patientId}`);

    const history = await Appointment.findAll({
      where: { patientId },
      include: [
        { model: MedicalAttachment, as: 'labResults' },
        { model: User, as: 'doctor', attributes: ['fullName'] }
      ],
      order: [['scheduledAt', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ error: 'Failed to fetch patient medical history.' });
  }
};

// 4. Get Finance Records (All appointments with various filters)
const getFinanceRecords = async (req, res) => {
  try {
    const { status, query, startDate, endDate } = req.query;
    console.log(`Fetching Finance Records for Doctor: ${req.user.id} with filters:`, { status, query, startDate, endDate });

    let whereClause = {
      doctorId: req.user.id
    };

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.scheduledAt = {
        [Op.between]: [moment(startDate).startOf('day').toDate(), moment(endDate).endOf('day').toDate()]
      };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['fullName', 'phone', 'profileImage'],
          where: query ? {
            [Op.or]: [
              { fullName: { [Op.iLike]: `%${query}%` } },
              { phone: { [Op.like]: `%${query}%` } }
            ]
          } : {}
        },
        { model: MedicalAttachment, as: 'labResults' } // Assuming receipts are here as well
      ],
      order: [['scheduledAt', 'DESC']]
    });

    res.json(appointments);
  } catch (error) {
    console.error("Finance Records Error:", error);
    res.status(500).json({ error: 'Could not fetch finance records.' });
  }
};

// 5. Update Doctor Profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, specialty, credentials, phone, professionalFee } = req.body;
    let profileImage = req.body.profileImage; // Keep existing if not uploading

    if (req.file) {
      console.log(`New profile image uploaded for Doctor: ${req.user.id}`);
      profileImage = `profiles/${req.file.filename}`;
    }

    console.log(`Updating Profile for Doctor: ${req.user.id}`);

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (credentials !== undefined) updateData.credentials = credentials;
    if (professionalFee !== undefined) updateData.professionalFee = professionalFee;
    if (profileImage) updateData.profileImage = profileImage;

    // Guard phone update similarly to before
    if (phone && phone !== '' && phone !== 'undefined') {
      updateData.phone = phone;
    }

    await User.update(
      updateData,
      { where: { id: req.user.id } }
    );

    res.json({
      message: 'Profile updated successfully.',
      profileImage
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: 'Profile update failed.' });
  }
};

// 6. Get Current Doctor Profile
const getProfile = async (req, res) => {
  try {
    const doctor = await User.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'phone', 'specialty', 'bio', 'credentials', 'profileImage', 'professionalFee']
    });
    res.json(doctor);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: 'Could not fetch profile.' });
  }
};

module.exports = {
  getConfirmedQueue,
  searchPatients,
  getDetailedHistory,
  getFinanceRecords,
  updateProfile,
  getProfile
};