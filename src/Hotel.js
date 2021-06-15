class Hotel {
  constructor(customersData, roomsData, bookingsData, calendar) {
    this.customers = customersData || [];
    this.staff = [];
    this.rooms = roomsData || [];
    this.bookings = bookingsData || [];
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

  // checkIfRoomAvailable(number, date) {
  //   let roomsOnDay = this.checkAvailability(date);
  //   let bookedRoom = roomsOnDay.bookedRooms.find(room => room.number === number)
  //   if (bookedRoom) {
  //     return false
  //   }
  //   return true
  // }

  filterByType(type, date) {
    return this.checkAvailability(date).availableRooms
    .filter(room => room.roomType === type)
  }

  addBooking(newBooking) {
    this.bookings.push(newBooking)
    let found = this.customers.find(user => user.id === newBooking.userID)
    let isCurrentBooking = this.calendar.checkIfCurrentBooking(newBooking.date)
    if (isCurrentBooking) {
      found.bookings.present.push(newBooking)
    }
    else {
      found.bookings.future.push(newBooking)
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


  resetCustomerData() {
    this.customers.forEach(customer => {
      customer.resetRoomData();
    })
  }

  correlateData() {
    this.resetCustomerData();
    // Sort bookings before correlating with users, easier to read
    let sortedBookings = this.bookings.sort((a, b) => a.date > b.date ? -1 : 1);
    this.customers.forEach(user => {
      sortedBookings.forEach(booking => {
        if (booking.userID === user.id) {
          let isPastBooking = this.calendar.checkIfPastBooking(booking.date);
          let isCurrentBooking = this.calendar.checkIfCurrentBooking(booking.date)
          if (isPastBooking) {
            user.bookings.past.push(booking)
          }
          else if (isCurrentBooking) {
            user.bookings.present.push(booking)
          }
          else {
            user.bookings.future.push(booking)
          }
        }
      })
    })
  }
}

// Hotel should hold onto all data pulled into API, will serve as repo

export default Hotel;
