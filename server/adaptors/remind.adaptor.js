import { remindIHCI } from 'IHCI.adaptor';
export function remind(target, schedule, source, callback) {
  if (process.env.NODE_ENV !== 'production') {
    const error = '';
    // eslint-disable-next-line no-console
    console.log('----remind------');
    // eslint-disable-next-line no-console
    console.log({
      target,
      schedule,
      source,
    });
    // eslint-disable-next-line no-console
    console.log('----remind------');
    callback(error);
  } else {
    remindIHCI(target, scheduleId, source, callback);
  }
}
