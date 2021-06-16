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
        "id": "one",
        "userID": 1,
        "date": "2052/01/22",
        "roomNumber": 3,
        "roomServiceCharges": []
      },
      {
        "id": "two",
        "userID": 1,
        "date": "2020/01/24",
        "roomNumber": 2,
        "roomServiceCharges": []
      },
      {
        "id": "three",
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
    manager.hotel.correlateData();
  })

  it('should be a function', () => {
    expect(Manager).to.be.a('function');
  });

  it('should be an instance of Manager', () => {
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

  it('should return a list of bookings on a specified date', () => {
    let newBooking = {
      "id": "5fwrgu4i7k55hl6sz",
      "userID": 1,
      "date": "2020/01/24",
      "roomNumber": 3,
      "roomServiceCharges": []
    }
    manager.hotel.bookings.push(newBooking)
    expect(manager.getBookingsOnDate("2020/01/24").length).to.equal(2);
  });

  it('should return the percentage of occupied rooms on a specified date', () => {
    expect(manager.occupiedPercentageOnDate("2020/01/24")).to.equal("33%");
  });

  it('should be able to search for a user by name', () => {
    expect(manager.searchForUser("nerdo")).to.deep.equal({
      id: 1,
      name: 'Nerdo',
      bookings: { past: [
        {
          id: 'two',
          userID: 1,
          date: '2020/01/24',
          roomNumber: 2,
          roomServiceCharges: [],
          roomType: 'single room',
          cost: 477.38
        }
      ],
      present: [],
      future: [{
        id: 'one',
        userID: 1,
        date: '2052/01/22',
        roomNumber: 3,
        roomServiceCharges: [],
        roomType: 'single room',
        cost: 491.14
      }
      ]
      },
      roomPreference: 'single room',
      spent: '968.52'
    });
  });

  it('should be able to remove a booking if it is not a past booking', () => {
    expect(manager.hotel.bookings.length).to.equal(3);
    manager.deleteBooking("two")
    expect(manager.hotel.bookings.length).to.equal(3)
    manager.deleteBooking("one")
    expect(manager.hotel.bookings.length).to.equal(2)
  });

  it('should be able add a booking for a found user', () => {
    let found = manager.searchForUser("nerdo")
    let newBooking = {
      "id": "four",
      "userID": 1,
      "date": "2023/01/01",
      "roomNumber": 3,
      "roomServiceCharges": []
    }

    expect(manager.hotel.bookings.length).to.equal(3)
    expect(found.bookings.future.length).to.equal(1)

    manager.addBookingForUser(found, newBooking)
    found = manager.searchForUser("nerdo")
    expect(manager.hotel.bookings.length).to.equal(4)
    expect(found.bookings.future.length).to.equal(2)
  });

});
