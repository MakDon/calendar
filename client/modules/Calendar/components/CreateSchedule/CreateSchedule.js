import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './CreateSchedule.css';
import messages from '../../../../../config/glossary';
import PropTypes from 'prop-types';

export class CreateSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const test = document.getElementById('createNewSchedule');
    this.props.setCreateScheduleBoardPosition(test.offsetParent.offsetTop + test.offsetTop - 20, test.offsetLeft, this.props.date);
  }

  render() {
    return (
      <div id="createNewSchedule">
        <div className={styles.SchedulePlaceholder}><p>{messages.newSchedulePlan}</p></div>
      </div>
    );
  }
}

CreateSchedule.propTypes = {
  setCreateScheduleBoardPosition: PropTypes.func.isRequired,
  date: PropTypes.any,
};
export default CreateSchedule;
