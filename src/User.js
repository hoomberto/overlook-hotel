class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.bookings = [];
    this.spent = 0;
    this.type;
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
  }

  getTotalSpent() {
    return `$${this.spent}`;
  }

  getBookings() {
    return this.bookings
  }
}

export default User;
