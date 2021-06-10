export const greetUser = (currentUser) => {
  document.getElementById('userGreeting').innerText = `
  ${currentUser.name.split(' ')[0]}'s Dashboard
  `
  document.getElementById('spent').innerText = currentUser.getTotalSpent()
}

export const displayPreviousBookings = (currentUser) => {
  currentUser.bookings.forEach((booking) => {
    document.getElementById('previousBookings').innerHTML += `
      <article>
        <h3>Date stayed: ${booking.date}</h3>
        <h4>Room Type: ${booking.roomType}</h4>
        <h5>Room Cost: ${booking.cost}</h5>
      </article>
    `

  });

}
