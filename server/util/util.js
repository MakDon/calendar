import Schedule from '../models/schedule';
import Comment from '../models/comment';

export function deleteRelativeComment(scheduleId, _callback) {
  const callback = _callback || (() => {});
  Comment.deleteMany({ scheduleId }, callback);
}

export function delelteRelativeSchedule(calendarId, callback) {
  Schedule.find({ calendarId }).exec((err, schedules) => {
    if (!err) {
      schedules.forEach((schedule) => {
        const scheduleId = schedule.scheduleId;
        Comment.deleteMany({ scheduleId });
      });
      Schedule.deleteMany({ calendarId }).exec(callback);
    } else {
      callback('Something Error');
    }
  });
}

export function getSchedule(scheduleId) {
  return Schedule.findOne({ scheduleId }).exec();
}
