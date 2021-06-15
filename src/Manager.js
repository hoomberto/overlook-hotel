import User from '../src/User'

class Manager extends User {
  constructor(hotelData) {
    super(hotelData)
    this.hotel = hotelData
  }

  getTotalRevenueOnDay(date) {
    let revenue = 0;
    let filtered = this.hotel.bookings.filter(booking => booking.date === date)
    filtered.forEach(booking => {
      let correlatedRoom = this.hotel.rooms.find(room => room.number === booking.roomNumber)
      revenue += correlatedRoom.costPerNight
    })
    return `$${revenue.toFixed(2)}`;
  }

  // getTotalRevenueToday() {
  //   let revenue = 0;
  //   // let filtered = this.hotel.bookings.filter(booking => booking.date === this.hotel.calendar.currentDate)
  //   this.hotel.availableToday.bookedRooms.forEach(booking => {
  //     let correlatedRoom = this.hotel.rooms.find(room => room.number === booking.roomNumber)
  //     revenue += correlatedRoom.costPerNight
  //   })
  //   return `$${revenue.toFixed(2)}`;
  // }

  getBookingsOnDate(date) {
    return this.hotel.checkAvailability(date).bookedRooms;
  }

  setCurrentBookings() {
    this.hotel.availableToday.bookedRooms.forEach(bookedRoom => {
      let found = this.hotel.customers.find(customer => customer.bookings.present.some(booking => bookedRoom.number === booking.roomNumber))
      let data = found.bookings.present.find(booking => bookedRoom.number === booking.roomNumber)
      console.log(found)
      bookedRoom.bookedBy = found.name;
      bookedRoom.customerID = found.id;
      bookedRoom.bookingID = data.id;
    });
    // return this.hotel.availableToday.bookedRooms;
  }

  occupiedPercentageOnDate(date) {
    let checkedOnDate = this.hotel.checkAvailability(date)
    let available = checkedOnDate.availableRooms.length
    let booked = checkedOnDate.bookedRooms.length
    let occupied = (booked * 100) / (available + booked)
    return `${Math.floor(occupied)}%`;
  }

  addBookingForUser(foundUser, newBooking) {
    this.hotel.addBooking(newBooking)
    foundUser.setRoomData(this.hotel)
  }

  deleteBooking(bookingID) {
    let found = this.hotel.bookings.find(booking => booking.id === bookingID);
    let isPastBooking = this.hotel.calendar.checkIfPastBooking(found.date);
    if (isPastBooking) {
      return
    }
    else {
      let updated = this.hotel.bookings.filter(booking => booking.id !== bookingID)
      this.hotel.bookings = updated
    }
  }

  searchForUser(search) {
    let foundUser = this.hotel.customers.find(customer => customer.name.toLowerCase()
    .includes(search.toLowerCase()) ||
    customer.name.toLowerCase().split(' ')
    .some(word => search.includes(word)));
    this.retrieveUserInfo(foundUser)
    return foundUser
  }

  retrieveUserInfo(foundUser) {
    foundUser.setRoomData(this.hotel);
  }
}

export default Manager;