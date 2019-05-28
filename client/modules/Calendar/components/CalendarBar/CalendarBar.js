import React, { Component } from 'react';
import PropTypes from 'prop-types';
import settPng from './setting.png';
import styles from './CalendarBar.css';
import configUrl from '../../../../config/config';
import { requestApi } from '../../../../util/apiCaller';
export class CalendarBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      calendarNameColor: `backgroundColor_${this.props.color}`,
      onChecked: false,
      ifShowEditColor: false,
    };
    this.hiddenParentColorEdit = this.hiddenParentColorEdit.bind(this);
    this.showEditColor = this.showEditColor.bind(this);
  }

  componentDidMount() {
    document.getElementById(this.props.calendarId).style.visibility = 'hidden';
    if (localStorage.getItem('calendarsShowList') !== null) {
      const calendarsShowList = JSON.parse(localStorage.getItem('calendarsShowList'));
      for (let i = 0; i < calendarsShowList.length; i++) {
        if (this.props.calendarId === calendarsShowList[i].calendarId && calendarsShowList[i].calendarStatus) {
          this.calendarSelect();
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.modifyColor !== nextProps.modifyColor) {
      this.requestEditColor(nextProps.modifyColor);
    }
  }

  hiddenParentColorEdit() {
    this.props.hiddenSmallEditColor();
    document.getElementById('calendarMain').removeEventListener('click', this.hiddenParentColorEdit, false);
  }

  findCalendar(calendarId, calendarsShowList) {
    for (let i = 0; i < calendarsShowList.length; i++) {
      if (calendarsShowList[i].calendarId === calendarId) {
        return i;
      }
    }
    return false;
  }

  calendarSelect() {
    let calendarsShowList = JSON.parse(localStorage.getItem('calendarsShowList'));
    const calendarIndex = this.findCalendar(this.props.calendarId, calendarsShowList);
    if (calendarIndex !== false) {
      calendarsShowList[calendarIndex].calendarStatus = !this.state.onChecked;
    }
    if (this.state.onChecked) {
      this.setState({ onChecked: false });
    } else {
      this.setState({ onChecked: true });
    }
    calendarsShowList = JSON.stringify(calendarsShowList);
    localStorage.removeItem('calendarsShowList');
    localStorage.setItem('calendarsShowList', calendarsShowList);
  }

  showEditColor(event) {
    this.stopPropagation(event);
    this.props.showSmallEditColor(this.props.color);
    this.props.setCalendarNum(this.props.keyNum);
    const setting = document.getElementById(this.props.calendarId);
    const left = setting.offsetParent.offsetLeft + setting.offsetLeft - 216;
    const top = setting.offsetParent.offsetTop + 40;
    this.props.setSmallEditColor(top, left);
    document.getElementById('calendarMain').addEventListener('click', this.hiddenParentColorEdit, false);
  }

  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  requestEditColor(color) {
    const requestUrl = configUrl.calendarEdit;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.props.name,
        color,
        calendarId: this.props.calendarId,
      }),
    };
    requestApi(requestUrl, data);
  }

  render() {
    return (
      <div >
        <div
          className={styles.CalendarBarBorder}
          onMouseOver={() => { document.getElementById(this.props.calendarId).style.visibility = 'visible'; }}
          onMouseOut={() => { document.getElementById(this.props.calendarId).style.visibility = 'hidden'; }}
        >
          <input type="checkbox" className={styles.checkboxStyle} id={`newCheckbox${this.props.calendarId}`} checked={this.state.onChecked} />
          <label
            htmlFor={`newCheckbox${this.props.calendarId}`}
            className={`${styles[this.state.calendarNameColor]} ${styles[this.state.onChecked ? `Color_${this.props.color}` : '']}`}
            onClick={() => this.calendarSelect()}
          ></label>
          <div className={styles.CalendarBarName} id={`calendar${this.props.name}`}>{this.props.name}</div>
          <label className={styles.setting} id={this.props.calendarId} onClick={this.showEditColor}><img src={settPng} alt="setting" /></label>
        </div>


      </div>
    );
  }
}

CalendarBar.propTypes = {
  calendarId: PropTypes.string.isRequired,
  modifyColor: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  keyNum: PropTypes.number.isRequired,
  setSmallEditColor: PropTypes.func.isRequired,
  hiddenSmallEditColor: PropTypes.func.isRequired,
  showSmallEditColor: PropTypes.func.isRequired,
  setCalendarNum: PropTypes.func.isRequired,
};

export default CalendarBar;
