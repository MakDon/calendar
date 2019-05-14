import { getTeammateIds } from '../adaptors/team.adaptor';
import glossary from '../util/glossary';
import config from '../config';

const language = config.language;

export function getTeammate(req, res) {
  getTeammateIds(req.session.teamId, (err, Ids) => {
    if (err) {
      res.status(500).send({
        status: 500,
        msg: glossary.internalError[language] });
    } else {
      res.json({
        status: 200,
        msg: glossary.success[language],
        teammates: Ids,
      }).send();
    }
  });
}
