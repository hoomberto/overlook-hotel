import chai from 'chai';
import User from '../src/User'
import Hotel from '../src/Hotel'
import Calendar from '../src/Calendar'
const expect = chai.expect;

describe('User', () => {
  let user, user2, hotel, calendar;
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

    user = new User(userData)
    user2 = new User(userData2)
    calendar = new Calendar();
    let users = [user, user2];

    hotel = new Hotel(users, rooms, bookings, calendar)
    hotel.correlateData();

  })
  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should be an instance of User', () => {
    expect(user).to.be.an.instanceof(User);
  });

  it('should have an ID', () => {
    expect(user.id).to.equal(1);
  });

  it('should have a name', () => {
    expect(user.name).to.equal('Nerdo');
  });

  it('should be able to set correlated data from the hotel', () => {
    user.setRoomData(hotel)
    user2.setRoomData(hotel)
    expect(user.bookings.length).to.equal(2)
    expect(user2.bookings.length).to.equal(1);
  });
});
