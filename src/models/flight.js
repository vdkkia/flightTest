const mongoose = require("mongoose");
const flightSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    scheduledDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    fare: { type: Number, required: true },
    duration: { type: Number }, // in ms
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("flight", flightSchema);
