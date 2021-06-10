class Hotel {
  constructor() {
    this.customers = [];
    this.staff = [];
    this.rooms = [];
    this.bookings = [];
    this.calendar;
  }

  checkAvailability() {
    // Go through calendar, check if any dates
    // Correspond to dates held in bookings
    // If so, block off those dates
  }
}

// Hotel should hold onto all data pulled into API, will serve as repo

export default Hotel;
