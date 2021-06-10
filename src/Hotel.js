class Hotel {
  constructor(customersData, roomsData, bookingsData, calendar) {
    this.customers = customersData;
    this.staff = [];
    this.rooms = roomsData;
    this.bookings = bookingsData;
    this.calendar = calendar;
    this.roomTypes = this.uniqueRoomTypes();
    this.availableToday = this.checkAvailability(this.calendar.currentDate)
  }

  checkAvailability(date) {
    return {
      bookedRooms: this.roomsBookedOnDay(this.bookedOnDay(date)),
      availableRooms: this.roomsAvailableOnDay(this.bookedOnDay(date))
    }
  }

  bookedOnDay(date) {
    return this.bookings.filter(booking => booking.date === date)
  }

  roomsAvailableOnDay(bookings) {
    return this.rooms.filter(room => !bookings.some(booking => booking.roomNumber === room.number))
  }

  roomsBookedOnDay(bookings) {
    return this.rooms.filter(room => bookings.some(booking => booking.roomNumber === room.number))
  }

  uniqueRoomTypes() {
    return this.rooms.reduce((acc, currentVal, index) => {
      let roomInfo = { type: currentVal.roomType, price: currentVal.costPerNight}
      if (!acc.some(room => room.type === roomInfo.type)) {
        acc.push(roomInfo)
      }
      return acc
    }, [])
  }

  correlateData() {
    // Sort bookings before correlating with users, easier to read
    let sortedBookings = this.bookings.sort((a, b) => a.date > b.date ? 1 : -1);
    this.customers.forEach(user => {
      sortedBookings.forEach(booking => {
        if (booking.userID === user.id) {
          user.bookings.push(booking)
        }
      })
    })
  }
}

// Hotel should hold onto all data pulled into API, will serve as repo

export default Hotel;
