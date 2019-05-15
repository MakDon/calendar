import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CalendarDay.css';
// import Schedule from '../../pages/Schedule/Schedule';
import CreateSchedule from '../CreateSchedule/CreateSchedule';
// import configUrl from '../../../../../config/config';
// import messages from '../../../../../config/glossary';
// import { requestApi } from '../../../../util/apiCaller';
import moment from 'moment';

export class CalendarDay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      NewSchedule: [],
      clickRow: -1,
      clickCol: -1,
      dayScheduleList: [],
      ScheduleList: [[], [], [], [], []],
      showScheduleList: [[]],
      separateNodeNum: [],
      separateScheduleList: [],
      dayScheduleNum: [],
    };
    this.createNewSchedule = this.createNewSchedule.bind(this);
    this.showScheduleList = this.showScheduleList.bind(this);
    this.showDetailSmallBoard = this.showDetailSmallBoard.bind(this);
    this.setSchedule = this.setSchedule.bind(this);
    this.setCreateScheduleBoardPosition = this.setCreateScheduleBoardPosition.bind(this);
    this.separateSchedule = this.separateSchedule.bind(this);
    this.calcDayScheduleNum = this.calcDayScheduleNum.bind(this);
  }

  componentDidMount() {
    this.setSchedule();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.ScheduleList !== nextProps.ScheduleList && nextProps.ScheduleList !== undefined && nextProps.ScheduleList[0][0] !== undefined) {
      this.setState({
        ScheduleList: nextProps.ScheduleList,
        separateNodeNum: [],
        separateScheduleList: [],
        dayScheduleNum: [],
      }, () => {
        this.showScheduleList();
        this.separateSchedule();
      });
    } else if (nextProps.ScheduleList !== undefined && nextProps.ScheduleList[0][0] === undefined) {
      this.setState({
        ScheduleList: [[], [], [], [], []],
        showScheduleList: [[]],
        separateNodeNum: [],
        separateScheduleList: [],
        dayScheduleNum: [],
      });
    }
  }

  setSchedule() {
    if (this.state.ScheduleList !== undefined && this.state.ScheduleList[0][0] !== undefined) {
      this.setState({
        ScheduleList: this.props.ScheduleList,
      }, () => {
        this.showScheduleList();
        this.separateSchedule();
      });
    }
  }

  // set create schedule board's location by top and left
  setCreateScheduleBoardPosition(top, left, days) {
    if (this.state.clickRow !== -1) {
      this.props.showCreateScheduleBoard(true);
      this.props.setCreateScheduleBoard(top, left + 100, days, this.props.rowKey);
    }
  }

  // separate schedule by start time and end time
  separateSchedule() {
    // TODO: 九月1日显示问题
    let startNode = 0;
    let endNode = 0;
    const separateScheduleList = [];
    if (this.props.rowKey === 0) {
      startNode = 1;
      endNode = this.state.separateNodeNum[0];
    } else if (this.props.rowKey < 4) {
      startNode = this.state.separateNodeNum[0] - 6;
      endNode = this.state.separateNodeNum[0];
    } else {
      if (this.props.rowKey === 4) {
        // eslint-disable-next-line quote-props
        const endThisMonth = moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': 1 }).endOf('month');
        if (this.state.separateNodeNum[0] > 7) {
          startNode = this.state.separateNodeNum[0] - 6;
          endNode = this.state.separateNodeNum[0];
        } else {
          startNode = endThisMonth.date() + this.state.separateNodeNum[0] - 6;
          endNode = endThisMonth.date();
        }
      }
      if (this.props.rowKey === 5) {
        // eslint-disable-next-line quote-props
        const endThisMonth = moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': 1 }).endOf('month');
        if (this.state.separateNodeNum[0] < 7) {
          startNode = endThisMonth.date() + this.state.separateNodeNum[0] - 6;
          endNode = endThisMonth.date();
        } else {
          startNode = -1;
          endNode = -1;
        }
      }
    }
    if (this.state.ScheduleList !== undefined && this.state.ScheduleList[0][0] !== undefined && this.state.separateNodeNum.length !== 0 && startNode !== -1) {
      for (let i = 0; i < this.state.ScheduleList[0].length; i++) {
        const startTimeLeft = moment(this.state.ScheduleList[2][i]).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day'), 'days');
        const startTimeRight = moment(this.state.ScheduleList[2][i]).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': endNode }).startOf('day'), 'days');
        const endTimeLeft = moment(this.state.ScheduleList[3][i]).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day'), 'days');
        const endTimeRight = moment(this.state.ScheduleList[3][i]).diff(
          // eslint-disable-next-line quote-props
          moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': endNode }).startOf('day'), 'days');
        if (startTimeLeft >= 0 && startTimeRight <= 0) {
          if (endTimeLeft >= 0 && endTimeRight <= 0) {
            separateScheduleList.push({
              name: this.state.ScheduleList[0][i],
              id: this.state.ScheduleList[1][i],
              startTime: this.state.ScheduleList[2][i],
              calendarColor: this.state.ScheduleList[4][i],
              endTime: this.state.ScheduleList[3][i],
              // eslint-disable-next-line quote-props
              startTimeLeft: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                .format(),
            });
          } else {
            separateScheduleList.push({
              name: this.state.ScheduleList[0][i],
              id: this.state.ScheduleList[1][i],
              calendarColor: this.state.ScheduleList[4][i],
              startTime: this.state.ScheduleList[2][i],
              // eslint-disable-next-line quote-props
              endTime: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': endNode }).startOf('day')
                .format(),
              // eslint-disable-next-line quote-props
              startTimeLeft: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                .format(),
            });
          }
        } else {
          if (startTimeLeft < 0 && startTimeRight < 0) {
            if (endTimeLeft >= 0 && endTimeRight <= 0) {
              separateScheduleList.push({
                name: this.state.ScheduleList[0][i],
                id: this.state.ScheduleList[1][i],
                calendarColor: this.state.ScheduleList[4][i],
                // eslint-disable-next-line quote-props
                startTime: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                  .format(),
                endTime: this.state.ScheduleList[3][i],
                // eslint-disable-next-line quote-props
                startTimeLeft: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                  .format(),
              });
            }
            if (endTimeLeft > 0 && endTimeRight > 0) {
              separateScheduleList.push({
                name: this.state.ScheduleList[0][i],
                id: this.state.ScheduleList[1][i],
                calendarColor: this.state.ScheduleList[4][i],
                // eslint-disable-next-line quote-props
                startTime: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                  .format(),
                // eslint-disable-next-line quote-props
                endTime: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': endNode }).startOf('day')
                  .format(),
                // eslint-disable-next-line quote-props
                startTimeLeft: moment().set({ 'year': this.props.nowYear, 'month': this.props.nowMonth, 'date': startNode }).startOf('day')
                  .format(),
              });
            }
          }
        }
      }
    }
    // console.log(separateScheduleList)
    this.setState({
      separateScheduleList,
    });
  }

  showDetailSmallBoard(e) {
    let schedule = e.target;
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    if (e.target.nodeName === 'SPAN') {
      schedule = e.target.parentElement;
    }
    this.props.scheduleListItemDelete();
    this.props.setSelectScheduleInfo([
      schedule.getAttribute('data-name'),
      schedule.getAttribute('data-id'),
      schedule.getAttribute('data-start'),
      schedule.getAttribute('data-end'),
    ]);
    // 获取日历名称长度
    const textLength = schedule.getAttribute('data-name').length;
    const top = schedule.offsetParent.offsetParent.offsetTop + schedule.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop;
    const left = schedule.offsetParent.offsetParent.offsetLeft + schedule.children[0].offsetLeft + textLength * 12 + 20;
    this.props.setDetailScheduleBoard(top, left);
  }

  showScheduleList() {
    const nowDate = new Date(this.props.nowYear, this.props.nowMonth + 1, 0).getDate();
    for (let i = 1; i <= nowDate; i++) {
      this.state.showScheduleList[i] = [];
    }
    if (this.state.ScheduleList !== undefined && this.state.ScheduleList[0][0] !== undefined) {
      for (let i = 1; i <= nowDate; i++) {
        for (let j = 0; j < this.state.dayScheduleNum[i]; j++) {
          this.state.showScheduleList[i].push(<div className={styles.daySchedulePosition} key={`schedule${i}num${j}`}></div>);
        }
      }
    }
  }

  createNewSchedule(rowNum, colNum, date) {
    if (date !== 0) {
      this.props.clickRowChange(rowNum);
      this.setState({
        clickRow: rowNum,
        clickCol: colNum,
        NewSchedule: [<CreateSchedule
          key={`createSchedule${rowNum * 7 + colNum}`}
          date={date}
          setCreateScheduleBoardPosition={(top, left, days) => { this.setCreateScheduleBoardPosition(top, left, days); }}
        />] });
    }
  }

  calcDayScheduleNum(startDate, dayDiff) {
    let max = this.state.dayScheduleNum[startDate];
    for (let i = 0; i < dayDiff; i++) {
      if (max < this.state.dayScheduleNum[startDate + i]) {
        max = this.state.dayScheduleNum[startDate + i];
      }
    }
    for (let i = 0; i < dayDiff; i++) {
      this.state.dayScheduleNum[startDate + i] = max + 1;
    }
    return max;
  }

  render() {
    /*  param:          explanation:
      nowDate         获取当前月的天数
      lastDate        获取当前月的上个月天数
      itemsDays         当前月的一周
      nowMonthCount       本月计数器
      nextMonthCount      下个月的计数
      this.props.rowKey     从组件中获取的rowKey值->第几周
      this.props.day      从组件获取一周开头的第一天
    */

    const nowDate = new Date(this.props.nowYear, this.props.nowMonth + 1, 0).getDate();
    const lastDate = new Date(this.props.nowYear, this.props.nowMonth, 0).getDate();
    let itemsDays = [];
    let itemWeeks = [];
    let nowMonthCount = 1;
    if (this.state.separateScheduleList.length !== 0) {
      for (let i = 1; i <= nowDate; i++) {
        this.state.dayScheduleNum[i] = 0;
      }
      for (let i = 0; i < this.state.separateScheduleList.length; i++) {
        const dayDiff = moment(this.state.separateScheduleList[i].endTime).diff(moment(this.state.separateScheduleList[i].startTime), 'days') + 1;
        let LeftDiff = moment(this.state.separateScheduleList[i].startTime).diff(moment(this.state.separateScheduleList[i].startTimeLeft), 'days');
        if (this.props.rowKey === 0) {
          LeftDiff = moment(this.state.separateScheduleList[i].startTimeLeft).day() - 1 + LeftDiff;
        }
        // console.log(this.state.separateScheduleList[i])
        itemWeeks.push(
          <div
            className={styles.weekScheduleItem} key={`weekScheduleItem${this.props.day + i}`}
            style={{ width: `calc(${dayDiff}/7*100%)`, left: `calc(${LeftDiff}/7*100%)`,
              top: `${this.calcDayScheduleNum(moment(this.state.separateScheduleList[i].startTime).date(), dayDiff) * 28}px` }}
          >
            <div className={styles.dayScheduleBorder} onClick={this.showDetailSmallBoard}>
              <div className={`${styles.dayScheduleContent} ${styles[`backgroundColor_${this.state.separateScheduleList[i].calendarColor}`]}`}>
                <div
                  className={styles.dayScheduleName} data-id={this.state.separateScheduleList[i].id}
                  data-start={this.state.separateScheduleList[i].startTime} data-end={this.state.separateScheduleList[i].endTime}
                  data-name={this.state.separateScheduleList[i].name}
                >
                  <span className={styles.creatorImg}>
                    {this.state.separateScheduleList[i].name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      this.showScheduleList();
    } else {
      itemWeeks = [];
    }

    // 月视图第一周
    if (this.props.rowKey === 0) {
      for (let i = 0; i < 7; i++) {
        if (this.props.day === 1) {
          // 当月视图的第一天是当前月的第一天时
          itemsDays.push(
            <div className={styles.Day} key={`day${this.props.day + i}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, this.props.day + i); }}>
              <div className={styles.Dayinfo}>
                <span>{this.props.day + i}</span>
              </div>
              <div className="daySchedule">
                {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i] : ''}
              </div>
              <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
            </div>
          );
        } else {
          if (this.props.day + i <= lastDate) {
            // 当月视图第一周第i天的日期不大于上个月最后一天时
            itemsDays.push(
              <div className={styles.Day} key={`day${this.props.day + i}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, 0); }}>
                <div className={styles.Dayinfo}>
                  <span className={styles.otherMonth}>{this.props.day + i}</span>
                </div>
                <div className="daySchedule">
                  {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i] : ''}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
          } else {
            // 当月视图第一周第i天的日期大于上个月最后一天时，重置时间为1号
            itemsDays.push(
              <div className={styles.Day} key={`day${nowMonthCount}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, i); }}>
                <div className={styles.Dayinfo}>
                  <span>{nowMonthCount}</span>
                </div>
                <div className="daySchedule">
                  {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[nowMonthCount] : ''}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
            nowMonthCount++;
          }
        }
        if (i === 6) {
          if (this.props.day === 1) {
            this.state.separateNodeNum.push(this.props.day + i);
          } else if (this.props.day + i <= lastDate) {
            this.state.separateNodeNum.push(this.props.day + i);
          } else {
            this.state.separateNodeNum.push(nowMonthCount - 1);
          }
        }
      }
    } else {
      if (this.props.rowKey < 4) {
      // 月视图前四周未发生日期变更，即当前月天数已增至当前月总天数
        for (let i = 0; i < 7; i++) {
          if (this.props.day + i > lastDate) {
            itemsDays.push(
              <div
                className={styles.Day} key={`day${this.props.day + i - lastDate}`}
                onClick={() => { this.createNewSchedule(this.props.rowKey, i, this.props.day + i - lastDate); }}
              >
                <div className={styles.Dayinfo}>
                  <span>{this.props.day + i - lastDate}</span>
                </div>
                <div className="daySchedule">
                  {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i - lastDate] : ''}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
          } else {
            itemsDays.push(
              <div className={styles.Day} key={`day${this.props.day + i}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, this.props.day + i); }}>
                <div className={styles.Dayinfo}>
                  <span>{this.props.day + i}</span>
                </div>
                <div className="daySchedule">
                  {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i] : ''}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
          }
          if (i === 6) {
            if (this.props.day + i > lastDate) {
              this.state.separateNodeNum.push(this.props.day + i - lastDate);
            } else {
              this.state.separateNodeNum.push(this.props.day + i);
            }
          }
        }
      } else {
        // 月视图第五六周
        for (let i = 0; i < 7; i++) {
          // console.log(this.props.day)
          if (this.props.day + i > nowDate + lastDate) {
            itemsDays.push(
              <div className={styles.Day} key={`day${this.props.day + i - lastDate - nowDate}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, 0); }}>
                <div className={styles.Dayinfo}>
                  <span className={styles.otherMonth}>{this.props.day + i - lastDate - nowDate}</span>
                </div>
                <div className="daySchedule">
                  {/* {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i - lastDate - nowDate] : ''}*/}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
          } else if (this.props.day + i > nowDate) {
            // console.log(this.props.day)
            if (this.props.day < 21 + lastDate) {
              itemsDays.push(
                <div className={styles.Day} key={`day${this.props.day + i - nowDate}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, 0); }}>
                  <div className={styles.Dayinfo}>
                    <span className={styles.otherMonth}>{this.props.day + i - nowDate}</span>
                  </div>
                  <div className="daySchedule">
                     {/*  下个月日程的显示 {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i - nowDate] : ''}*/}
                  </div>
                  <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
                </div>
              );
            } else {
              itemsDays.push(
                <div
                  className={styles.Day} key={`day${this.props.day + i - lastDate}`}
                  onClick={() => { this.createNewSchedule(this.props.rowKey, i, this.props.day + i - lastDate); }}
                >
                  <div className={styles.Dayinfo}>
                    <span>{this.props.day + i - lastDate}</span>
                  </div>
                  <div className="daySchedule">
                     {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i - lastDate] : ''}
                  </div>
                  <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
                </div>
              );
            }
          } else {
            itemsDays.push(
              <div className={styles.Day} key={`day${this.props.day + i}`} onClick={() => { this.createNewSchedule(this.props.rowKey, i, this.props.day + i); }}>
                <div className={styles.Dayinfo}>
                  <span>{this.props.day + i}</span>
                </div>
                <div className="daySchedule">
                   {(this.state.showScheduleList !== undefined) ? this.state.showScheduleList[this.props.day + i] : ''}
                </div>
                <div className="NewSchedule">{((this.state.clickRow === this.props.nowClickRow) && (this.state.clickCol === i)) ? this.state.NewSchedule : ''}</div>
              </div>
            );
          }
          if (i === 6) {
            if (this.props.day + i > nowDate + lastDate) {
              this.state.separateNodeNum.push(this.props.day + i - lastDate - nowDate);
            } else if (this.props.day + i > nowDate) {
              if (this.props.day < 21 + lastDate) {
                this.state.separateNodeNum.push(this.props.day + i - nowDate);
              } else {
                this.state.separateNodeNum.push(this.props.day + i - lastDate);
              }
            } else {
              this.state.separateNodeNum.push(this.props.day + i);
            }
          }
        }
      }
    }
    return (
      <div className={styles.WeekStyle}>
        <div className={styles.Days}>
          {itemsDays}
        </div>
        <div className={styles.weekScheduleList}>
           {itemWeeks}
        </div>
      </div>
    );
  }
}

CalendarDay.propTypes = {
  nowYear: PropTypes.number.isRequired,
  nowMonth: PropTypes.number.isRequired,
  rowKey: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
  nowClickRow: PropTypes.number.isRequired,
  clickRowChange: PropTypes.func.isRequired,
  setCreateScheduleBoard: PropTypes.func.isRequired,
  showCreateScheduleBoard: PropTypes.func.isRequired,
  ScheduleList: PropTypes.any,
  scheduleListItemDelete: PropTypes.func.isRequired,
  setSelectScheduleInfo: PropTypes.func.isRequired,
  setDetailScheduleBoard: PropTypes.func.isRequired,
};

export default CalendarDay;
