import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './AddCalendarBar.css';
import messages from '../../../../config/glossary';
import { browserHistory } from 'react-router';
import configUrl from '../../../../config/config';
import { requestApi } from '../../../../util/apiCaller';

export class AddCalendarBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nowDate: this.props.params.nowTime,
      checkedLabel: 1,
    };
    this.saveCalendar = this.saveCalendar.bind(this);
    this.requestAddCalendar = this.requestAddCalendar.bind(this);
    this.afterAddCalendar = this.afterAddCalendar.bind(this);
  }

  componentDidMount() {
    document.getElementById('newCheckbox1').checked = true;
    document.getElementById('errorCalendarName').style.display = 'none';
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
      this.requestAddCalendar(calendarName, this.state.checkedLabel);
    }
  }

  requestAddCalendar(name, color) {
    const requestUrl = configUrl.calendarAdd;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    };
    requestApi(requestUrl, data, this.afterAddCalendar);
  }

  afterAddCalendar(result) {
    if (result.status === 200) {
      this.skipToIndex();
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.CalendarAddFailed);
    }
  }

  skipToIndex() {
    browserHistory.push('/');
  }

  render() {
    let colorList = [];
    for (let i = 1; i <= 18; i++) {
      colorList.push(<div key={i}>
        <input type="checkbox" className={styles.checkboxStyle} id={`newCheckbox${i}`} />
        <label
          id={`labelColor${i}`}
          htmlFor={`newCheckbox${i}`} className={`${styles[`backgroundColor_${i}`]} ${styles[(this.state.checkedLabel === i) ? `Color_${i}` : '']}`}
          onClick={() => this.calendarColorSelect(i)}
        ></label>
      </div>
      );
    }

    return (
      <div className={styles.addCalendarBarBorder}>
        <div className={styles.addCalendarBarBackground}><div onClick={this.skipToIndex}>{`${this.state.nowDate.replace('-', '年')}月`}</div></div>
        <div className={styles.addCalendarBarContent}>
          <div className={styles.newCalendarTitle}><h3>{messages.calendarCreate}</h3>
            <div className={styles.calendarName}>
              <input type="text" placeholder="日历名称" id="calendarName" />
              <div className={styles.errorCalendarName} id="errorCalendarName">{messages.writeCalendarName}</div>
            </div>

            <div className={styles.colorList}>
              {colorList}
            </div>
            <div>
              <button className={styles.newCalendarSave} onClick={this.saveCalendar}>{messages.save}</button>
              <button className={styles.newCalendarQuit} onClick={() => { browserHistory.push('/'); }}>{messages.quit}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddCalendarBar.propTypes = {
  params: PropTypes.shape({
    nowTime: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddCalendarBar;
