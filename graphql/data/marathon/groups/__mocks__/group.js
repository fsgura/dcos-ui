import clone from 'clone';

export default class GroupsMockTestConnector {
  constructor(response) {
    // Pass in the resolvable response for testing
    this.mockResponse = response;
  }

  get() {
    return Promise.resolve(clone(this.mockResponse));
  }
}