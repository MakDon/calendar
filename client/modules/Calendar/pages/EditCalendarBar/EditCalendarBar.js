import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './EditCalendarBar.css';
import { browserHistory } from 'react-router';
import messages from '../../../../config/glossary';
import configUrl from '../../../../config/config';
import { requestApi } from '../../../../util/apiCaller';

export class EditCalendarBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedLabel: this.props.params.calendarColor,
    };
    this.saveCalendar = this.saveCalendar.bind(this);
    this.requestAddCalendar = this.requestAddCalendar.bind(this);
  }

  componentDidMount() {
    document.getElementById(`newCheckbox${this.state.checkedLabel}`).checked = true;
    document.getElementById('errorCalendarName').style.display = 'none';
    document.getElementById('calendarName').value = this.props.params.calendarName;
  }

  calendarColorSelect(i) {
    document.getElementById(`newCheckbox${this.state.checkedLabel}`).checked = false;
    this.setState({
      checkedLabel: i,
    });
  }

  saveCalendar() {
    const calendarName = document.getElementById('calendarName').value;
    if (!calendarName) {
      document.getElementById('errorCalendarName').style.display = 'block';
    } else {
      this.requestAddCalendar(calendarName, this.state.checkedLabel, this.props.params.calendarId);
    }
  }

  requestAddCalendar(name, color, calendarId) {
    const requestUrl = configUrl.calendarEdit;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
        calendarId,
      }),
    };
    requestApi(requestUrl, data, this.afterAddCalendar);
  }

  afterAddCalendar(result) {
    if (result.status === 200) {
      browserHistory.push('/');
    }
  }

  skipToIndexPage() {
    browserHistory.push('/');
  }

  render() {
    let colorList = [];
    for (let i = 1; i <= 18; i++) {
      colorList.push(
        <div key={`color${i}`}>
          <input type="checkbox" className={styles.checkboxStyle} id={`newCheckbox${i}`} />
          <label
            id={`newCheckbox${i}`}
            htmlFor={`newCheckbox${i}`}
            className={`${styles[`backgroundColor_${i}`]} ${styles[(parseInt(this.state.checkedLabel, 10) === i) ? `Color_${i}` : '']}`}
            onClick={() => this.calendarColorSelect(i)}
          > </label>
        </div>,
      );
    }
    return (
      <div className={styles.addCalendarBarBorder}>
        <div className={styles.addCalendarBarBackground}>
          <div onClick={this.skipToIndexPage}>{messages.calendar}</div>
        </div>
        <div className={styles.addCalendarBarContent}>
          <div className={styles.newCalendarTitle}><h3>{messages.calendarSetting}</h3>
            <div className={styles.calendarName}>
              <input type="text" id="calendarName" />
              <div className={styles.errorCalendarName} id="errorCalendarName">{messages.writeCalendarName}</div>
            </div>

            <div className={styles.colorList}>
              {colorList}
            </div>
            <div>
              <button className={styles.newCalendarSave} onClick={this.saveCalendar} >{messages.save}</button>
              <button className={styles.newCalendarQuit} onClick={() => { browserHistory.push('/'); }}>{messages.quit}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditCalendarBar.propTypes = {
  params: PropTypes.shape({
    calendarColor: PropTypes.string.isRequired,
    calendarName: PropTypes.string.isRequired,
    calendarId: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditCalendarBar;
