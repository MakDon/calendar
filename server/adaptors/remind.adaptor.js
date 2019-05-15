
export function remind(target, scheduleId, source, callback) {
  if (process.env.NODE_ENV !== 'production') {
    const error = '';
    console.log('----remind------');
    console.log({
      target,
      scheduleId,
      source,
    });
    console.log('----remind------');
    callback(error);
  } else {
    // implement your own adaptor here
  }
}
