import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
  calendarId: { type: 'String', required: true, index: true },
  name: { type: 'String', required: true },
  creatorId: { type: 'String', required: true, index: true },
  teamId: { type: 'String', required: true, index: true },
  dateCreated: { type: 'Date', default: Date.now, required: true },
  color: { type: 'String', required: true },
  deletedFlag: { type: 'Boolean', default: false, required: true },
});

export default mongoose.model('Calendar', calendarSchema);
