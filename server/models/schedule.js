import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schedule = new Schema({
  scheduleId: { type: 'String', required: true, index: true },
  scheduleName: { type: 'String', required: true },
  creatorId: { type: 'String', required: true, index: true },
  calendarId: { type: 'String', required: true, index: true },
  isWholeDay: { type: 'Boolean', required: true, default: true },
  startTime: { type: 'Date', default: Date.now, required: true },
  endTime: { type: 'Date', default: Date.now, required: true },
  location: { type: 'String' },
  members: [String],
  // 用户评论
  // 修改记录（使用一个修改历史list+一个deleted flag实现）
  dateCreated: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Schedule', schedule);
