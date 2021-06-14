export const greetUser = (currentUser) => {
  let userSpent = currentUser.getTotalSpent();
  let userPreference = currentUser.roomPreference.toUpperCase();
  if (currentUser.bookings.present.length || currentUser.bookings.future.length) {

    updateUserUpcomingBookings(currentUser)
  }
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


export const checkForSpace = (input) => {
  let regex = new RegExp(' ');
  if (regex.test(input)) {
    let first = input.split(' ')[0];
    return first
  }
  return input
}

export const displayAvailableRooms = (hotel) => {
  let availableRoomsSection = document.getElementById('availableRoomsSection')
  availableRoomsSection.innerHTML = "";
  hotel.checkAvailability(hotel.calendar.currentDate).availableRooms.forEach((room) => {
    let imgClass = checkForSpace(room.roomType)
    availableRoomsSection.innerHTML += `
      <article class="available-room">
      <div class="info-container">
        <h3>Room Number: ${room.number}</h3>
        <h4>Room Type: ${room.roomType.toUpperCase()}</h4>
        <h4>Cost Per Night: $${room.costPerNight}</h5>
      </div>
      <button class="info-btn" name="info">More Info</button
      <div>
        <img src="./images/${imgClass}.jpg" alt="hotel-room-photo" />
      </div>
      </article>
    `

  });

}

export const renderRoomTypes = (hotel) => {
  console.log(hotel)
  hotel.roomTypes.forEach((room) => {
    let type = room.type
    document.getElementById('typeFilter').innerHTML += `
      <option value="${type}">${type.toUpperCase()}</option>
    `

  });

}

export const renderDefaultDate = (date) => {
  document.getElementById('dateSelector').value = date
}

export const updateUserUpcomingBookings = (currentUser) => {
  let upcomingBookings = document.getElementById('upcomingBookings')
  upcomingBookings.innerHTML = "";
  upcomingBookings.classList.remove('hidden')
  document.getElementById('upcoming').classList.remove('hidden');
  // document.getElementById('spacer').classList.remove('hidden');
  let currentBookings = currentUser.bookings.present
  let futureBookings = currentUser.bookings.future
  // console.log(currentUser.bookings.present)
  // console.log(currentUser.bookings.future)
  upcomingBookings.innerHTML += `
  <div id="spacer" class="spacer upcoming-spacer"></div>
  `
  if (currentBookings.length) {
    currentUser.bookings.present.forEach(booking => {
      upcomingBookings.innerHTML += `
      <article>
      <h3>Booking on: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Cost: $${booking.cost}</h5>
      <h4>Room Number: ${booking.roomNumber}</h4>
      </article>
      `
    })
  }
  if (futureBookings.length) {

    currentUser.bookings.future.forEach(booking => {
      upcomingBookings.innerHTML += `
      <article>
      <h3>Booking on: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Cost: $${booking.cost}</h5>
      <h4>Room Number: ${booking.roomNumber}</h4>
      </article>
      `
    })
  }
}


export const renderFilter = (result) => {
  // console.log(hotel)
  let availableSection = document.getElementById('availableRoomsSection')
  availableSection.classList.add('available-rooms-section')
  availableSection.classList.remove('smaller-set')
  if (result.length < 6) {
    availableSection.classList.remove('available-rooms-section')
    availableSection.classList.add('smaller-set')
  }
  availableSection.innerHTML = ""
  result.forEach(room => {
    let imgClass = checkForSpace(room.roomType)

    availableSection.innerHTML += `
    <article class="available-room">
    <div class="info-container">
    <h3>Room Number: ${room.number}</h3>
    <h4>Room Type: ${room.roomType.toUpperCase()}</h4>
    <h4>Cost Per Night: $${room.costPerNight}</h5>
    </div>
    <button class="info-btn" name="info">More Info</button>
    <img src="./images/${imgClass}.jpg" alt="hotel-room-photo" />
    </article>
    `
  })
}

  export const updateAvailableRooms = (hotel, date) => {
    let availableRoomsSection = document.getElementById('availableRoomsSection')
    availableRoomsSection.innerHTML = "";
    hotel.checkAvailability(date).availableRooms.forEach((room) => {
      let imgClass = checkForSpace(room.roomType)
      availableRoomsSection.innerHTML += `
        <article class="available-room">
        <div class="info-container">
          <h3>Room Number: ${room.number}</h3>
          <h4>Room Type: ${room.roomType.toUpperCase()}</h4>
          <h4>Cost Per Night: $${room.costPerNight}</h5>
        </div>
        <button class="info-btn" name="info">More Info</button
        <div>
          <img src="./images/${imgClass}.jpg" alt="hotel-room-photo" />
        </div>
        </article>
      `

    });

  }



  // `
  //   <article class="available-room">
  //   <div class="info-container">
  //     <h3>Room Number: ${room.number}</h3>
  //     <h4>Room Type: ${room.roomType.toUpperCase()}</h4>
  //     <h4>Cost Per Night: $${room.costPerNight}</h5>
  //   </div>
  //   <button class="info-btn" name="info">More Info</button
  //   <div>
  //     <img alt="hotel-room-photo" />
  //   </div>
  //   </article>
  // `
