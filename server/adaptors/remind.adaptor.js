import { remindIHCI } from './IHCI.adaptor';

export function remind(target, scheduleId, source, callback) {
  if (process.env.NODE_ENV === 'development') {
    const error = '';
    console.log('----remind------');
    console.log({
      target,
      scheduleId,
      source,
    });
    callback(error);
  } else {
    // implement your own adaptor here
    remindIHCI(target, scheduleId, source, callback);
  }
}
