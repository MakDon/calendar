import glossary from '../util/glossary';
import config from '../config';
import { getUserId } from '../adaptors/login.adaptor';

const language = config.language;
export function login(req, res) {
  if (!req.body.teamId || !req.body.ticket) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  req.session.regenerate((err) => {
    if (err) {
      res.status(500)
        .send({
          status: 500,
          msg: glossary.internalError[language],
        });
    } else {
      getUserId(req.body.ticket, (error, userId) => {
        if (error) {
          res.status(500)
            .send({
              status: 500,
              msg: glossary.internalError[language],
            });
        } else {
          // TODO: check access to teamId
          // eslint-disable-next-line no-param-reassign
          req.session.userId = userId;
          // eslint-disable-next-line no-param-reassign
          req.session.teamId = req.body.teamId;
          res.json({ status: 200, msg: glossary.success[language], userId }).send();
        }
      });
    }
  });
}
