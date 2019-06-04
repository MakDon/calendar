import request from 'request';
const crypto = require('crypto');

const generateCode = (serverName, timestamp) => {
  const secret = 'ihci';
  const hash = crypto.createHmac('sha256', secret)
    .update(`ihci${serverName}${timestamp}`)
    .digest('hex');
  return hash;
};


export function getUserIdIHCI(ticket, callback) {
  const err = '';
  const j = request.jar();
  const cookie = request.cookie(`rsessionid=${ticket}`);
  const url = 'http://www.animita.cn/api/getMyInfo';
  j.setCookie(cookie, url);
  // TODO: check access to teamId
  request.post({ url, jar: j }, (error, rsp, body) => {
    try {
      const userId = JSON.parse(body).data.userObj.unionid;
      callback(err, userId);
    } catch (e) {
      callback('loginError');
    }
  });
}

export function remindIHCI(target, schedule, source, callback) {
// TODO:finish it
  const authCode = generateCode('calendar', Date.now());
  const url = 'http://www.animita.cn/api/calendar/remind';
  const data = {
    authCode,
    target,
    source,
    schedule,
  };
  request.post({ url, multipart: [{ body: JSON.stringify(data) }] }, (error, rsp, body) => {
    console.log(body);
    callback();
  });
}

export function getTeammateIdsIHCI(teamId, callback) {
  const authCode = generateCode('calendar', Date.now());
  const url = 'http://www.animita.cn/api/member';
  request.post({ url, multipart: [{ body: JSON.stringify({ teamId, authCode }) }] }, (error, rsp, body) => {
    console.log(body);
    try {
      const members = [];
      const memberList = JSON.parse(body).data;
      for (let i = 0; i < memberList.length; i++) {
        const member = memberList[i];
        const name = member.personInfo;
        const id = member.unionid;
        members.push({ id, name });
      }
      callback(error, members);
    } catch (e) {
      callback('Error');
    }
  });
}
