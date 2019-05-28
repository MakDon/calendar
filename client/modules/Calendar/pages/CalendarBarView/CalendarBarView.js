import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarBarView.css';
import CalendarBar from '../../components/CalendarBar/CalendarBar';
import { browserHistory } from 'react-router';
import { requestApi } from '../../../../util/apiCaller';
import configUrl from '../../../../config/config';
import messages from '../../../../config/glossary';

export class CalendarBarView extends Component {
// 日历名称右侧设置齿轮弹出框应可以选择并更改日历颜色。
  constructor(props) {
    super(props);
    this.state = {
      CalendarList: [],
      nowTime: '',
      checkedLabel: 1,
      selectCalendarId: '',
      selectCalendarName: '',
      calendarNum: 1,
      modifyColor: 1,
      calendarListCache: [],
      ifLogin: false,
    };
    this.addCalendarChange = this.addCalendarChange.bind(this);
    this.editCalendarChange = this.editCalendarChange.bind(this);
    this.deleteCalendarChange = this.deleteCalendarChange.bind(this);
    this.enterDeleteCalendar = this.enterDeleteCalendar.bind(this);
    this.afterRequestCalendarList = this.afterRequestCalendarList.bind(this);
    this.calendarColorSelect = this.calendarColorSelect.bind(this);
    this.afterEditCalendar = this.afterEditCalendar.bind(this);
  }

  componentDidMount() {
    document.getElementById('smallCalendarColorEdit').style.display = 'none';
    document.getElementById('deleteCalendarRemind').style.display = 'none';
  }

  componentWillReceiveProps(newprops) {
    if (newprops.ifLogin && !this.state.ifLogin) {
      this.requestCalendarBar();
      this.setState({
        ifLogin: true,
      });
    }
    this.setState({
      nowTime: newprops.nowDate,
    });
  }

  setCalendarNum(calendarNum) {
    this.setState({
      calendarNum,
    });
  }

  setSmallEditColor(top, left) {
    document.getElementById('smallCalendarColorEdit').style.top = `${top}px`;
    document.getElementById('smallCalendarColorEdit').style.left = `${left}px`;
  }

  hiddenSmallEditColor() {
    document.getElementById('smallCalendarColorEdit').style.display = 'none';
  }

  showSmallEditColor(name, colorNum, calendarId) {
    document.getElementById('smallCalendarColorEdit').style.display = 'block';
    document.getElementById(`editCheckbox${this.state.checkedLabel}`).checked = false;
    document.getElementById(`editCheckbox${colorNum}`).checked = true;
    this.setState({
      checkedLabel: colorNum,
      selectCalendarId: calendarId,
      selectCalendarName: name,
    });
  }

  calendarColorSelect(i) {
    if (i !== this.state.checkedLabel) {
      document.getElementById(`editCheckbox${this.state.checkedLabel}`).checked = false;
      this.setState({
        checkedLabel: i,
      });
      this.requestEditCalendar(this.state.selectCalendarName, i, this.state.selectCalendarId);
    }
  }

  requestCalendarBar() {
    const requestUrl = configUrl.calendarList;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };
    requestApi(requestUrl, data, this.afterRequestCalendarList);
  }

  afterRequestCalendarList(result) {
    if (result.status === 200) {
      const calendarList = result.calendars;
      const tmpCalendarList = [];
      const calendars = [];
      let calendarsShowList = [];
      for (let i = 0; i < calendarList.length; i++) {
        calendars.push({
          calendarName: calendarList[i].name,
          calendarId: calendarList[i].calendarId,
          calendarColor: calendarList[i].color,
        });
        calendarsShowList.push({
          calendarId: calendarList[i].calendarId,
          calendarStatus: false,
        });
        tmpCalendarList.push(<CalendarBar
          calendarId={calendarList[i].calendarId} color={calendarList[i].color}
          creatorId={calendarList[i].creatorId} dateCreated={calendarList[i].dateCreated} deleteFlag={calendarList[i].deleteFlag}
          name={calendarList[i].name} teamId={calendarList[i].teamId} key={`calendarBar${i}`} keyNum={i} setCalendarNum={(calendarNum) => { this.setCalendarNum(calendarNum); }}
          modifyColor={(this.state.calendarNum === i) ? this.state.modifyColor : ''} showSmallEditColor={(name, color, calendarId) => { this.showSmallEditColor(name, color, calendarId); }}
          setSmallEditColor={(top, left) => { this.setSmallEditColor(top, left); }} hiddenSmallEditColor={() => { this.hiddenSmallEditColor(); }}
        />);
      }
      if (localStorage.getItem('calendarsShowList') !== null) {
        const calendarsStatusList = JSON.parse(localStorage.getItem('calendarsShowList'));
        for (let i = 0; i < calendarsShowList.length; i++) {
          for (let j = 0; j < calendarsStatusList.length; j++) {
            if (calendarsShowList[i].calendarId === calendarsStatusList[j].calendarId) {
              calendarsShowList[i].calendarStatus = calendarsStatusList[j].calendarStatus;
            }
          }
        }
      }
      calendarsShowList = JSON.stringify(calendarsShowList);
      localStorage.setItem('calendarsShowList', calendarsShowList);
      this.props.setCalendars(calendars);
      this.setState({
        CalendarList: tmpCalendarList,
        calendarListCache: calendarList,
      });
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.CalendarLoadFailed);
    }
  }

  requestEditCalendar(name, color, calendarId) {
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
    requestApi(requestUrl, data, this.afterEditCalendar);
  }

  afterEditCalendar(result) {
    if (result.status === 200) {
      this.setState({
        CalendarList: [],
        selectCalendarId: '',
        selectCalendarName: '',
        calendarNum: 1,
        modifyColor: 1,
        calendarListCache: [],
      });
      this.requestCalendarBar();
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.CalendarEditFailed);
    }
  }

  addCalendarChange() {
    browserHistory.push(`addCalendarBar/${this.state.nowTime}`);
  }
  editCalendarChange() {
    browserHistory.push(`editCalendarBar/${
    this.state.calendarListCache[this.state.calendarNum].calendarId}/${
    this.state.calendarListCache[this.state.calendarNum].name}/${
    this.state.calendarListCache[this.state.calendarNum].color}`);
  }

  deleteCalendarChange() {
    this.showDeleteCalendarRemind();
  }

  printResult(result) {
    if (result.status === 200) {
      document.getElementById('deleteCalendarRemind').style.display = 'none';
      document.getElementById('smallCalendarColorEdit').style.display = 'none';
      this.setState({
        CalendarList: [],
      }, () => {
        this.requestCalendarBar();
      });
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.CalendarDeleteFailed);
    }
  }

  enterDeleteCalendar() {
    const requestUrl = configUrl.calendarDelete;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId: this.state.calendarListCache[this.state.calendarNum].calendarId,
      }),
    };
    requestApi(requestUrl, data, this.printResult.bind(this));
  }

  showDeleteCalendarRemind() {
    document.getElementById('deleteCalendarRemind').style.display = 'block';
  }

  AbortCalendarRemind() {
    document.getElementById('deleteCalendarRemind').style.display = 'none';
  }


  render() {
    let colorList = [];
    for (let i = 1; i <= 18; i++) {
      colorList.push(<div key={`smallColorEdit${i}`}>
        <input type="checkbox" className={styles.checkboxStyle} id={`editCheckbox${i}`} />
        <label
          id={`labelColor${i}`}
          htmlFor={`editCheckbox${i}`} className={`${styles[`backgroundColor_${i}`]} ${styles[(parseInt(this.state.checkedLabel, 10) === i) ? `Color_${i}` : '']}`}
          onClick={() => this.calendarColorSelect(i)}
        ></label>
      </div>
      );
    }

    return (
      <div className={styles.CalendarBarviewBorder}>
        <div className={styles.CalendarBarview}>
          <div className={styles.CalendarBarTitle}>
            <div>{messages.calendar}</div>
            <div id="newCalendar" onClick={this.addCalendarChange}>+ {messages.addCalendar}</div>
            <div id="more"></div>
          </div>
          <div className={styles.CalendarBar}>
            {this.state.CalendarList}
          </div>
        </div>
        <div className={styles.smallCalendarColorEdit} id="smallCalendarColorEdit">
          <div className={styles.trangleImg}>
            <div className={styles.trangleBorder}></div>
            <div className={styles.trangleContent}></div>
          </div>
          <div className={styles.ColorEditTitle}><h3>{messages.selectCalendarColor}</h3></div>
          <div className={styles.colorList}>
            {colorList}
          </div>
          <div className={styles.editOrDeleteCalendar}>
            <span onClick={this.editCalendarChange}>{messages.calendarEdit}</span>
            <span onClick={this.deleteCalendarChange}>{messages.calendarDelete}</span>
          </div>
        </div>
        <div className={styles.deleteCalendarRemind} id="deleteCalendarRemind">
          <div className={styles.remindArea}>
            <div className={styles.remindContent}>
              <span>{messages.EnterDeleteCalendar}<br />
                {messages.OthersWillBeDelete}</span>
            </div>
            <div className={styles.remindOptions}>
              <span className={styles.remindEnter} onClick={this.enterDeleteCalendar}>{messages.enter}</span>
              <span className={styles.remindQuit} onClick={this.AbortCalendarRemind}>{messages.quit}</span>
            </div>
          </div>
          <div className={styles.remindAbort} onClick={this.AbortCalendarRemind}></div>
        </div>
      </div>
    );
  }
}

CalendarBarView.propTypes = {
  setCalendars: PropTypes.func.isRequired,
  ifLogin: PropTypes.any,
};
export default CalendarBarView;
