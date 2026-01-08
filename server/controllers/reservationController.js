import Reservation from '../models/Reservation.js';

// @desc    Create a new reservation
// @route   POST /api/public/reservations
// @access  Public (or Protected if logged in users only)
export const createReservation = async (req, res) => {
  try {
    const {
      outletId,
      customerName,
      customerPhone,
      tableSize,
      date,
      time,
      specialRequests,
    } = req.body;

    // Basic validation
    if (!outletId || !customerName || !customerPhone || !tableSize || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Combine date and time if needed, or just use date
    // Assuming date comes as ISO string or timestamp

    const reservation = await Reservation.create({
      outletId,
      userId: req.user ? req.user._id : null, // If user is authenticated
      customerName,
      customerPhone,
      tableSize,
      date,
      time, // Optional if date covers it
      specialRequests,
    });

    res.status(201).json({
      success: true,
      data: reservation,
      message: 'Reservation request submitted successfully',
    });
  } catch (error) {
    console.error('Create Reservation Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get reservations for an outlet
// @route   GET /api/manager/reservations/:outletId
// @access  Private (Manager/Admin)
export const getOutletReservations = async (req, res) => {
  try {
    const { outletId } = req.params;

    // Filter by date range if provided in query, else default to upcoming?
    // For now, return all or upcoming

    const reservations = await Reservation.find({ outletId })
      .sort({ date: 1 }) // Earliest first
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Get Reservations Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update reservation status
// @route   PUT /api/manager/reservations/:id
// @access  Private (Manager/Admin)
export const updateReservationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: 'Reservation not found' });
    }

    if (status) reservation.status = status;
    if (notes !== undefined) reservation.notes = notes;

    await reservation.save();

    res.status(200).json({
      success: true,
      data: reservation,
      message: `Reservation ${status}`,
    });
  } catch (error) {
    console.error('Update Reservation Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
