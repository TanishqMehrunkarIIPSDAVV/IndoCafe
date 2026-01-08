import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outlet',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    tableSize: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // e.g. "19:00"
      required: true,
    },
    specialRequests: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
