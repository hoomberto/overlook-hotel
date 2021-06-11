class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.bookings = [];
    this.spent = 0;
    this.type;
    this.roomPreference;
  }

  setRoomData(hotel) {
    let spent = 0;
    this.bookings.forEach(booking => {
      let correlatedRoom = hotel.rooms.find(room => room.number === booking.roomNumber)
      booking.roomType = correlatedRoom.roomType
      booking.cost = correlatedRoom.costPerNight
      spent += correlatedRoom.costPerNight
    })
    this.spent = spent.toFixed(2);
    this.getPreferredRoomType()
  }

  getTotalSpent() {
    return `$${this.spent}`;
  }

  getBookings() {
    return this.bookings
  }

  getPreferredRoomType() {
    // I want to create a count for each type of room that the user
    // has visited. Then I want to sort by the count, and return
    // Just the top value.
    let count = this.bookings.reduce((acc, currentVal) => {
      let typeOfRoom = currentVal.roomType;
      if (!acc[typeOfRoom]) {
        acc[typeOfRoom] = {type: typeOfRoom, count: 0};
      }
      acc[typeOfRoom].count++;
      return acc
    }, {})
    let preferred = Object.values(count).sort((a, b) => a.count > b.count ? -1 : 1)[0]
    this.roomPreference = preferred.type;
  }
}

export default User;
