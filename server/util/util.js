import Scheudle from '../models/schedule';
import Comment from '../models/comment';

export function deleteRelativeComment(scheduleId, _callback) {
  const callback = _callback || (() => {});
  Comment.deleteMany({ scheduleId }, callback);
}

export function delelteRelativeSchedule(calendarId, callback) {
  Scheudle.find({ calendarId }).exec((err, schedules) => {
    if (!err) {
      schedules.forEach((schedule) => {
        const scheduleId = schedule.scheduleId;
        Comment.deleteMany({ scheduleId });
      });
      Scheudle.deleteMany({ calendarId }).exec(callback);
    } else {
      callback('Something Error');
    }
  });
}
