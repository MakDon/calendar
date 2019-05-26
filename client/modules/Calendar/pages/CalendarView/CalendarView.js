import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarView.css';
import CalendarDay from '../../components/CalendarDay/CalendarDay';
import Icon from 'antd/lib/icon';
import messages from '../../../../config/glossary';
import triangle from '../../components/CreateSchedule/triangle.png';
import configUrl from '../../../../config/config';
import { requestApi } from '../../../../util/apiCaller';
import { browserHistory } from 'react-router';
import moment from 'moment';

export class CalendarView extends Component {

  // TODO：日历同名时，日程颜色不正确
  // tips：如需重新渲染页面，则需要调用setState方法
  // 当前月的月视图的第一天是看到的试图面板上的第一天 （eg: 2019年3月时 ： 25）， 当前月的第一天是这个月的第一天 (eg: 2019年3月时 ： 1)
  constructor(props) {
    super(props);
    this.state = {
      /*
        param:        explanation:
        nowYear       当前显示年（eg: 2019, 四位数年限）
        nowMonth      当前显示月（eg: 4 , range:(0,11)）
        nowDate       当前显示天数（eg: 14 , range:(1,31)）
        nowDay        当前显示星期（eg: 0 , range:(0,6)星期天为一星期开始的第一天）
        startDate       当前月月视图第一天（eg: 28 , range:(1,31)）
        startDay      当前月第一天星期几（eg: 2 , range:(0,6)）
        showTodayButton   控制今天button控件的显示隐藏
      */
      nowYear: 2019,
      nowMonth: 3,
      nowDate: 31,
      nowDay: 1,
      startDate: 29,
      startDay: 2,
      showTodayButton: 0,
      nowClickRow: -1,
      calendars: [],
      calendarNames: [],
      calendarIds: [],
      calendarOption: '',
      // repeatOption: messages.repeatSelect[0],
      // remindOption: messages.remindSelect[0],
      ifRotate: false,
      // showCreator: true,
      ScheduleList: [[], [], [], [], [], [], []],
      calendarFilter: [[], [], [], [], []],
      thisMonthSchedule: [[], [], [], [], []],
      selectScheduleInfo: [],
      ifLogin: false,
    };
    this.clickRowChange = this.clickRowChange.bind(this);
    this.calendarOptionsChange = this.calendarOptionsChange.bind(this);
    // this.repeatOptionsChange = this.repeatOptionsChange.bind(this);
    // this.remindOptionsChange = this.remindOptionsChange.bind(this);
    this.moreSelectChange = this.moreSelectChange.bind(this);
    // this.changeShowCreator = this.changeShowCreator.bind(this);
    this.scheduleAdd = this.scheduleAdd.bind(this);
    this.scheduleQuit = this.scheduleQuit.bind(this);
    this.scheduleEdit = this.scheduleEdit.bind(this);
    this.scheduleDetail = this.scheduleDetail.bind(this);
    this.showCreateScheduleBoard = this.showCreateScheduleBoard.bind(this);
    this.addFinishOption = this.addFinishOption.bind(this);
    this.setScheduleSave = this.setScheduleSave.bind(this);
    this.enterDeleteSchedule = this.enterDeleteSchedule.bind(this);
    this.abortScheduleRemind = this.abortScheduleRemind.bind(this);
    this.scheduleDelete = this.scheduleDelete.bind(this);
    this.setThisMonthSchedule = this.setThisMonthSchedule.bind(this);
    this.scheduleListItemDelete = this.scheduleListItemDelete.bind(this);
    this.afterScheduleDelete = this.afterScheduleDelete.bind(this);
    this.hiddenSmallScheduleBorder = this.hiddenSmallScheduleBorder.bind(this);
    this.setSelectScheduleInfo = this.setSelectScheduleInfo.bind(this);
    this.returnStartEndTime = this.returnStartEndTime.bind(this);
    this.calendarlistener = this.calendarlistener.bind(this);
    this.calendarShowFilter = this.calendarShowFilter.bind(this);
  }

  componentWillMount() {
    this.initYearMonthDate();
    // console.log(this.state.nowMonth)
  }

  componentDidMount() {
    // 页面加载时，因为在当前月份，隐藏今天button控件
    const nouMonthButton = document.getElementById('todayButton');
    nouMonthButton.style.display = 'none';
    this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
    document.getElementById('NewScheduleName').value = messages.newSchedulePlan;
    document.getElementById('selectAllDayType').checked = true;
    // document.getElementById('showCreator').checked = true;
    document.getElementById('moreSelectContent').style.display = 'none';
    document.getElementById('createScheduleBoard').style.display = 'none';
    document.getElementById('deleteScheduleRemind').style.display = 'none';
    document.getElementById('ScheduleSmallBoardBorder').style.display = 'none';
  }

  componentWillReceiveProps(newprops) {
    if (newprops.ifLogin && !this.state.ifLogin) {
      this.setState({
        ifLogin: true,
      });
    }
    if (newprops.calendars.length > 0) {
      const calendarNames = [];
      const calendarIds = [];
      for (let i = 0; i < newprops.calendars.length; i++) {
        calendarNames.push(newprops.calendars[i].calendarName);
        calendarIds.push(newprops.calendars[i].calendarId);
      }
      this.setState({
        calendars: newprops.calendars,
        calendarNames,
        calendarIds,
        calendarOption: newprops.calendars[0].calendarName,
      }, () => {
        this.requestScheduleList();
      });
    }
  }

  setTextareaHeight() {
    const NewScheduleName = document.getElementById('NewScheduleName');
    NewScheduleName.style.height = `${NewScheduleName.scrollHeight + 1}px`;
  }

  setCreateScheduleBoard(top, left, date, rowKey) {
    let tmpDate = date;
    if (rowKey === 0 && this.state.startDay !== 1) {
      tmpDate = tmpDate - this.state.startDay + 2;
    }
    // eslint-disable-next-line quote-props
    const formatTime = moment().set({ 'year': this.state.nowYear, 'month': this.state.nowMonth, 'date': tmpDate }).format('YYYY-MM-DD');
    document.getElementById('createScheduleBoard').style.top = `${top}px`;
    document.getElementById('createScheduleBoard').style.left = `${left}px`;
    document.getElementById('startTime').value = formatTime;
    document.getElementById('endTime').value = formatTime;
  }

  setDetailScheduleBoard(top, left) {
    document.getElementById('ScheduleSmallBoardBorder').style.top = `${top}px`;
    document.getElementById('ScheduleSmallBoardBorder').style.left = `${left}px`;
  }

  setScheduleSave(result) {
    if (result.status === 200) {
      const scheduleInfo = result.schedules;
      const ScheduleList = [[], [], [], [], [], [], []];
      for (let i = 0; i < scheduleInfo.length; i++) {
        ScheduleList[0].push(scheduleInfo[i].scheduleName);
        ScheduleList[1].push(scheduleInfo[i].scheduleId);
        ScheduleList[2].push(scheduleInfo[i].startTime);
        ScheduleList[3].push(scheduleInfo[i].endTime);
        ScheduleList[4].push(this.findCalendarColor(scheduleInfo[i].calendarId, this.state.calendars));
        ScheduleList[5].push(scheduleInfo[i].calendarId);
        ScheduleList[6].push(false);
      }
      this.setState({
        ScheduleList,
      }, () => {
        document.addEventListener('click', (e) => {
          this.calendarlistener(e);
        });
      });
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.ScheduleLoadFailed);
    }
  }

  setThisMonthSchedule() {
    const tmpSchedulesList = [[], [], [], [], []];
    if (this.state.calendarFilter !== undefined && this.state.calendarFilter[0][0] !== undefined) {
      const thisMonthSchedule = [[], [], [], [], []];
      // get this month schedule
      for (let i = 0; i < this.state.calendarFilter[0].length; i++) {
        const tmpDate = new Date(this.state.calendarFilter[2][i]);
        const tmpEndDate = new Date(this.state.calendarFilter[3][i]);
        const nowDate = new Date(this.state.nowYear, this.state.nowMonth + 1, 0).getDate();
        const condi1 = moment(tmpEndDate).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.state.nowYear, 'month': this.state.nowMonth, 'date': 1 }).startOf('day'), 'days'
        );
        const condi2 = moment(tmpDate).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.state.nowYear, 'month': this.state.nowMonth, 'date': nowDate }).startOf('day'), 'days'
        );
        if (!(condi1 < 0 || condi2 > 0)) {
          thisMonthSchedule[0].push(this.state.calendarFilter[0][i]);
          thisMonthSchedule[1].push(this.state.calendarFilter[1][i]);
          thisMonthSchedule[2].push(moment(this.state.calendarFilter[2][i]).startOf('day').format());
          thisMonthSchedule[3].push(moment(this.state.calendarFilter[3][i]).startOf('day').format());
          thisMonthSchedule[4].push(this.state.calendarFilter[4][i]);
        }
      }
      // order by endTime - startTime
      let scheduleOrder = [];
      for (let i = 0; i < thisMonthSchedule[0].length; i++) {
        scheduleOrder[i] = {};
        scheduleOrder[i].num = i;
        scheduleOrder[i].days = moment(thisMonthSchedule[3][i]).diff(moment(thisMonthSchedule[2][i]), 'days');
      }
      scheduleOrder = scheduleOrder.sort((a, b) => {
        // eslint-disable-next-line dot-notation
        const v1 = a['days'];
        // eslint-disable-next-line dot-notation
        const v2 = b['days'];
        return v2 - v1;
      });
      for (let i = 0; i < scheduleOrder.length; i++) {
        let tmp = scheduleOrder[i];
        for (let j = i + 1; j < scheduleOrder.length; j++) {
          const timeDiff = moment(thisMonthSchedule[2][scheduleOrder[i].num]).diff(moment(thisMonthSchedule[2][scheduleOrder[j].num]), 'days');
          if (scheduleOrder[i].days === scheduleOrder[j].days && timeDiff >= 0) {
            tmp = scheduleOrder[j];
            scheduleOrder[j] = scheduleOrder[i];
            scheduleOrder[i] = tmp;
          }
        }
      }
      for (let i = 0; i < scheduleOrder.length; i++) {
        tmpSchedulesList[0].push(thisMonthSchedule[0][scheduleOrder[i].num]);
        tmpSchedulesList[1].push(thisMonthSchedule[1][scheduleOrder[i].num]);
        tmpSchedulesList[2].push(thisMonthSchedule[2][scheduleOrder[i].num]);
        tmpSchedulesList[3].push(thisMonthSchedule[3][scheduleOrder[i].num]);
        tmpSchedulesList[4].push(thisMonthSchedule[4][scheduleOrder[i].num]);
      }
    }
    this.setState({
      thisMonthSchedule: tmpSchedulesList,
    });
  }

  setSelectScheduleInfo(selectScheduleInfo) {
    this.setState({
      selectScheduleInfo,
    });
  }

  findCalendar(calendarId, calendarStatus) {
    const ScheduleList = this.state.ScheduleList;
    for (let i = 0; i < ScheduleList[0][0].length; i++) {
      if (ScheduleList[5][i] === calendarId) {
        ScheduleList[6][i] = calendarStatus;
      }
    }
    this.setState({
      ScheduleList,
    }, () => {
      this.calendarShowFilter();
    });
  }

  calendarlistener(e) {
    if (e.target.nodeName === 'INPUT') {
      const calendarId = e.target.getAttribute('id').split('newCheckbox')[1];
      const calendarStatus = e.target.checked;
      this.findCalendar(calendarId, calendarStatus);
    }
  }

  calendarShowFilter() {
    const calendarFilter = [[], [], [], [], []];
    let counter = 0;
    for (let i = 0; i < this.state.ScheduleList[0][0].length; i++) {
      if (this.state.ScheduleList[6][i]) {
        calendarFilter[0][counter] = this.state.ScheduleList[0][i];
        calendarFilter[1][counter] = this.state.ScheduleList[1][i];
        calendarFilter[2][counter] = this.state.ScheduleList[2][i];
        calendarFilter[3][counter] = this.state.ScheduleList[3][i];
        calendarFilter[4][counter] = this.state.ScheduleList[4][i];
        counter++;
      }
    }
    this.setState({
      calendarFilter,
    }, () => {
      this.setThisMonthSchedule();
    });
  }

  calcTheStartDay = () => {
    /*  param:        explanation:
      startDay      当前月开始第一天的星期
    */
    // 获取全局this，nowDate，nowDay
    const that = this;
    const date = that.state.nowDate;
    const day = that.state.nowDay;
    // 当前月：星期 - 天数对7的余数 + 1 （如果小于1要+7）= 这个月第一天的星期（如2019年4月第一天星期一）
    // tips: startDay的范围本应在(0,6),为方便计算修改至（1，7）
    const startDay = day - date % 7 + 1;
    return startDay < 1 ? startDay + 7 : startDay;
  };

  calcTheStartDate = (lastDate) => {
    /*  param:        explanation:
      startDate      当前月月视图的第一天
    */
    // 当前月的月视图的第一天 = 上个月的总天数 - 当前月第一天的星期 + 2
    const startDate = lastDate - this.state.startDay + 2;
    // console.log(startDay)
    return startDate > lastDate ? 1 : startDate;
  };

  initYearMonthDate = () => {
    /*  param:        explanation:
      tempDate      临时日期对象：上个月的最后一天
      lastDate      当前月的上个月总天数
    */
    // 获取系统年,月,日,星期
    const nowDate = new Date();
    this.state.nowYear = nowDate.getFullYear();
    this.state.nowMonth = nowDate.getMonth();
    this.state.nowDate = nowDate.getDate();
    this.state.nowDay = nowDate.getDay();
    // console.log( this.state.nowDay )
    // 获取当前月的上个月的总天数，上个月总天数=上个月最后一天
    const tempDate = new Date(this.state.nowYear, this.state.nowMonth, 0);
    const lastDate = tempDate.getDate();
    // 计算当前月的月视图的第一天
    this.state.startDay = this.calcTheStartDay();
    this.state.startDate = this.calcTheStartDate(lastDate);
  };

  // 上个月
  preMonth = () => {
    /*  param:        explanation:
      preDate       获取上个月的第一天日期对象
      lastDate      获取上上个月最后一天日期对象
    */
    // 根据showTodayButton监测变量判断显示今天button，并修改监测值
    if (!this.state.showTodayButton) {
      const nouMonthButton = document.getElementById('todayButton');
      nouMonthButton.style.display = '';
      this.setState({
        showTodayButton: 1,
      });
    }
    // 如果当前月为1月时，则回到上一年的12月，并修改对应当前月
    if (this.state.nowMonth === 0) {
      this.setState({
        nowYear: this.state.nowYear - 1,
        nowMonth: 11,
      }, () => {
        this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
        this.setThisMonthSchedule();
      });
    } else {
      this.setState({
        nowMonth: this.state.nowMonth - 1,
      }, () => {
        this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
        this.setThisMonthSchedule();
      });
    }
    // 计算上个月的月视图的第一天
    const preDate = new Date(this.state.nowYear, this.state.nowMonth - 1, 1);
    const lastDate = new Date(this.state.nowYear, this.state.nowMonth - 1, 0);
    this.state.nowDate = preDate.getDate();
    this.state.nowDay = preDate.getDay();
    this.state.startDay = this.calcTheStartDay();
    this.setState({
      startDate: this.calcTheStartDate(lastDate.getDate()),
    });
  };

  // 回到当前月份
  nowMonth = () => {
    /*  param:        explanation:
      nowDate       获取系统当前月的第一天日期对象
      lastDate      获取系统当前月的上个月最后一天日期对象
    */
    // 根据showTodayButton监测变量判断显示今天button，并修改监测值（在最后的setState方法中）
    const nouMonthButton = document.getElementById('todayButton');
    nouMonthButton.style.display = 'none';
    const nowDate = new Date();
    this.state.nowYear = nowDate.getFullYear();
    this.state.nowMonth = nowDate.getMonth();
    this.state.nowDate = nowDate.getDate();
    this.state.nowDay = nowDate.getDay();
    // console.log( this.state.nowDay )

    // 计算上个月的月视图的第一天
    const lastDate = new Date(this.state.nowYear, this.state.nowMonth, 0).getDate();
    this.state.startDay = this.calcTheStartDay();
    this.setState({
      startDate: this.calcTheStartDate(lastDate),
      showTodayButton: 0,
    }, () => {
      this.setThisMonthSchedule();
    });

    this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
  };

  // 下个月
  nextMonth = () => {
    /*  param:        explanation:
      nextDate      获取下个月的第一天日期对象
      lastDate      获取当前月的最后一天日期对象
    */
    // 根据showTodayButton监测变量判断显示今天button，并修改监测值
    if (!this.state.showTodayButton) {
      const nouMonthButton = document.getElementById('todayButton');
      nouMonthButton.style.display = '';
      this.setState({
        showTodayButton: 1,
      });
    }
    // 如果当前月为12月时，则去到下一年的1月，并修改对应当前月
    if (this.state.nowMonth === 11) {
      this.setState({
        nowYear: this.state.nowYear + 1,
        nowMonth: 0,
      }, () => {
        this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
        this.setThisMonthSchedule();
      });
    } else {
      this.setState({
        nowMonth: this.state.nowMonth + 1,
      }, () => {
        this.props.setNowYearMonth(`${this.state.nowYear}-${this.state.nowMonth + 1}`);
        this.setThisMonthSchedule();
      });
    }
    // 计算上个月的月视图的第一天
    const nextDate = new Date(this.state.nowYear, this.state.nowMonth + 1, 1);
    const lastDate = new Date(this.state.nowYear, this.state.nowMonth + 1, 0);
    this.state.nowDate = nextDate.getDate();
    this.state.nowDay = nextDate.getDay();
    this.state.startDay = this.calcTheStartDay();

    this.setState({
      startDate: this.calcTheStartDate(lastDate.getDate()),
    });
  };

  showCreateScheduleBoard(ifShow) {
    if (ifShow) {
      document.getElementById('createScheduleBoard').style.display = 'block';
    }
  }

  clickRowChange(rowkey) {
    this.setState({
      nowClickRow: rowkey,
    });
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

  moreSelectChange() {
    if (!this.state.ifRotate) {
      document.getElementById('moreSelectContent').style.display = 'block';
      this.setState({
        ifRotate: true,
      });
    } else {
      document.getElementById('moreSelectContent').style.display = 'none';
      this.setState({
        ifRotate: false,
      });
    }
  }

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

  scheduleAdd() {
    // data init and data get
    const indexNum = this.state.calendarNames.indexOf(this.state.calendarOption);
    const calendarId = this.state.calendarIds[indexNum];
    const scheduleName = document.getElementById('NewScheduleName').value;
    const isWholeDay = document.getElementById('selectAllDayType').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    // const ifShowCreator = document.getElementById('showCreator').value;
    // const ifRepeat = this.state.repeatOption;
    // const ifRemind = this.state.remindOption;
    const location = document.getElementById('location').value;
    if (calendarId === undefined) {
      // eslint-disable-next-line no-alert
      alert(messages.PleaseCreateCalendar);
      return false;
    }
    // time format is incorrect, so we need return false to interrupt this option
    if (moment(endTime).diff(moment(startTime), 'days') < 0) {
      // eslint-disable-next-line no-alert
      alert(messages.timeError);
      return false;
    }
    const requestUrl = configUrl.scheduleAdd;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId,
        scheduleName,
        isWholeDay,
        startTime,
        endTime,
        // ifShowCreator,
        // ifRepeat,
        // ifRemind,
        location,
      }),
    };
    requestApi(requestUrl, data, this.addFinishOption);
    // this is mean that this function is over
    return true;
  }

  addFinishOption(result) {
    if (result.status === 200) {
      this.scheduleQuit();
      this.setState({
        ScheduleList: [[], [], [], [], [], [], []],
        thisMonthSchedule: [[], [], [], [], []],
      });
      this.requestScheduleList();
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.ScheduleAddFailed);
    }
  }

  requestScheduleList() {
    // data init
    const requestUrl = configUrl.scheduleList;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };
    requestApi(requestUrl, data, this.setScheduleSave);
  }

  scheduleQuit() {
    this.setState({
      nowClickRow: -1,
    });
    document.getElementById('createScheduleBoard').style.display = 'none';
  }

  scheduleDetail() {
    browserHistory.push(`detailSchedule/${this.state.selectScheduleInfo[1]}`);
  }

  scheduleEdit() {
    browserHistory.push(`editSchedule/${this.state.selectScheduleInfo[1]}`);
  }

  scheduleDelete(e) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    document.getElementById('deleteScheduleRemind').style.display = 'block';
  }

  hiddenSmallScheduleBorder() {
    if (document.getElementById('ScheduleSmallBoardBorder').style.display === 'block') {
      document.getElementById('ScheduleSmallBoardBorder').style.display = 'none';
      document.getElementById('calendarMain').removeEventListener('click', this.hiddenSmallScheduleBorder, false);
    }
  }

  scheduleListItemDelete() {
    document.getElementById('ScheduleSmallBoardBorder').style.display = 'block';
    this.scheduleQuit();
    document.getElementById('calendarMain').addEventListener('click', this.hiddenSmallScheduleBorder, false);
  }

  enterDeleteSchedule() {
    const requestUrl = configUrl.scheduleDelete;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: this.state.selectScheduleInfo[1],
      }),
    };
    requestApi(requestUrl, data, this.afterScheduleDelete);
  }

  afterScheduleDelete(result) {
    if (result.status === 200) {
      document.getElementById('ScheduleSmallBoardBorder').style.display = 'none';
      document.getElementById('deleteScheduleRemind').style.display = 'none';
      this.setState({
        ScheduleList: [[], [], [], [], [], [], []],
        thisMonthSchedule: [[], [], [], [], []],
      });
      this.requestScheduleList();
    } else {
      // eslint-disable-next-line no-alert
      alert(messages.ScheduleDeleteFailed);
    }
  }

  abortScheduleRemind() {
    document.getElementById('deleteScheduleRemind').style.display = 'none';
  }

  findCalendarColor(calendarId, calendars) {
    if (calendars.length > 0) {
      for (let i = 0; i < calendars.length; i++) {
        if (calendars[i].calendarId === calendarId) {
          return calendars[i].calendarColor;
        }
      }
    }

    return false;
  }

  returnStartEndTime(startTime, endTime) {
    if (moment(startTime).diff(moment(endTime)) !== 0) {
      return `${moment(startTime).month() + messages.month + moment(startTime).date() + messages.day}-
      ${moment(endTime).month() + messages.month + moment(endTime).date() + messages.day}`;
    }
    return `${moment(startTime).month() + messages.month + moment(startTime).date() + messages.day}`;
  }

  render() {
    /*  param:        explanation:
      weekdays[]      星期数组
      itemsWeeks[]      星期div数组
      calendarDays[]    日历视图中的calendarDays组件数组
    */

    const that = this;
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    let itemsWeeks = [];
    let calendarDays = [];
    for (let i = 0; i < 7; i++) {
      itemsWeeks.push(<div key={weekdays[i]}>{weekdays[i]}</div>);
    }

    // 月视图共六行，划分为六周
    for (let i = 0; i < 6; i++) {
      calendarDays.push(<CalendarDay
        day={that.state.startDate + i * 7} key={`calendar${i}`} nowMonth={this.state.nowMonth} nowYear={this.state.nowYear} rowKey={i}
        nowClickRow={this.state.nowClickRow} clickRowChange={(rowkey) => { this.clickRowChange(rowkey); }}
        setCreateScheduleBoard={(top, left, date, rowKey) => { this.setCreateScheduleBoard(top, left, date, rowKey); }}
        showCreateScheduleBoard={(ifShow) => { this.showCreateScheduleBoard(ifShow); }}
        ScheduleList={this.state.thisMonthSchedule}
        scheduleListItemDelete={() => { this.scheduleListItemDelete(); }}
        setSelectScheduleInfo={(selectScheduleInfo) => { this.setSelectScheduleInfo(selectScheduleInfo); }}
        setDetailScheduleBoard={(top, left) => { this.setDetailScheduleBoard(top, left); }}
      />);
    }

    const calendarOptions = [];
    // const repeatOptions = [];
    // const remindOptions = [];
    const calendarNames = this.state.calendarNames;
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
    return (
      <div className={styles.CalendarViewBorder} id="CalendarView">
        <div className={styles.CalendarTitle}>
          <div className={styles.skipButton}>
            <button className={styles.leftButton} onClick={this.preMonth}><Icon type="left" /></button>
            <button className={styles.todayButton} onClick={this.nowMonth} id="todayButton">{messages.today}</button>
            <button className={styles.rightButton} onClick={this.nextMonth}><Icon type="right" /></button>
          </div>

          <div className={styles.DateYearMonth}>{that.state.nowYear}{messages.year}{that.state.nowMonth + 1}{messages.month}</div>
          <div></div>
        </div>
        <div className={styles.weekdays}>
          {itemsWeeks}
        </div>

        <div>
          {calendarDays}
        </div>
        <div className={styles.ScheduleBorder} id="createScheduleBoard">
          <div className={styles.ScheduleContent}>
            <div className={styles.ScheduleItem}>
              <textarea
                id="NewScheduleName" className={styles.NewScheduleName} placeholder="在这里输入日程内容"
                onChange={this.setTextareaHeight}
              ></textarea>
            </div>
            <div className={styles.ScheduleItem}>
              <span>{messages.calendar}</span>
              <select className={styles.calendarSelect} value={this.state.calendarOption} onChange={this.calendarOptionsChange}>{calendarOptions}</select>
            </div>
            <div className={styles.ScheduleItem}>
              <span>{messages.type}</span>
              <label className={styles.selectAllDayType}><input id="selectAllDayType" type="checkbox" />{messages.allDaySchedule}</label>
            </div>
            {/* TODO: input type 更改为datetime-local并测试 */}
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
            <div className={styles.moreSelectBorder}>
              <div className={styles.moreSelect}>
                <div className={styles.moreSelectContent} onClick={this.moreSelectChange}>
                  <img id="moreSelectImg" src={triangle} alt={triangle} className={(this.state.ifRotate) ? styles.moreSelectRotate : ''} />
                  {messages.moreSelect}
                </div>
              </div>
            </div>
            <div id="moreSelectContent">
              {/* <div className={styles.ScheduleItem}>*/}
              {/*  <label><input className={styles.showCreator} id="showCreator" type="checkbox" /><span>{messages.showCreator}</span></label>*/}
              {/* </div>*/}
              {/* <div className={styles.ScheduleItem}>*/}
              {/*  <span>{messages.repeat}</span>*/}
              {/*  <select className={styles.repeatSelect} value={this.state.repeatOption} onChange={this.repeatOptionsChange}>{repeatOptions}</select>*/}
              {/* </div>*/}
              {/* <div className={styles.ScheduleItem}>*/}
              {/*  <span>{messages.remind}</span>*/}
              {/*  <select className={styles.remindSelect} value={this.state.remindOption} onChange={this.remindOptionsChange}>{remindOptions}</select>*/}
              {/* </div>*/}
              <div className={styles.ScheduleItem}>
                <span>{messages.address}</span>
                <input className={styles.addressText} id="location" type="text" />
              </div>
            </div>
            <div className={styles.ScheduleItem}>
              <div className={styles.ScheduleBtn}>
                <button className={styles.ScheduleAdd} onClick={this.scheduleAdd}>{messages.add}</button>
                <button className={styles.ScheduleQuit} onClick={this.scheduleQuit}>{messages.quit}</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ScheduleSmallBoardBorder} id="ScheduleSmallBoardBorder">
          <div className={styles.ScheduleSmallBoard}>
            <div className={styles.ScheduleSmallBoardContent}>
              <div className={styles.ScheduleInfo}>{/* <img /> */}
                <div className={styles.ScheduleName}>{(this.state.selectScheduleInfo !== undefined) ? this.state.selectScheduleInfo[0] : ''}</div>
                <div className={styles.ScheduleDays}>
                  {(this.state.selectScheduleInfo.length !== 0) ?
                    `${this.returnStartEndTime(this.state.selectScheduleInfo[2], this.state.selectScheduleInfo[3])}` : ''}
                </div>
              </div>

            </div>
            <div className={styles.ScheduleCalendarName}></div>
            <div className={styles.ScheduleOptions}>
              <div className={styles.ScheduleDetail} onClick={this.scheduleDetail}>{messages.checkDetail}</div>
              <div>
                <div className={styles.ScheduleEdit} onClick={this.scheduleEdit}>{messages.edit}</div>
                <div className={styles.ScheduleDelete} onClick={this.scheduleDelete}>{messages.delete}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.deleteCalendarRemind} id="deleteScheduleRemind">
          <div className={styles.remindArea}>
            <div>
              <span>{messages.EnterDeleteSchedule}</span>
            </div>
            <div className={styles.remindOptions}>
              <span className={styles.remindEnter} onClick={this.enterDeleteSchedule}>{messages.enter}</span>
              <span className={styles.remindQuit} onClick={this.abortScheduleRemind}>{messages.quit}</span>
            </div>
          </div>
          <div className={styles.remindAbort} onClick={this.abortScheduleRemind}></div>
        </div>
      </div>
    );
  }
}

CalendarView.propTypes = {
  setNowYearMonth: PropTypes.func.isRequired,
  ifLogin: PropTypes.any,
};

export default CalendarView;
