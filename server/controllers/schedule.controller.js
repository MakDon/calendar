import glossary from '../util/glossary';
import Schedule from '../models/schedule';
import config from '../config';
import Calendar from '../models/calendar';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';
import Comment from '../models/comment';
const Promise = require('bluebird');
// const Promise = require('Promise');

const language = config.language;

// TODO: query by date
export function getScheduleList(req, res) {
  let scheduleList = [];
  Calendar.find().or([{ teamId: req.session.teamId }]).exec((err, calendars) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    }
    // calendars is a list of calendar that the user has permission to visit.
    const queries = calendars.map((calendar) => {
      const calendarId = calendar.calendarId;
      return Schedule.find({ calendarId });
    });
    Promise.all(queries).then((sches) => {
      for (let i = 0; i < sches.length; i++) {
        scheduleList = scheduleList.concat(sches[i]);
      }
      res.json({
        status: 200,
        msg: glossary.success[language],
        schedules: scheduleList,
        calendars,
      })
        .send();
    });
  });
}

export function getSchedule(req, res) {
  if (!req.body.scheduleId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  Schedule.find()
    .or([{ scheduleId: req.body.scheduleId, teamId: req.session.teamId },
      { scheduleId: req.body.scheduleId, creatorId: req.session.userId }])
    .exec((err, schedule) => {
      if (err) {
        res.status(500).send({
          status: 500,
          msg: glossary.internalError[language],
        });
      } else {
        if (Array.isArray(schedule) && schedule.length === 0 || !schedule) {
          res.status(404).send({
            status: 404,
            msg: glossary.notFound[language],
          });
        } else {
          res.json({
            status: 200,
            msg: glossary.success[language],
            schedule,
          }).send();
        }
      }
    });
}

export function addSchedule(req, res) {
  if (!req.body.scheduleName || !req.body.calendarId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // Check validity of calendarId, including if it's exist and
  // if the user has the permission.
  Calendar.find()
    .or([{
      calendarId: req.body.calendarId,
      teamId: req.session.teamId },
    { calendarId: req.body.calendarId,
    creatorId: req.session.userId }])
    .exec((err, calendar) => {
      if (err) {
        res.status(500).send({
          status: 500,
          msg: glossary.internalError[language],
        });
      } else {
        if (Array.isArray(calendar) && calendar.length === 0) {
          res.status(404).send({
            status: 404,
            msg: glossary.notFound[language],
          });
        } else {
          // check calendar exist pass, begin to create schedule.
          const newSchedule = new Schedule();
          newSchedule.scheduleId = cuid();
          newSchedule.scheduleName = sanitizeHtml(req.body.scheduleName);
          newSchedule.creatorId = req.session.userId;
          newSchedule.calendarId = sanitizeHtml(req.body.calendarId);
          newSchedule.isWholeDay = sanitizeHtml(req.body.isWholeDay);
          newSchedule.location = sanitizeHtml(req.body.location);
          newSchedule.members = req.body.members;
          if (req.body.startTime) newSchedule.startTime = sanitizeHtml(req.body.startTime);
          if (req.body.endTime) newSchedule.endTime = sanitizeHtml(req.body.endTime);
          newSchedule.save((error, saved) => {
            if (error) {
              res.status(500).send({
                status: 500,
                msg: glossary.internalError[language],
              });
            }
            res.json({
              status: 200,
              msg: glossary.success[language],
              scheduleId: saved.scheduleId });
            res.send();
          });
        }
      }
    });
}

export function editSchedule(req, res) {
  if (!req.body.scheduleId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }

  const newSchedule = {};
  if (req.body.scheduleName) {
    newSchedule.scheduleName = req.body.scheduleName;
  }
  if (req.body.startTime) {
    newSchedule.startTime = req.body.startTime;
  }
  if (req.body.endTime) {
    newSchedule.endTime = req.body.endTime;
  }
  if (req.body.location) {
    newSchedule.location = req.body.location;
  }
  if (req.body.isWholeDay) {
    newSchedule.isWholeDay = sanitizeHtml(req.body.isWholeDay);
  }
  if (req.body.members) {
    newSchedule.members = req.body.members;
  }
  // TODO: 修改记录
  Schedule.findOneAndUpdate({ scheduleId: req.body.scheduleId, creatorId: req.session.userId }, newSchedule, (err, foundSchedule) => {
    if (err) {
      res.status(500)
        .send({
          status: 500,
          msg: glossary.internalError[language],
        });
    } else {
      if (Array.isArray(foundSchedule) && foundSchedule.length === 0 || !foundSchedule) {
        res.status(404).send({
          status: 404,
          msg: glossary.notFound[language],
        });
      } else {
        res.json({
          status: 200,
          msg: glossary.success[language],
        });
        res.send();
      }
    }
  });
}

export function deleteSchedule(req, res) {
  if (!req.body.scheduleId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // TODO: delete related comments
  Schedule.deleteOne({
    creatorId: req.session.userId,
    scheduleId: req.body.scheduleId,
  }).then((result) => {
    if (result.deletedCount !== 1) {
      res.status(404).send({
        status: 404,
        msg: glossary.notFound[language],
      });
    } else {
      Comment.deleteMany({ scheduleId: req.body.scheduleId }, (err) => {
        if (err) {
          res.status(500).send({
            status: 500,
            msg: glossary.internalError[language],
          });
        } else {
          res.json({
            status: 200,
            msg: glossary.success[language],
          }).send();
        }
      });
    }
  });
}

