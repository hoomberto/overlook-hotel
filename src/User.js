class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.bookings = [];
    this.spent;
    this.type;
  }
}
