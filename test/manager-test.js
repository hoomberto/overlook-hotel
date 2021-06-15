import chai from 'chai';
import User from '../src/User'
import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
import Manager from '../src/Manager'
const expect = chai.expect;

describe('Manager', () => {
  let manager;

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
        "date": "2020/01/22",
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
    let hotel = new Hotel(users, rooms, bookings, calendar)
    manager = new Manager(hotel);
  })

  it('should be a function', () => {
    expect(Manager).to.be.a('function');
  });

  it('should be an instance of Hotel', () => {
    expect(manager).to.be.an.instanceof(Manager);
  });

  it('should calculate the revenue for a given date', () => {
    let newBooking = {
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 1,
      "date": "2020/01/24",
      "roomNumber": 3,
      "roomServiceCharges": []
    }
    manager.hotel.bookings.push(newBooking)
    expect(manager.getTotalRevenueOnDay("2020/01/24")).to.equal('$968.52');
  });


});
