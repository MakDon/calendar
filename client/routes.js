/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './modules/App/App';
// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  require('./modules/Calendar/Calendar');
  require('./modules/Calendar/pages/AddCalendarBar/AddCalendarBar');
  require('./modules/Calendar/pages/CalendarBarView/CalendarBarView');
  require('./modules/Calendar/pages/CalendarView/CalendarView');
  require('./modules/Calendar/pages/DetailSchedule/DetailSchedule');
  require('./modules/Calendar/pages/EditCalendarBar/EditCalendarBar');
  require('./modules/Calendar/pages/EditSchedule/EditSchedule');
  require('./modules/Calendar/pages/Schedule/Schedule');
}

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default (
  <Route path="/" component={App}>
    <IndexRoute
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Calendar/Calendar').default);
        });
      }}
    />
    <Route
      path="addCalendarBar/:nowTime"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Calendar/pages/AddCalendarBar/AddCalendarBar').default);
        });
      }}
    />
    <Route
      path="editCalendarBar/:calendarId/:calendarName/:calendarColor"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Calendar/pages/EditCalendarBar/EditCalendarBar').default);
        });
      }}
    />
    <Route
      path="editSchedule/:scheduleId"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Calendar/pages/EditSchedule/EditSchedule').default);
        });
      }}
    />
    <Route
      path="detailSchedule/:scheduleId"
      getComponent={(nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('./modules/Calendar/pages/DetailSchedule/DetailSchedule').default);
        });
      }}
    />
  </Route>


);
