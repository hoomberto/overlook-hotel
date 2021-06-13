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

  it('should have a list reserved for hotel staff', () => {
    expect(hotel.staff).to.deep.equal([]);
  });

  it('should have a list of its rooms', () => {
    expect(hotel.rooms.length).to.equal(3);
  });

  it('should have a list of bookings', () => {
    expect(hotel.bookings.length).to.equal(3);
  });

  it('should have a calendar that is an instance of Calendar class', () => {
    expect(hotel.calendar).to.be.an.instanceof(Calendar)
  });

  it('should have a method to return a list of unique room types', () => {
    expect(hotel.uniqueRoomTypes()).to.deep.equal([
      {
        "price": 358.4,
        "type": "residential suite"
      },
      {
        "price": 477.38,
        "type": "single room"
      }
    ])
  });

  it('should have a property that holds a list of unique room types', () => {
    expect(hotel.roomTypes).to.deep.equal([
      {
        "price": 358.4,
        "type": "residential suite"
      },
      {
        "price": 477.38,
        "type": "single room"
      }
    ])
  });

  it('should correlate bookings data with users data', () => {
    hotel.correlateData();
    expect(hotel.customers[0].bookings.past.length).to.equal(2)
    expect(hotel.customers[1].bookings.past.length).to.equal(1)
  });

  it('should be able to return bookings on a specified date', () => {
    expect(hotel.bookedOnDay('2020/01/24').length).to.equal(1)
    expect(hotel.bookedOnDay('2020/04/22').length).to.equal(1)
  });

  it('should be able to return a list of available rooms for a given day', () => {
    let bookingsOnJan10 = hotel.bookedOnDay('2020/01/10')
    expect(hotel.roomsAvailableOnDay(bookingsOnJan10).length).to.equal(2)

  });

  it('should be able to return a list of booked rooms for a given day', () => {
    let bookingsOnJan10 = hotel.bookedOnDay('2020/01/10')
    expect(hotel.roomsBookedOnDay(bookingsOnJan10).length).to.equal(1)

  });

  it('should be able to return both booked and available rooms for a given day', () => {
    expect(hotel.checkAvailability('2020/01/10')).to.deep.equal({
      bookedRooms: [
        {
          number: 1,
          roomType: 'residential suite',
          bidet: true,
          bedSize: 'queen',
          numBeds: 1,
          costPerNight: 358.4
        }
      ],
      availableRooms: [
        {
          number: 2,
          roomType: 'single room',
          bidet: false,
          bedSize: 'full',
          numBeds: 2,
          costPerNight: 477.38
        },
        {
          number: 3,
          roomType: 'single room',
          bidet: false,
          bedSize: 'king',
          numBeds: 1,
          costPerNight: 491.14
        }
      ]
    });
  });

  it('should be able to filter available rooms by a specified room type', () => {
    expect(hotel.filterByType('single room', '2020/01/01').length).to.equal(2)
    expect(hotel.filterByType('residential suite', '2020/01/01').length).to.equal(1)
  });

  it('should be able add a new booking', () => {
    let newBooking = {
      "id": "asdjfkl",
      "userID": 1,
      "date": "2021/11/11",
      "roomNumber": 1,
      "roomServiceCharges": []
    }

    expect(hotel.bookings.length).to.equal(3)
    hotel.addBooking(newBooking)
    expect(hotel.bookings.length).to.equal(4)
  });

  it('should be able to add new booking to relevant user', () => {
    let newBooking = {
      "id": "jghfdsa",
      "userID": 1,
      "date": "2021/11/11",
      "roomNumber": 1,
      "roomServiceCharges": []
    }

    let newBooking2 = {
      id: "asdjfkl",
      userID: 2,
      date: hotel.calendar.currentDate,
      roomNumber: 1,
      roomServiceCharges: []
    }

    hotel.addBooking(newBooking)
    hotel.addBooking(newBooking2)
    expect(hotel.customers[0].bookings.future.length).to.equal(1)
    expect(hotel.customers[1].bookings.present.length).to.equal(1)
  });

  it('should be able to update availability when a room is booked', () => {
    let newBooking = {
      "id": "jghfdsa",
      "userID": 1,
      "date": "2021/11/11",
      "roomNumber": 1,
      "roomServiceCharges": []
    }

    let newBooking2 = {
      id: "asdjfkl",
      userID: 2,
      date: hotel.calendar.currentDate,
      roomNumber: 1,
      roomServiceCharges: []
    }

    expect(hotel.checkAvailability(hotel.calendar.currentDate).bookedRooms.length)
    .to.equal(0)
    expect(hotel.checkAvailability(hotel.calendar.currentDate).availableRooms.length)
    .to.equal(3)
    hotel.addBooking(newBooking2)
    expect(hotel.checkAvailability(hotel.calendar.currentDate).bookedRooms.length)
    .to.equal(1)
    expect(hotel.checkAvailability(hotel.calendar.currentDate).availableRooms.length)
    .to.equal(2)
  });
});
