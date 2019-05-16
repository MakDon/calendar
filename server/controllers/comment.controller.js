import Comment from '../models/comment';
import Calendar from '../models/calendar';
import sanitizeHtml from 'sanitize-html';
import cuid from 'cuid';
import glossary from '../util/glossary';
import config from '../config';
import Schedule from '../models/schedule';

const language = config.language;

//  TODO:rename to 'checkSchedulePermission' and move it to util
function checkTeamId(req, res, scheduleId, callback) {
  Schedule.findOne({ scheduleId }).exec((err, schedule) => {
    if (err) {
      res.status(500)
        .send({
          status: 500,
          msg: glossary.internalError[language],
        });
    } else if (!schedule) {
      res.status(404).send({
        status: 404,
        msg: glossary.notFound[language],
      });
    } else {
      Calendar.findOne({ calendarId: schedule.calendarId }).exec((erro, calendar) => {
        if (erro) {
          res.status(500)
            .send({
              status: 500,
              msg: glossary.internalError[language],
            });
        } else if (!calendar || (calendar.teamId !== req.session.teamId && calendar.creatorId !== req.session.userId)) {
          res.status(404).send({
            status: 404,
            msg: glossary.notFound[language],
          });
        } else {
          callback(req, res);
        }
      });
    }
  });
}
export function getCommentBySchedule(req, res) {
  if (!req.body.scheduleId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  checkTeamId(req, res, req.body.scheduleId, () => {
    Comment.find({ scheduleId: req.body.scheduleId }).exec((err, comments) => {
      if (err) {
        res.status(500).send({
          status: 500,
          msg: glossary.internalError[language],
        });
      } else {
        res.json({
          status: 200,
          msg: glossary.success[language],
          comments,
        }).send();
      }
    });
  });
}

/* Temporarily deprecated cause there's no need to call
export function getComment(req, res) {
  if (!req.body.commentId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // check permission scheduleId->calendarId->teamId
  Comment.find({ commentId: req.body.commentId }).exec((err, comments) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    } else {
      res.json(comments).send();
    }
  });
}
*/

/**
 * function called by create controller and reply controller
 * DO NOT use the function in router directly.
 * @param req
 * @param res
 * @param scheduleId: schedule id for create or reply.
 */
function addOrReplay(req, res, scheduleId) {
  checkTeamId(req, res, scheduleId, () => {
    const newComment = new Comment();
    newComment.commentId = cuid();
    // scheduleId->calendarId->teamId
    newComment.scheduleId = scheduleId || sanitizeHtml(req.body.scheduleId);
    newComment.content = sanitizeHtml(req.body.content);
    newComment.creatorId = req.session.userId;
    if (req.body.replyCommentId) { newComment.replyCommentId = req.body.replyCommentId; }
    newComment.save((err, saved) => {
      if (err) {
        res.status(500).send({
          status: 500,
          msg: glossary.internalError[language],
        });
      } else {
        res.json({
          status: 200,
          msg: glossary.success[language],
          commentId: saved.commentId,
        }).send();
      }
    });
  }, scheduleId);
}

export function addComment(req, res) {
  if (!req.body.content || !req.body.scheduleId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  addOrReplay(req, res, req.body.scheduleId);
}

/* Temporarily deprecated because no edit history
export function editComment(req, res) {
  if (!req.body.commentId || !req.body.content) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  const newComment = {};
  newComment.content = sanitizeHtml(req.body.content);
  Comment.update({ commentId: req.body.commentId, creatorId: req.session.userId }, newComment, (err) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    } else {
      res.json({
        status: 200,
        msg: glossary.success[language],
      });
      res.send();
    }
  });
}
*/

// TODO: set delete flag instead of deleting from DB
export function deleteComment(req, res) {
  if (!req.body.commentId) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  Comment.deleteOne({
    commentId: req.body.commentId,
    creatorId: req.session.userId,
  }, (err) => {
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


export function replyComment(req, res) {
  if (!req.body.replyCommentId || !req.body.content) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  Comment.findOne({ commentId: req.body.replyCommentId }).exec((err, comment) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language],
      });
    } else {
      const scheduleId = comment.scheduleId;
      addOrReplay(req, res, scheduleId);
    }
  });
}
