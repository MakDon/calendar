import React, { Component } from 'react';
import styles from './Calendar.css';
import CalendarView from './pages/CalendarView/CalendarView';
import CalendarBarView from './pages/CalendarBarView/CalendarBarView';
import configUrl from '../../../config/config';
import { requestApi } from '../../util/apiCaller';
import messages from '../../../config/glossary';

export class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowYearMonth: '',
      calendars: [],
      ifLogin: false,
    };
    this.requestLoginCalendar = this.requestLoginCalendar.bind(this);
    this.requestTeamMates = this.requestTeamMates.bind(this);
  }

  componentDidMount() {
    let ticket = '';
    let teamId = '';
    if (process.env.NODE_ENV === 'development') {
      if (ticket === '' && teamId === '') {
        ticket = 'ThisIsTestTicket';
        teamId = 'ThisIsTestTeamId';
      }
      this.requestLoginCalendar(ticket, teamId);
    } else {
      window.addEventListener('message', (e) => {
        // console.log(e.data);
        const height = document.body.scrollHeight;
        top.postMessage(height, configUrl.iframeParent);
        if (!e.data) {
          console.log(messages.invalidValue);
        }
        ticket = e.data.ticket;
        teamId = e.data.teamId;
        if (ticket === '' || teamId === '') {
          console.log(messages.invalidValue);
        } else {
          this.requestLoginCalendar(ticket, teamId);
        }
      }, false);
    }
  }

  setNowYearMonth = (time) => {
    this.setState({
      nowYearMonth: time,
    });
  };

  setCalendars = (calendars) => {
    this.setState({
      calendars,
    });
  };

  requestLoginCalendar(ticket, teamId) {
    const requestUrl = configUrl.calendarLogin;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticket,
        teamId,
      }),
    };
    requestApi(requestUrl, data, this.requestTeamMates);
  }

  requestTeamMates(result) {
    if (result.status === 200) {
      this.setState({
        ifLogin: true,
      });
      const requestUrl = configUrl.teammates;
      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      };
      requestApi(requestUrl, data, this.printResult);
    }
  }

  printResult(result) {
    if (result.status === 200) {
      const teammates = result.teammates;
      let teammatesFormat = '';
      for (let i = 0; i < teammates.length; i++) {
        teammatesFormat = `${teammatesFormat + JSON.stringify(teammates[i])}-`;
      }
      localStorage.setItem('teammates', teammatesFormat);
      // console.log(teamMember);
    }
  }
  render() {
    return (
      <div className={styles.CalendarBorder} id="calendarMain">
        <CalendarView ifLogin={this.state.ifLogin} setNowYearMonth={(time) => { this.setNowYearMonth(time); }} calendars={this.state.calendars} />
        <CalendarBarView ifLogin={this.state.ifLogin} setCalendars={(calendars) => { this.setCalendars(calendars); }} nowDate={this.state.nowYearMonth} />
      </div>
    );
  }
}

export default Calendar;
