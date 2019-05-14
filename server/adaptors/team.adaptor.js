import { getTeammateIdsIHCI } from './IHCI.adaptor';

export function getTeammateIds(teamId, callback) {
  if (process.env.NODE_ENV === 'development') {
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
    getTeammateIdsIHCI(teamId, callback);
  }
}
