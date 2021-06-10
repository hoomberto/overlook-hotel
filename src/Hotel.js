class Hotel {
  constructor(customersData, roomsData, bookingsData, calendar) {
    this.customers = customersData;
    this.staff = [];
    this.rooms = roomsData;
    this.allBookings = bookingsData;
    this.calendar = calendar;
    this.roomTypes = this.uniqueRoomTypes();
  }

  checkAvailability() {
    // Go through calendar, check if any dates
    // Correspond to dates held in bookings
    // If so, block off those dates
  }

  bookedOnDay(date) {
    return this.allBookings.filter(booking => booking.date === date)

    // I want to go through the bookings and
  }

  roomsAvailableOnDay(bookings) {
    return this.rooms.filter(room => !bookings.some(booking => booking.roomNumber === room.number))
  }

  roomsBookedOnDay(bookings) {
    return this.rooms.filter(room => bookings.some(booking => booking.roomNumber === room.number))
  }

  uniqueRoomTypes() {
    // let rooms = [];
    // this.rooms.forEach(room => {
    //   if (!rooms.includes(room.roomType)) {
    //     rooms.push(room.roomType)
    //   }
    // })
    //
    // this.rooms.forEach(room => {
    //   if (rooms.includes(room.roomType))
    // })

    return this.rooms.reduce((acc, currentVal, index) => {
      let roomInfo = { type: currentVal.roomType, price: currentVal.costPerNight}
      if (!acc.some(room => room.type === roomInfo.type)) {
        acc.push(roomInfo)
      }
      return acc
    }, [])
  }
}

// Hotel should hold onto all data pulled into API, will serve as repo

export default Hotel;
