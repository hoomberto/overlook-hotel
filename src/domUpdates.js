export const greetUser = (currentUser) => {
  let userSpent = currentUser.getTotalSpent();
  let userPreference = currentUser.roomPreference.toUpperCase();

  document.getElementById('userGreeting').innerText = `
  ${currentUser.name.split(' ')[0]}'s Dashboard
  `
  document.getElementById('spent').innerText = userSpent;
  document.getElementById('preferredRoomType').innerText = userPreference;
}

export const displayPreviousBookings = (currentUser) => {
  currentUser.getBookings('past').forEach((booking) => {
    document.getElementById('previousBookings').innerHTML += `
      <article>
        <h3>Date stayed: ${booking.date}</h3>
        <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
        <h4>Room Cost: $${booking.cost}</h5>
      </article>
    `

  });

}

export const displayAvailableRooms = (hotel) => {
  hotel.checkAvailability(hotel.calendar.currentDate).availableRooms.forEach((room) => {
    document.getElementById('availableRoomsSection').innerHTML += `
      <article class="available-room">
        <h3>Room Number: ${room.number}</h3>
        <h4>Room Type: ${room.roomType.toUpperCase()}</h4>
        <h4>Room Cost Per Night: $${room.costPerNight}</h5>
      </article>
    `

  });

}
