import { getUserIdIHCI } from 'IHCI.adaptor';
/**
 * fetch the userId from platform server.
 * different implement according the login server;
 * @param {string} ticket: a ticket using for exchanging userId with login server.
 * @param {function} callback: function to be called when finish, with param err and userId.
 */
export function getUserId(ticket, callback) {
  if (process.env.NODE_ENV !== 'production') {
    const error = '';
    const userId = 'ThisIsATestingUserId';
    callback(error, userId);
  } else {
    getUserIdIHCI(ticket, callback);
  }
}
