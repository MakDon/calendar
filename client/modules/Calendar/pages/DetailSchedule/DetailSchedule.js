import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './DetailSchedule.css';
import messages from '../../../../../config/glossary';
import events from './events.png';
import configUrl from '../../../../../config/config';
import timeTransfer from '../../../../../config/calcTime';
import { requestApi } from '../../../../util/apiCaller';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import replyImg from './reply.png';
import deleteImg from './delete.png';
import moment from 'moment';
export class DetailSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarName: '',
      clickChange: false,
      scheduleId: this.props.params.scheduleId,
      scheduleAllInfo: '',
      setScheduleInfo: {
        scheduleName: '',
        startTime: '',
        endTime: '',
      },
      teamMember: [],
      commentsList: [],
      selectComment: '',
      ifReply: false,
      ifSelectAllPeople: false,
      informMember: [],
    };
    this.requestScheduleInfo = this.requestScheduleInfo.bind(this);
    this.setScheduleInfo = this.setScheduleInfo.bind(this);
    this.scheduleDelete = this.scheduleDelete.bind(this);
    this.enterDeleteSchedule = this.enterDeleteSchedule.bind(this);
    this.scheduleEdit = this.scheduleEdit.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.requestCommentsAdd = this.requestCommentsAdd.bind(this);
    this.requestCommentsList = this.requestCommentsList.bind(this);
    this.setCommentsList = this.setCommentsList.bind(this);
    this.requestCalendarInfo = this.requestCalendarInfo.bind(this);
    this.setCalendarName = this.setCalendarName.bind(this);
    this.setMemberInfo = this.setMemberInfo.bind(this);
    this.findCreatorName = this.findCreatorName.bind(this);
    this.afterCommentAdd = this.afterCommentAdd.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.requestCommentsDelete = this.requestCommentsDelete.bind(this);
    this.enterDeleteComment = this.enterDeleteComment.bind(this);
    this.afterCommentDelete = this.afterCommentDelete.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.showCommentInput = this.showCommentInput.bind(this);
    this.requestCommentsReply = this.requestCommentsReply.bind(this);
    this.afterCommentReply = this.afterCommentReply.bind(this);
    this.selectAllMember = this.selectAllMember.bind(this);
    this.changeSelectAllMember = this.changeSelectAllMember.bind(this);
    this.enterEditInformMember = this.enterEditInformMember.bind(this);
    this.requestScheduleEdit = this.requestScheduleEdit.bind(this);
    this.findSelectName = this.findSelectName.bind(this);
    this.afterEditSchedule = this.afterEditSchedule.bind(this);
  }

  // TODO： 发表评论时清除之前的草稿
  // TODO:  通知成员时，调用发送通知接口
  componentDidMount() {
    this.setMemberInfo();
    this.requestScheduleInfo();
    document.getElementById('deleteScheduleRemind').style.display = 'none';
    document.getElementById('commentText').style.display = 'none';
    document.getElementById('editInformMember').style.display = 'none';
    document.getElementById('deleteCommentRemind').style.display = 'none';
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
      });
    }
    this.requestCommentsList();
  }

  setScheduleInfo(result) {
    if (result.status === 200) {
      const schedule = result.schedule[0];
      const startTime = new Date(schedule.startTime);
      const endTime = new Date(schedule.endTime);
      const scheduleInfo = {
        scheduleName: schedule.scheduleName,
        startTime: `${(startTime.getMonth() + 1) + messages.month + startTime.getDate() + messages.day}`,
        endTime: `${(endTime.getMonth() + 1) + messages.month + endTime.getDate() + messages.day}`,
        informMember: schedule.members,
      };
      this.requestCalendarInfo(schedule.calendarId);
      this.setState({
        setScheduleInfo: scheduleInfo,
        scheduleAllInfo: schedule,
        informMember: scheduleInfo.informMember,
      });
      this.findSelectName(scheduleInfo.informMember);
    }
  }

  setCommentTextHeight() {
    const commentTextarea = document.getElementById('commentTextarea');
    if (commentTextarea.value === '') {
      commentTextarea.style.height = '85px';
    } else {
      commentTextarea.style.height = `${commentTextarea.scrollHeight}px`;
    }
  }

  setCommentsList(result) {
    if (result.status === 200) {
      this.setState({
        commentsList: result.comments,
      });
    }
  }

  setCalendarName(result) {
    this.setState({
      calendarName: result.calendar.name,
    });
  }

  requestCommentsList() {
    // data init
    const requestUrl = configUrl.commentsList;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: this.state.scheduleId,
      }),
    };
    requestApi(requestUrl, data, this.setCommentsList);
  }

  requestCalendarInfo(calendarId) {
    // data init
    const requestUrl = configUrl.calendarInfo;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendarId,
      }),
    };
    requestApi(requestUrl, data, this.setCalendarName);
  }

  requestScheduleInfo() {
    // data init
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

  enterDeleteSchedule() {
    const requestUrl = configUrl.scheduleDelete;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: this.state.scheduleId,
      }),
    };
    requestApi(requestUrl, data, this.afterScheduleDelete);
  }

  requestCommentsAdd(content) {
    // data init
    const requestUrl = configUrl.commentsAdd;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        scheduleId: this.state.scheduleId,
      }),
    };
    requestApi(requestUrl, data, this.afterCommentAdd);
  }

  requestCommentsReply(replyCommentId, content) {
    // data init
    const requestUrl = configUrl.commentsReply;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replyCommentId,
        content,
      }),
    };
    requestApi(requestUrl, data, this.afterCommentReply);
  }

  requestCommentsDelete() {
    // data init
    const requestUrl = configUrl.commentsDelete;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: this.state.selectComment,
      }),
    };
    requestApi(requestUrl, data, this.afterCommentDelete);
  }

  requestScheduleEdit() {
    // get data
    const scheduleAllInfo = this.state.scheduleAllInfo;
    const calendarId = scheduleAllInfo.calendarId;
    const scheduleId = scheduleAllInfo.scheduleId;
    const scheduleName = scheduleAllInfo.scheduleName;
    const startTime = scheduleAllInfo.startTime;
    const endTime = scheduleAllInfo.endTime;
    const location = (scheduleAllInfo.location === undefined) ? '' : scheduleAllInfo.location;
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
        startTime,
        endTime,
        location,
        members,
      }),
    };
    requestApi(requestUrl, data, this.afterEditSchedule);
  }

  scheduleEdit() {
    browserHistory.push(`editSchedule/${this.state.scheduleId}`);
  }

  scheduleDelete() {
    document.getElementById('deleteScheduleRemind').style.display = 'block';
  }

  afterScheduleDelete(result) {
    if (result.status === 200) {
      browserHistory.push('/');
    }
  }

  abortScheduleRemind() {
    document.getElementById('deleteScheduleRemind').style.display = 'none';
  }

  skipToIndex() {
    browserHistory.push('/');
  }

  showTextarea() {
    document.getElementById('commentInput').style.display = 'none';
    document.getElementById('commentText').style.display = 'block';
  }

  submitComment() {
    const content = document.getElementById('commentTextarea').value;
    if (content === '') {
      alert(messages.commentIsNull);
    } else {
      if (this.state.ifReply) {
        this.requestCommentsReply(this.state.selectComment, content);
      } else {
        this.requestCommentsAdd(content);
      }
    }
  }

  afterCommentAdd(result) {
    if (result.status) {
      this.showCommentInput();
      this.setState({
        commentsList: [],
      }, () => {
        this.requestCommentsList();
      });
    }
  }

  showCommentInput() {
    document.getElementById('commentInput').style.display = 'block';
    document.getElementById('commentText').style.display = 'none';
    this.setState({
      ifReply: false,
    });
  }

  printResult() {
    // console.log(result);
  }

  enterEditInformMember() {
    this.requestScheduleEdit();
    // const recordMemberList = [];
  }

  showEditInformMember() {
    document.getElementById('editInformMember').style.display = 'block';
  }

  abortEditInformMember() {
    document.getElementById('editInformMember').style.display = 'none';
  }

  findCreatorName(creatorId) {
    for (let i = 0; i < this.state.teamMember.length; i++) {
      if (creatorId === this.state.teamMember[i].id) {
        return this.state.teamMember[i].name;
      }
    }
    return false;
  }

  calcTime(dateCreated) {
    const CreatedTime = moment(dateCreated).fromNow();
    const subTime = CreatedTime.split(' ');
    if (subTime[0] === 'an' || subTime[0] === 'a') {
      subTime[0] = '1';
    }
    const timeUnit = subTime[1];
    if (timeUnit === 'few') {
      return timeTransfer[1][timeTransfer[0].indexOf(timeUnit)];
    }
    return `${subTime[0] + timeTransfer[1][timeTransfer[0].indexOf(timeUnit)]}`;
  }

  replyComment(e) {
    const replyuserId = e.target.parentNode.parentNode.getAttribute('data-id');
    const replyUserIndex = e.target.parentNode.parentNode.getAttribute('data-index');
    const replyCreatorId = e.target.parentNode.parentNode.getAttribute('data-creatorid');
    const replayUserContent = this.state.commentsList[replyUserIndex].content;
    const memberName = this.findCreatorName(replyCreatorId);
    this.showTextarea();
    document.getElementById('commentTextarea').value = `@${memberName} ${replayUserContent}: \n`;
    this.setState({
      ifReply: true,
      selectComment: replyuserId,
    });
  }
  deleteComment(e) {
    document.getElementById('deleteCommentRemind').style.display = 'block';
    this.setState({
      selectComment: e.target.parentNode.parentNode.getAttribute('data-id'),
    });
  }

  enterDeleteComment() {
    this.requestCommentsDelete();
  }

  abortCommentRemind() {
    document.getElementById('deleteCommentRemind').style.display = 'none';
  }

  afterCommentDelete() {
    document.getElementById('deleteCommentRemind').style.display = 'none';
    this.setState({
      commentsList: [],
    }, () => {
      this.requestCommentsList();
    });
  }

  afterCommentReply(result) {
    if (result.status === 200) {
      this.showCommentInput();
      this.setState({
        commentsList: [],
      }, () => {
        this.requestCommentsList();
      });
    }
  }

  selectAllMember() {
    const memberLength = this.state.teamMember.length;
    document.getElementById('selectAllMember').style.background = this.state.ifSelectAllPeople ? '#efefef' : '#44acb6';
    document.getElementById('selectAllMember').style.color = this.state.ifSelectAllPeople ? '#777' : '#fff';
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

  changeSelectAllMember() {
    const memberLength = this.state.teamMember.length;
    for (let i = 0; i < memberLength; i++) {
      if (!document.getElementsByClassName('memberCheckbox')[i].checked) {
        this.setState({
          ifSelectAllPeople: true,
        }, () => {
          document.getElementById('selectAllMember').style.background = this.state.ifSelectAllPeople ? '#efefef' : '#44acb6';
          document.getElementById('selectAllMember').style.color = this.state.ifSelectAllPeople ? '#777' : '#fff';
        });
        return;
      }
    }
    this.setState({
      ifSelectAllPeople: false,
    }, () => {
      this.selectAllMember();
    });
    return;
  }

  afterEditSchedule(result) {
    if (result.status === 200) {
      this.requestScheduleInfo();
      document.getElementById('editInformMember').style.display = 'none';
    }
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
    const commentsList = [];
    const membersList = [];
    const informMember = [];
    const teamMemberLength = this.state.teamMember.length;
    const commentsListLength = this.state.commentsList.length;
    const informMemberLength = this.state.informMember.length;
    // console.log(this.state.informMember)
    if (informMemberLength !== 0) {
      const informMembersList = this.state.teamMember;
      for (let i = 0; i < informMemberLength - 1; i++) {
        membersList.push(<div key={`member${i}`}>
          {informMembersList.map((item) => {
            if (item.id === this.state.informMember[i]) {
              return item.name;
            }
            return '';
          })}
        ,</div>);
      }
      membersList.push(<div key={`member${informMemberLength - 1}`}>
        {informMembersList.map((item) => {
          if (item.id === this.state.informMember[informMemberLength - 1]) {
            return item.name;
          }
          return '';
        })}
      </div>);
    }

    if (teamMemberLength !== 0) {
      for (let i = 0; i < teamMemberLength - 1; i++) {
        informMember.push(
          <div className={styles.calendarMember} key={`informMember${i}`} onChange={this.changeSelectAllMember}>
            <input className="memberCheckbox" type="checkbox" />
            <span>{this.state.teamMember[i].name}</span>
          </div>
        );
      }
      informMember.push(
        <div className={styles.calendarMember} key={`informMember${teamMemberLength - 1}`} onChange={this.changeSelectAllMember}>
          <input className="memberCheckbox" type="checkbox" />
          <span>{this.state.teamMember[teamMemberLength - 1].name}</span>
        </div>
      );
    }

    if (commentsListLength !== 0) {
      for (let i = 0; i < this.state.commentsList.length; i++) {
        commentsList.push(
          <div
            className={styles.commentArea}
            onMouseOver={() => {
              document.getElementById(`replyImg${i}`).style.visibility = 'visible';
              document.getElementById(`deleteImg${i}`).style.visibility = 'visible';
            }}
            onMouseOut={() => {
              document.getElementById(`replyImg${i}`).style.visibility = 'hidden';
              document.getElementById(`deleteImg${i}`).style.visibility = 'hidden';
            }}
            key={`comment${i}`}
            data-id={this.state.commentsList[i].commentId}
            data-creatorid={this.state.commentsList[i].creatorId}
            data-index={i}
          >
            <div className={styles.commentListOptions} >
              <img id={`replyImg${i}`} src={replyImg} alt={messages.reply} onClick={this.replyComment} />
              <img id={`deleteImg${i}`} src={deleteImg} alt={messages.delete} onClick={this.deleteComment} />
            </div>
            <div className={styles.commentList}>
              <div>
                <span className={styles.commentName}>{this.findCreatorName(this.state.commentsList[i].creatorId)}</span>
                <span className={styles.commentTime}>{this.calcTime(this.state.commentsList[i].dateCreated)}</span>
              </div>
              <div className={styles.commentListContent}>
                <p>{this.state.commentsList[i].content}</p>
              </div>
            </div>
          </div>
        );
      }
    }
    // console.log(commentList)
    return (
      <div className={styles.detailScheduleBorder}>
        <div className={styles.detailScheduleBackground}>
          <div onClick={this.skipToIndex}>{messages.calendar}</div>
        </div>
        <div className={styles.detailScheduleContentBorder}>
          <div className={styles.detailScheduleContent}>
            <div className={styles.detailScheduleModify}>
              <div className={styles.detailScheduleEdit} onClick={this.scheduleEdit}>{messages.edit}</div>
              <div className={styles.detailScheduleDelete} onClick={this.scheduleDelete}>{messages.delete}</div>
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
              <div className={styles.remindAbort} onClick={this.abortScheduleRemind} />
            </div>
            <div className={styles.deleteCommentRemind} id="deleteCommentRemind">
              <div className={styles.remindArea}>
                <div>
                  <span>{messages.enterDeleteReply}</span>
                </div>
                <div className={styles.remindOptions}>
                  <span className={styles.remindEnter} onClick={this.enterDeleteComment}>{messages.enter}</span>
                  <span className={styles.remindQuit} onClick={this.abortCommentRemind}>{messages.quit}</span>
                </div>
              </div>
              <div className={styles.remindAbort} onClick={this.abortCommentRemind} />
            </div>

            <div className={styles.detailScheduleTop}>
              <div className={styles.detailScheduleTitle}>
                {messages.calendar}{messages.colon}
                <span onClick={this.skipToIndex}>{this.state.calendarName}</span>
              </div>
              <div className={styles.scheduleNameAndTime}>
                <img className={styles.scheduleEvents} src={events} alt={events} />
                <div className={styles.scheduleName}>{this.state.setScheduleInfo.scheduleName}</div>
                <div className={styles.scheduleTime}>
                  {`${this.state.setScheduleInfo.startTime}-${this.state.setScheduleInfo.endTime}`}
                  {/* 日程时间 */}
                </div>
              </div>
            </div>
            <div>
            {/* 日程事项创建或者编辑 */}
            </div>
            <div className={styles.commentsArea}>
              {commentsList}
            {/* 拉取评论内容 */}
            </div>
            <div className={styles.commentAddArea}>
              <div>
                <input id="commentInput" className={styles.commentInput} type="text" placeholder={messages.clickComment} onClick={this.showTextarea} />
                <div id="commentText" className={styles.commentContent}>
                  <textarea id="commentTextarea" className={styles.commentText} onChange={this.setCommentTextHeight}></textarea>
                  <div className={styles.commentAddOptions}>
                    <button className={styles.submitComment} onClick={this.submitComment}>{messages.submitComment}</button>
                    <button className={styles.quitComment} onClick={this.showCommentInput}>{messages.quit}</button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.commentInform}>
              <div className={styles.commentInformContainer}>
                <div className={styles.commentInformPerson}>
                  <div className={styles.getInformPersonTips}>{messages.getInformPerson}{messages.colon}</div>
                  <div className={styles.getInformPeople}>
                    {membersList}
                  </div>
                </div>
                <div className={styles.commentInformOptions}>
                  <button onClick={this.showEditInformMember}>{messages.editInformMember}</button>
                </div>
              </div>
            </div>
            <div className={styles.editInformMember} id="editInformMember">
              <div className={styles.editInformArea}>
                <div>
                  <span className={styles.editInformTitle}>{messages.editInformMember}</span>
                </div>
                <div>
                  <div className={styles.selectAllPeople}><span id="selectAllMember" onClick={this.selectAllMember}>{messages.allPeople}</span></div>
                  <div className={styles.selectPeople}>
                    {informMember}
                  </div>
                </div>
                <div className={styles.editInformOptions}>
                  <span className={styles.editInformEnter} onClick={this.enterEditInformMember}>{messages.enter}</span>
                  <span className={styles.editInformQuit} onClick={this.abortEditInformMember}>{messages.quit}</span>
                </div>
              </div>
              <div className={styles.editInformMemberAbort} onClick={this.abortEditInformMember} />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

DetailSchedule.propTypes = {
  params: PropTypes.shape({
    scheduleId: PropTypes.string.isRequired,
  }).isRequired,
};

export default DetailSchedule;
