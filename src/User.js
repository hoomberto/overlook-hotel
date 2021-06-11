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
    // let spent = 0;
    // console.log(Object.values(this.bookings))
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

  getTotalSpent() {
    return `$${this.spent}`;
  }

  getBookings() {
    return this.bookings
  }

  getPreferredRoomType() {
    let count = this.bookings.past.reduce((acc, currentVal) => {
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
