
export function getTeammateIds(teamId, callback) {
  if (process.env.NODE_ENV !== 'production') {
    const error = '';
    const teammates = [
      { id: 'ThisIsATestingUserId', name: 'Barbera' },
      { id: 'FakeTeammateId1', name: 'Jerry' },
      { id: 'FakeTeammateId2', name: 'Tom' },
      { id: 'FakeTeammateId3', name: 'Spike' },
      { id: 'FakeTeammateId4', name: 'Tyke' }];
    callback(error, teammates);
  } else {
    // implement your own adaptor here
    // callback arguments: teammates, err
    // WARNING: teammates should include the user himself / herself
    const error = '';
    const teammates = [
      { id: 'ThisIsATestingUserId', name: 'Barbera' },
      { id: 'FakeTeammateId1', name: 'Jerry' },
      { id: 'FakeTeammateId2', name: 'Tom' },
      { id: 'FakeTeammateId3', name: 'Spike' },
      { id: 'FakeTeammateId4', name: 'Tyke' }];
    callback(error, teammates);
    console.log('WARNING: team adaptor is not implement yet'); // eslint-disable-line no-console
  }
}
