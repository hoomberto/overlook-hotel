import chai from 'chai';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
dayjs.extend(dayOfYear)
// import User from '../src/User'
// import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
const expect = chai.expect;

describe('Calendar', () => {
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

  it('should check if an input date is a past date relative to the current date', () => {
    expect(calendar.checkIfPastBooking("2020/01/01")).to.be.true;
    expect(calendar.checkIfPastBooking("2022/01/01")).to.be.true;
  });



});
