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

export const displayAvailableRooms = (hotel, element) => {
  // let availableRoomsSection = document.getElementById('availableRoomsSection')
  element.innerHTML = "";
  let available = hotel.checkAvailability(hotel.calendar.currentDate).availableRooms
  console.log(available)
  if (available.length) {

    available.forEach((room) => {
      let imgClass = checkForSpace(room.roomType)
      element.innerHTML += `
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
  else {
    element.innerHTML += `
    <h2>We're sorry! There are no rooms available for this date, please try selecting another date.</h2>
    `
  }

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
    currentBookings.sort((a, b) => a.date > b.date ? 1 : -1)
    currentUser.bookings.present.forEach(booking => {
      upcomingBookings.innerHTML += `
      <article>
      <h3>Booking Today: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Cost: $${booking.cost}</h5>
      <h4>Room Number: ${booking.roomNumber}</h4>
      </article>
      `
    })
  }
  if (futureBookings.length) {
    futureBookings.sort((a, b) => a.date > b.date ? 1 : -1)
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

  export const updateAvailableRooms = (hotel, date, element) => {
    // let availableRoomsSection = document.getElementById('availableRoomsSection')
    element.innerHTML = "";
    let available = hotel.checkAvailability(date).availableRooms;
    if (available.length) {

      available.forEach((room) => {
        let imgClass = checkForSpace(room.roomType)
        element.innerHTML += `
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
        // document.getElementById('availableText').innerText = ""
        // document.getElementById('availableText').innerText +=
      });
    }
    else {
      element.innerHTML += `
      <h2>We're sorry! There are no rooms available for this date, please try selecting another date.</h2>
      `
    }

  }

export const renderAllUsers = (manager) => {
  document.querySelector('.all-users-container').innerHTML = ""
  manager.hotel.customers.forEach(customer => {
    manager.retrieveUserInfo(customer)
    customer.numBookings = 0;
    Object.values(customer.bookings).forEach(dataset => {
      if (dataset.length) {
        customer.numBookings += dataset.length
      }
    })
    document.querySelector('.all-users-container').innerHTML += `
    <article>
      <h3 class="all-users-name-id">Name: ${customer.name} ID: ${customer.id}</h3>
      <p class="all-users-spent">Total Spent: $${customer.spent}</p>
      <p class="all-users-preference">Room Preference: ${customer.roomPreference}</p>
      <p class="all-users-bookings"># of Bookings: ${customer.numBookings}</p>
    </article>
    `
  })
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
