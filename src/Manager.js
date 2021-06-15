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

  getBookingsOnDate(date) {
    return this.hotel.checkAvailability(date).bookedRooms;
  }

  occupiedPercentageOnDate(date) {
    let checkedOnDate = this.hotel.checkAvailability(date)
    let available = checkedOnDate.availableRooms.length
    let booked = checkedOnDate.bookedRooms.length
    let occupied = (booked * 100) / (available + booked)
    return `${occupied}%`;
  }

  deleteBooking(bookingID) {
    let foundBooking = this.hotel.bookings.find(booking => booking.id === bookingID)
    this.hotel.bookings.splice(foundBooking, 1);
    return this.hotel.bookings;
  }

  searchForUser(search) {
    return this.customers
    .find(customer => customer.name.includes(search.toLowerCase()) ||
    customer.name.toLowerCase().split(' ')
    .some(word => search.includes(word)));
  }

  viewUserInfo(foundUser) {
    foundUser.setRoomData(this.hotel);
    return foundUser.getTotalSpent();
  }

//   I should be able to search for any user by name and:
// View their name, a list of all of their bookings, and the total amount they’ve spent
// Add a room booking for that user
// Delete any upcoming room bookings for that user (they cannot delete a booking from the past)
}

export default Manager;
