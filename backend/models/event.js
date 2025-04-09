import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: false },
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;