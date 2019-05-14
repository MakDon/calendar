import { Router } from 'express';
import * as CalendarController from '../controllers/calendar.controller';
import * as ScheduleController from '../controllers/schedule.controller';

import * as CommentController from '../controllers/comment.controller';
const router = new Router();

router.route('/add').post(CalendarController.addCalendar);
router.route('/info').post(CalendarController.getCalendar);
router.route('/list').post(CalendarController.getCalendarList);
router.route('/edit').post(CalendarController.editCalendar);
router.route('/delete').post(CalendarController.deleteCalendar);

router.route('/schedule/add').post(ScheduleController.addSchedule);
router.route('/schedule/info').post(ScheduleController.getSchedule);
router.route('/schedule/list').post(ScheduleController.getScheduleList);
router.route('/schedule/edit').post(ScheduleController.editSchedule);
router.route('/schedule/delete').post(ScheduleController.deleteSchedule);

router.route('/schedule/comment/list').post(CommentController.getCommentBySchedule);
router.route('/schedule/comment/add').post(CommentController.addComment);
// edit comment is commented because there's no edit history.
// router.route('/schedule/comment/edit').post(CommentController.editComment);
router.route('/schedule/comment/reply').post(CommentController.replyComment);
router.route('/schedule/comment/delete').post(CommentController.deleteComment);



export default router;
