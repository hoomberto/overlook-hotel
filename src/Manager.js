class Manager {
  constructor(hotelData) {
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
    this.customers
    .filter(customer => customer.name.includes(search.toLowerCase()) ||
    customer.name.toLowerCase().split(' ')
    .some(word => search.includes(word)));
  }
}
