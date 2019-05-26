import Calendar from '../models/calendar';
import glossary from '../util/glossary';
import config from '../config';
import cuid from 'cuid';
import { delelteRelativeSchedule } from "../util/util";

import sanitizeHtml from 'sanitize-html';

const language = config.language;

export function getCalendar(req, res) {
  if (!req.body.calendarId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // return the schedule of th calendar.
  Calendar.findOne()
    .or([{ teamId: req.session.teamId, calendarId: req.body.calendarId }, { creatorId: req.session.userId, calendarId: req.body.calendarId }])
    .exec((err, calendar) => {
      if (err) {
        res.status(500).send({
          status: 500,
          msg: glossary.internalError[language],
        });
      } else {
        if (calendar) {
          res.json({
            status: 200,
            msg: glossary.success[language],
            calendar,
          }).send();
        } else {
          res.status(404).send({
            status: 404,
            msg: glossary.notFound[language],
          });
        }
      }
    });
}

export function getCalendarList(req, res) {
  // return the list of the calendars that the user allowed to visit.
  Calendar.find().or([{ teamId: req.session.teamId }]).exec((err, calendars) => {
    if (err) {
      res.status(500)
        .send({
          status: 500,
          msg: glossary.internalError[language],
        });
    }
    res.json({
      status: 200,
      msg: glossary.success[language],
      calendars })
      .send();
  });
}

export function addCalendar(req, res) {
  if (!req.body.name) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  const newCalendar = new Calendar();
  newCalendar.calendarId = cuid();
  newCalendar.name = sanitizeHtml(req.body.name);
  newCalendar.creatorId = req.session.userId;
  newCalendar.teamId = req.session.teamId;
  newCalendar.color = sanitizeHtml(req.body.color);
  newCalendar.save((err, saved) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    } else {
      res.json({
        status: 200,
        msg: glossary.success[language],
        calendarId: saved.calendarId,
      });
      res.send();
    }
  });
}

export function editCalendar(req, res) {
  if (!req.body.calendarId || !req.body.name || !req.body.color) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }

  const newCalendar = {};
  if (req.body.name) { newCalendar.name = sanitizeHtml(req.body.name); }
  newCalendar.creatorId = req.session.userId;
  newCalendar.teamId = req.session.teamId;
  if (req.body.color) { newCalendar.color = sanitizeHtml(req.body.color); }
  // Only the creator of the calendar has the permission to edit a calendar.
  Calendar.findOneAndUpdate({ calendarId: req.body.calendarId, creatorId: req.session.userId }, newCalendar, (err, foundCalendar) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    } else {
      // If found nothing
      if (!foundCalendar) {
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

// TODO: delete related schedules
export function deleteCalendar(req, res) {
  if (!req.body.calendarId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // Only the creator has the permission to delete the calendar
  Calendar.deleteOne({
    calendarId: req.body.calendarId,
    creatorId: req.session.userId,
  }).then((result) => {
    if (result.deletedCount !== 1) {
      res.status(404).send({
        status: 404,
        msg: glossary.notFound[language],
      });
    } else {
      res.json({
        status: 200,
        msg: glossary.success[language],
      })
        .send();
    }
  });
  delelteRelativeSchedule(req.body.calendarId, () => {});
}
