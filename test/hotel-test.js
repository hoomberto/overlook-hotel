import chai from 'chai';
import User from '../src/User'
import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
const expect = chai.expect;

describe('Hotel', () => {
  let hotel;
  beforeEach('Setup', () => {
    let rooms = [
      {
        "number": 1,
        "roomType": "residential suite",
        "bidet": true,
        "bedSize": "queen",
        "numBeds": 1,
        "costPerNight": 358.4
      },
      {
        "number": 2,
        "roomType": "single room",
        "bidet": false,
        "bedSize": "full",
        "numBeds": 2,
        "costPerNight": 477.38
      },
      {
        "number": 3,
        "roomType": "single room",
        "bidet": false,
        "bedSize": "king",
        "numBeds": 1,
        "costPerNight": 491.14
      }
    ]

    let bookings = [
      {
        "id": "5fwrgu4i7k55hl6sz",
        "userID": 1,
        "date": "2020/04/22",
        "roomNumber": 3,
        "roomServiceCharges": []
      },
      {
        "id": "5fwrgu4i7k55hl6t5",
        "userID": 1,
        "date": "2020/01/24",
        "roomNumber": 2,
        "roomServiceCharges": []
      },
      {
        "id": "5fwrgu4i7k55hl6t6",
        "userID": 2,
        "date": "2020/01/10",
        "roomNumber": 1,
        "roomServiceCharges": []
      }
    ]

    let userData = {
      id: 1,
      name: 'Nerdo',
    }

    let userData2 = {
      id: 2,
      name: 'Nerdette',
    }

    let user = new User(userData)
    let user2 = new User(userData2)
    let users = [user, user2]
    let calendar = new Calendar();
    hotel = new Hotel(users, rooms, bookings, calendar)

  })
  it('should be a function', () => {
    expect(Hotel).to.be.a('function');
  });

  it('should be an instance of Hotel', () => {
    expect(hotel).to.be.an.instanceof(Hotel);
  });

  it('should hold a list of customers', () => {
    expect(hotel.customers.length).to.equal(2);
  });

  // it('should check if an input date is a past date relative to the current date', () => {
  //   expect(calendar.checkIfPastBooking("2020/01/01")).to.be.true;
  //   expect(calendar.checkIfPastBooking("2022/01/01")).to.be.true;
  // });
  //
  //

});
