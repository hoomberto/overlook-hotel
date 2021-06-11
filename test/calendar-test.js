import chai from 'chai';
import dayjs from 'dayjs';
// import User from '../src/User'
// import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
const expect = chai.expect;

describe('User', () => {
  let calendar, currentDate;
  beforeEach('Setup', () => {
    calendar = new Calendar();
    currentDate = dayjs().format('YYYY/MM/DD');
  })
  it('should be a function', () => {
    expect(Calendar).to.be.a('function');
  });

  it('should be an instance of User', () => {
    expect(calendar).to.be.an.instanceof(Calendar);
  });

  it('should hold the current date', () => {
    expect(calendar.currentDate).to.equal(currentDate);
  });



});
