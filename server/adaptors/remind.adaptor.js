
export function remind(target, scheduleId, source, callback) {
  if (process.env.NODE_ENV !== 'production') {
    const error = '';
    // eslint-disable-next-line no-console
    console.log('----remind------');
    // eslint-disable-next-line no-console
    console.log({
      target,
      scheduleId,
      source,
    });
    // eslint-disable-next-line no-console
    console.log('----remind------');
    callback(error);
  } else {
    // implement your own adaptor here
  }
}
