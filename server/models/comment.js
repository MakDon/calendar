import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  commentId: { type: 'String', required: true, index: true },
  scheduleId: { type: 'String', required: true, index: true },
  content: { type: 'String', required: true },
  creatorId: { type: 'String', required: true, index: true },
  dateCreated: { type: 'Date', default: Date.now, required: true },
  deletedFlag: { type: 'Boolean', default: false, required: true },
  replyCommentId: { type: 'String', required: false },
});

export default mongoose.model('Comment', CommentSchema);
