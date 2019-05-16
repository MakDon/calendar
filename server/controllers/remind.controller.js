import glossary from '../util/glossary';
import config from '../config';
import { remind } from '../adaptors/remind.adaptor';

const language = config.language;
export function sendRemind(req, res) {
  if (!req.body.target) {
    res.status(400).send({
      status: 400,
      msg: glossary.badRequest[language],
    });
    return;
  }
  // TODO: 校验用户是否有对应日程的权限。
  remind(req.body.target, req.body.scheduleId, req.session.userId, (err) => {
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

