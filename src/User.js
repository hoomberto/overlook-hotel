class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.bookings = {
      past: [],
      present: [],
      future: []
    };
    this.spent = 0;
    this.type;
    this.roomPreference;
  }

  setRoomData(hotel) {
    this.resetDataForUpdate();
    Object.values(this.bookings).forEach(dataset => {
      dataset.forEach(booking => {
        let correlatedRoom = hotel.rooms.find(room => room.number === booking.roomNumber)
        booking.roomType = correlatedRoom.roomType
        booking.cost = correlatedRoom.costPerNight
        this.spent += correlatedRoom.costPerNight
      })
    })
    this.spent = this.spent.toFixed(2);
    this.getPreferredRoomType()
  }

  resetRoomData() {
    this.bookings.past = [];
    this.bookings.present = [];
    this.bookings.future = [];
  }

  resetDataForUpdate() {
    this.spent = 0;
    Object.values(this.bookings).forEach(dataset => {
      if (dataset.length) {
        dataset.map(booking => {
          return {
            id: booking.id,
            userID: booking.userID,
            date: booking.date,
            roomNumber: booking.roomNumber,
            roomServiceCharges: []
          }
        })
      }
    })
  }

  setNewBookingData(booking, hotel) {
    let correlatedRoom = hotel.rooms.find(room => room.number === booking.roomNumber)
    booking.roomType = correlatedRoom.roomType
    booking.cost = correlatedRoom.costPerNight
    this.spent += correlatedRoom.costPerNight
    let isCurrentBooking = hotel.calendar.checkIfCurrentBooking(booking.date)
    if (isCurrentBooking) {
      this.bookings.current.push(booking)
      return
    } else {
      this.bookings.future.push(booking)
      return
    }
  }

  getTotalSpent() {
    return `$${this.spent}`;
  }

  getBookings(time) {
    return this.bookings[time]
  }

  getPreferredRoomType() {
    if (this.bookings.past.length) {

      let count = this.bookings.past.reduce((acc, currentVal) => {
        let typeOfRoom = currentVal.roomType;
        if (!acc[typeOfRoom]) {
          acc[typeOfRoom] = {
            type: typeOfRoom,
            count: 0
          };
        }
        acc[typeOfRoom].count++;
        return acc
      }, {})
      let preferred = Object.values(count).sort((a, b) => a.count > b.count ? -1 : 1)[0];
      this.roomPreference = preferred.type;
    }
  }
}

export default User;
