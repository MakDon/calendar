import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './EditSchedule.css';
import { browserHistory } from 'react-router';
import messages from '../../../../../config/glossary';
import configUrl from '../../../../../config/config';
import PropTypes from 'prop-types';
import { requestApi } from '../../../../util/apiCaller';

export class EditSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarNames: [[], []],
      calendarOptionId: '',
      calendarOption: '',
      // repeatOption: messages.repeatSelect[0],
      // remindOption: messages.remindSelect[0],
      // showCreator: true,
      teamMember: [],
      memberListOption: [],
      memberSelect: [],
      scheduleId: this.props.params.scheduleId,
      scheduleInfo: {
        scheduleName: '',
        startTime: '',
        endTime: '',
        location: '',
        memberInfo: [],
      },
      ifSelectAllPeople: false,
    };
    this.calendarOptionsChange = this.calendarOptionsChange.bind(this);
    // this.repeatOptionsChange = this.repeatOptionsChange.bind(this);
    // this.remindOptionsChange = this.remindOptionsChange.bind(this);
    // this.changeShowCreator = this.changeShowCreator.bind(this);
    this.ScheduleEditSave = this.ScheduleEditSave.bind(this);
    this.ScheduleEditQuit = this.ScheduleEditQuit.bind(this);
    this.saveSchedule = this.saveSchedule.bind(this);
    this.printResult = this.printResult.bind(this);
    this.requestScheduleInfo = this.requestScheduleInfo.bind(this);
    this.setScheduleInfo = this.setScheduleInfo.bind(this);
    this.requestScheduleEdit = this.requestScheduleEdit.bind(this);
    this.requestCalendarList = this.requestCalendarList.bind(this);
    this.setCalendarNames = this.setCalendarNames.bind(this);
    this.setMemberInfo = this.setMemberInfo.bind(this);
    this.changeSelectAllPeople = this.changeSelectAllPeople.bind(this);
    this.selectAllPeople = this.selectAllPeople.bind(this);
    this.findSelectName = this.findSelectName.bind(this);
  }

  componentDidMount() {
    this.requestCalendarList();
    // document.getElementById('selectAllDayType').checked = true;
    // document.getElementById('showCreator').checked = true;
  }

  setTextareaHeight() {
    const textarea = document.getElementById('modifyScheduleName');
    textarea.style.height = `${textarea.scrollHeight + 1}px`;
  }

  setScheduleInfo(result) {
    if (result.status === 200) {
      const schedule = result.schedule[0];
      const scheduleInfo = {
        scheduleName: schedule.scheduleName,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        members: schedule.members,
        location: '',
      };
      if (schedule.location !== undefined) {
        scheduleInfo.location = schedule.location;
      }
      this.setState({
        scheduleInfo,
        calendarOptionId: schedule.calendarId,
      }, () => {
        const calendarIndex = this.state.calendarNames[1].indexOf(this.state.calendarOptionId);
        if (calendarIndex) {
          this.setState({
            calendarOption: this.state.calendarNames[0][calendarIndex],
          });
        }
        const startTime = this.state.scheduleInfo.startTime.split('T')[0];
        const endTime = this.state.scheduleInfo.endTime.split('T')[0];
        // document.getElementById('selectAllDayType').value = this.state.scheduleInfo.isWholeDay;
        document.getElementById('location').value = this.state.scheduleInfo.location;
        document.getElementById('modifyScheduleName').value = this.state.scheduleInfo.scheduleName;
        document.getElementById('startTime').value = startTime;
        document.getElementById('endTime').value = endTime;
        if (this.state.scheduleInfo.members.length !== 0) {
          this.findSelectName(this.state.scheduleInfo.members);
        }
      });
    }
  }

  setCalendarNames(result) {
    if (result.status === 200) {
      const calendars = result.calendars;
      for (let i = 0; i < calendars.length; i++) {
        this.state.calendarNames[0].push(calendars[i].name);
        this.state.calendarNames[1].push(calendars[i].calendarId);
      }
      this.setMemberInfo();
    }
  }

  setMemberInfo() {
    const teammates = localStorage.getItem('teammates');
    if (teammates !== null) {
      const teamMember = teammates.split('-');
      teamMember.pop();
      for (let i = 0; i < teamMember.length; i++) {
        teamMember[i] = JSON.parse(teamMember[i]);
      }
      this.setState({
        teamMember,
      }, () => {
        this.requestScheduleInfo();
      });
    }
  }

  calendarOptionsChange(event) {
    this.setState({ calendarOption: event.target.value });
  }

  // repeatOptionsChange(event) {
  //   this.setState({ repeatOption: event.target.value });
  // }
  //
  // remindOptionsChange(event) {
  //   this.setState({ remindOption: event.target.value });
  // }

  // changeShowCreator() {
  //   if (this.state.showCreator) {
  //     this.setState({
  //       showCreator: false,
  //     });
  //   } else {
  //     this.setState({
  //       showCreator: true,
  //     });
  //   }
  // }

  saveSchedule() {
    const ScheduleName = document.getElementById('ScheduleName').value;
    if (!ScheduleName) {
      document.getElementById('errorScheduleName').style.display = 'block';
    } else {
      // this.requestAddSchedule(ScheduleName, this.state.checkedLabel, this.props.params.scheduleId);
    }
  }

  requestCalendarList() {
    const requestUrl = configUrl.calendarList;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      }),
    };
    requestApi(requestUrl, data, this.setCalendarNames);
  }

  requestScheduleInfo() {
    const requestUrl = configUrl.scheduleInfo;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: this.state.scheduleId,
      }),
    };
    requestApi(requestUrl, data, this.setScheduleInfo);
  }

  requestScheduleEdit() {
    // get data
    const calendarId = this.state.calendarOptionId;
    const scheduleId = this.state.scheduleId;
    const scheduleName = document.getElementById('modifyScheduleName').value;
    const isWholeDay = document.getElementById('selectAllDayType').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    // const ifRepeat = this.state.repeatOption;
    // const ifRemind = this.state.remindOption;
    const location = document.getElementById('location').value;
    const members = [];
    const memberLength = this.state.teamMember.length;
    for (let i = 0; i < memberLength; i++) {
      if (document.getElementsByClassName('memberCheckbox')[i].checked) {
        members.push(this.state.teamMember[i].id);
      }
    }
    const requestUrl = configUrl.scheduleEdit;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId,
        scheduleId,
        scheduleName,
        isWholeDay,
        startTime,
        endTime,
        location,
        members,
      }),
    };
    requestApi(requestUrl, data, this.ScheduleEditSave);
  }

  printResult() {
    // console.log(result);
  }

  ScheduleEditSave(result) {
    if (result.status === 200) {
      browserHistory.push('/');
    }
  }

  ScheduleEditQuit() {
    browserHistory.push('/');
  }

  selectAllPeople() {
    const memberLength = this.state.teamMember.length;
    document.getElementById('selectAllPeople').style.background = this.state.ifSelectAllPeople ? '#efefef' : '#44acb6';
    document.getElementById('selectAllPeople').style.color = this.state.ifSelectAllPeople ? '#777' : '#fff';
    if (this.state.ifSelectAllPeople) {
      for (let i = 0; i < memberLength; i++) {
        document.getElementsByClassName('memberCheckbox')[i].checked = '';
      }
      this.setState({
        ifSelectAllPeople: false,
      });
    } else {
      for (let i = 0; i < memberLength; i++) {
        document.getElementsByClassName('memberCheckbox')[i].checked = 'true';
      }
      this.setState({
        ifSelectAllPeople: true,
      });
    }
  }

  changeSelectAllPeople() {
    const memberLength = this.state.teamMember.length;
    for (let i = 0; i < memberLength; i++) {
      if (!document.getElementsByClassName('memberCheckbox')[i].checked) {
        this.setState({
          ifSelectAllPeople: true,
        }, () => {
          document.getElementById('selectAllPeople').style.background = this.state.ifSelectAllPeople ? '#efefef' : '#44acb6';
          document.getElementById('selectAllPeople').style.color = this.state.ifSelectAllPeople ? '#777' : '#fff';
        });
        return;
      }
    }
    this.setState({
      ifSelectAllPeople: false,
    }, () => {
      this.selectAllPeople();
    });
    return;
  }

  findSelectName(membersId) {
    const memberList = this.state.teamMember;
    let memberSelectList = [];
    for (let i = 0; i < membersId.length; i++) {
      memberSelectList = memberList.map((item, index) => {
        if (item.id === membersId[i]) {
          document.getElementsByClassName('memberCheckbox')[index].checked = 'true';
          return item.name;
        }
        return 0;
      });
    }
    return false;
  }

  render() {
    const calendarOptions = [];
    // const repeatOptions = [];
    // const remindOptions = [];
    const memberList = [];
    const calendarNames = this.state.calendarNames[0];
    for (let i = 0; i < calendarNames.length; i++) {
      calendarOptions.push(
        <option value={calendarNames[i]} key={`calendarOptions${i}`}>{calendarNames[i]}</option>
      );
    }
    // for (let i = 0; i < messages.remindSelect.length; i++) {
    //   remindOptions.push(
    //     <option key={`remindOptions${i}`}>{messages.remindSelect[i]}</option>
    //   );
    // }
    // for (let i = 0; i < messages.repeatSelect.length; i++) {
    //   repeatOptions.push(
    //     <option key={`repeatOptions${i}`}>{messages.repeatSelect[i]}</option>
    //   );
    // }
    if (this.state.teamMember.length !== 0) {
      for (let i = 0; i < this.state.teamMember.length; i++) {
        memberList.push(
          <div className={styles.calendarMember} key={`informMember${i}`} onChange={this.changeSelectAllPeople}>
            <input className="memberCheckbox" type="checkbox" />
            <span>{this.state.teamMember[i].name}</span>
          </div>
        );
      }
    }

    return (
      <div className={styles.modifyScheduleBarBorder}>
        <div className={styles.modifyScheduleBarBackground}>
          <div onClick={this.ScheduleEditQuit}>{messages.calendar}</div>
        </div>
        <div className={styles.modifyScheduleBarContent}>
          <div className={styles.modifyScheduleTitle}><h3>{messages.scheduleModify}</h3>
            <div className={styles.ScheduleBorder}>
              <div className={styles.ScheduleContent}>
                <div className={styles.ScheduleItem}>
                  <textarea
                    id="modifyScheduleName" className={styles.modifyScheduleName} placeholder="在这里输入日程内容"
                    onChange={this.setTextareaHeight}
                  ></textarea>
                </div>
                <div className={styles.ScheduleItem}>
                  <span>{messages.calendar}</span>
                  <select id="calendarSelect" className={styles.calendarSelect} value={this.state.calendarOption} onChange={this.calendarOptionsChange}>{calendarOptions}</select>
                </div>
                <div className={styles.ScheduleItem}>
                  <span>{messages.type}</span>
                  <label className={styles.selectAllDayType}><input id="selectAllDayType" type="checkbox" />{messages.allDaySchedule}</label>
                </div>
                <div className={styles.ScheduleItem}>
                  <span>{messages.startTime}</span>
                  <div className={styles.startTime}>
                    <input id="startTime" type="date" />
                  </div>
                </div>
                <div className={styles.ScheduleItem}>
                  <span>{messages.endTime}</span>
                  <div className={styles.endTime}>
                    <input id="endTime" type="date" />
                  </div>
                </div>
                {/* <div className={styles.ScheduleItem}>*/}
                {/*  <span>{messages.repeat}</span>*/}
                {/*  <select className={styles.repeatSelect} value={this.state.repeatOption} onChange={this.repeatOptionsChange} disabled="disabled" >{repeatOptions}</select>*/}
                {/* </div>*/}
                {/* <div className={styles.ScheduleItem}>*/}
                {/*  <span>{messages.remind}</span>*/}
                {/*  <select className={styles.remindSelect} value={this.state.remindOption} onChange={this.remindOptionsChange}>{remindOptions}</select>*/}
                {/* </div>*/}
                <div className={styles.ScheduleItem}>
                  <span>{messages.address}</span>
                  <input className={styles.addressText} id="location" type="text" />
                </div>
                {/* <div className={styles.ScheduleItem}>*/}
                {/*  <label><input className={styles.showCreator} id="showCreator" type="checkbox" /><span>{messages.showCreator}</span></label>*/}
                {/* </div>*/}
                <div className={styles.ScheduleItem}>
                  <h4>{messages.scheduleMember}</h4>
                </div>
                <div className={styles.ScheduleItem}>
                  <div className={styles.addMember}>
                    <div className={styles.selectAllPeople}><span id="selectAllPeople" onClick={this.selectAllPeople}>{messages.allPeople}</span></div>
                    <div className={styles.MemberList}>
                      {/* <div className={styles.clickAddMember}>*/}
                      {/*  <select placeholder={messages.clickAddMember} >{memberListOptions}</select>*/}
                      {/* </div>*/}
                      {memberList}
                    </div>
                  </div>
                </div>
                <div className={styles.ScheduleItem}>
                  <div className={styles.memberSelectBorder}>
                    {this.state.memberSelect}
                  </div>
                </div>
                <div className={styles.ScheduleItem}>
                  <div className={styles.ScheduleBtn}>
                    <button className={styles.modifyScheduleSave} onClick={this.requestScheduleEdit}>{messages.save}</button>
                    <button className={styles.modifyScheduleQuit} onClick={this.ScheduleEditQuit}>{messages.quit}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditSchedule.propTypes = {
  params: PropTypes.shape({
    scheduleId: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditSchedule;
