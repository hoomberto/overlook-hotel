import chai from 'chai';
// import User from '../src/User'
// import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
const expect = chai.expect;

describe('User', () => {
  let calendar;
  beforeEach('Setup', () => {
    calendar = new Calendar();
  })
  it('should be a function', () => {
    expect(Calendar).to.be.a('function');
  });

  it('should be an instance of User', () => {
    expect(calendar).to.be.an.instanceof(Calendar);
  });


});
