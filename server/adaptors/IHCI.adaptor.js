import request from 'request';

const crypto = require('crypto');
const hostname = 'http://39.108.68.159:5000';

const generateCode = (serverName, timestamp) => {
  const secret = 'ihci';
  return crypto.createHmac('sha256', secret)
    .update(`ihci${serverName}${timestamp}`)
    .digest('hex');
};


export function getUserIdIHCI(ticket, callback) {
  const err = '';
  const j = request.jar();
  const cookie = request.cookie(`rsessionid=${ticket}`);
  const url = `${hostname}/api/getMyInfo`;
  j.setCookie(cookie, url);
  // TODO: check access to teamId
  request.post({ url, jar: j }, (error, rsp, body) => {
    try {
      const userId = JSON.parse(body).data.userObj._id;
      callback(err, userId);
    } catch (e) {
      callback('loginError');
    }
  });
}

export function remindIHCI(target, schedule, source, callback) {
// TODO:finish it
  const authCode = generateCode('calendar', Date.now());
  const url = `${hostname}/api/calendar/remind`;
  const data = {
    authCode,
    target,
    source,
    schedule,
  };
  const headers = { 'Content-type': 'application/json' };
  request.post({ url, headers, body: JSON.stringify(data)  }, () => {
    callback();
  });
}

export function getTeammateIdsIHCI(teamId, callback) {
  const authCode = generateCode('calendar', Date.now() - Date.now() % 60000);
  const url = `${hostname}/api/member`;
  const headers = { 'Content-type': 'application/json' };
  request.post({ url, headers, body: JSON.stringify({ teamId, authCode }) }, (error, rsp, body) => {
    console.log(body);
    // TODO: wrong list
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
