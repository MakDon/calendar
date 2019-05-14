import React, { Component } from 'react';
import styles from './Schedule.css';
import messages from '../../../../../config/glossary';

export class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div className={styles.ScheduleName}><p>{messages.newSchedulePlan}</p></div>
      </div>
    );
  }
}

export default Schedule;
