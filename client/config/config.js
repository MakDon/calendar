
// const testUrl = 'https://8501bddf-2114-4e75-a488-7d79046c3f8a.mock.pstmn.io';
const url = '';
export const iframeUrl = 'http://39.108.68.159:5000';
export const iframeUrlTest = 'http://localhost:5000';
const configUrl = {
  iframeParent: `${iframeUrl}/calendar`,
  calendarLogin: `${url}/api/calendar/login`,
  calendarList: `${url}/api/calendar/list`,
  calendarAdd: `${url}/api/calendar/add`,
  calendarEdit: `${url}/api/calendar/edit`,
  calendarDelete: `${url}/api/calendar/delete`,
  calendarInfo: `${url}/api/calendar/info`,
  scheduleList: `${url}/api/calendar/schedule/list`,
  scheduleAdd: `${url}/api/calendar/schedule/add`,
  scheduleEdit: `${url}/api/calendar/schedule/edit`,
  scheduleDelete: `${url}/api/calendar/schedule/delete`,
  scheduleInfo: `${url}/api/calendar/schedule/info`,
  commentsList: `${url}/api/calendar/schedule/comment/list`,
  commentsAdd: `${url}/api/calendar/schedule/comment/add`,
  commentsDelete: `${url}/api/calendar/schedule/comment/delete`,
  commentsReply: `${url}/api/calendar/schedule/comment/reply`,
  teammates: `${url}/api/team/teammates`,
};
export default configUrl;
