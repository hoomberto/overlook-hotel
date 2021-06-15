import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

// Customer Dashboard

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

export const updateUserUpcomingBookings = (currentUser) => {
  let upcomingBookings = document.getElementById('upcomingBookings')
  upcomingBookings.innerHTML = "";
  show(upcomingBookings)
  document.getElementById('upcoming').classList.remove('hidden');
  let currentBookings = currentUser.bookings.present
  let futureBookings = currentUser.bookings.future
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

const checkForSpace = (input) => {
  let regex = new RegExp(' ');
  if (regex.test(input)) {
    let first = input.split(' ')[0];
    return first
  }
  return input
}

export const displayAvailableRooms = (hotel, element) => {
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

export const renderFilter = (result) => {
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

// USER DASHBOARD

export const displayUserDashboard = () => {
  show(document.querySelector('main'))
  show(document.querySelector('nav'))
  hide(document.getElementById('login'))
  displayAvailableRooms(hotel)
}

export const hideLoginShowManager = () => {
  hide(document.getElementById('login'))
  show(document.getElementById('managerDash'))
}

export const hide = (element) => {
  element.classList.add('hidden')
}

export const show = (element) => {
  element.classList.remove('hidden')
}

export const resetManagerDashboard = () => {
  document.getElementById('managerCurrentBookings').innerHTML = ""
  document.getElementById('revenue').innerText = "";
  document.getElementById('occupied').innerText = "";
  document.getElementById('revenue').innerText += `Today's Revenue: `
  document.getElementById('occupied').innerText += `Today's Occupancy: `
}

export const displayManagerDashBoard = (manager) => {

  resetManagerDashboard();
  let managerCurrentBookings = document.getElementById('managerCurrentBookings')

  manager.setCurrentBookings();
  if (!manager.hotel.availableToday.bookedRooms.length) {
    managerCurrentBookings.innerHTML += `
    <h1>No bookings for today currently!</h1>
    `
  }
  manager.hotel.availableToday.bookedRooms.forEach(booking => {
    managerCurrentBookings.innerHTML += `
      <article>
        <div>
          <h3>Booked By: ${booking.bookedBy}, customer ID: ${booking.customerID}</h3>
          <h3>Booking ID: ${booking.bookingID}</h3>
          <h3>Profit: $${booking.costPerNight}</h4>
        </div>
      </article>
    `
  })
  document.getElementById('revenue').innerText += ` ${manager.getTotalRevenueOnDay(manager.hotel.calendar.currentDate)}`
  document.getElementById('occupied').innerText += ` ${manager.occupiedPercentageOnDate(manager.hotel.calendar.currentDate)}`
}

export const resetSearch = () => {
  let searchResults = document.getElementById('searchResults')
  searchResults.innerHTML = "";
  searchResults.innerHTML += `
  <div id="userSearchInfo" class="user-info-search">
  </div>
  <div id="userUpcomingSearchInfo" class="user-past-info-search">
  </div>
  <div id="userPastSearchInfo" class="user-upcoming-info-search">
  </div>
  `
}

export const resetUserInfo = () => {
  let userInfo = document.getElementById('userSearchInfo')
  let pastBookings = document.getElementById('userPastSearchInfo')
  let upcomingBookings = document.getElementById('userUpcomingSearchInfo')
  userInfo.innerHTML = "";
  pastBookings.innerHTML = "";
  upcomingBookings.innerHTML = "";
}

const makeChangeable = (element, manager) => {
  element.addEventListener('change', () => {
    let selectedDate = element.value;
    let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
    let displayDate = dayjs(selectedDate).format('LL')
    updateAvailableRooms(manager.hotel, formatted, document.getElementById('availableForUsers'));
    document.querySelectorAll("button[name='info']").forEach(element => {
      element.name = 'infoManager'
      element.classList.add('info-manager')
    })
  })
}

export const renderManagerModal = (modal) => {
  modal.innerHTML = "";
  let previous = event.target.previousElementSibling;
  let next = event.target.nextElementSibling
  let roomImage = next
  let selectedDate = document.getElementById('datePick').value;
  let formatted = dayjs(selectedDate, "YYYY-MM-DD").format('LL')

  modal.style.display = 'flex'
  modal.innerHTML += `
  <article class='user-input-content'>
    <div class='info-container modal'>
      <h3>${previous.children[0].innerText}</h3>
      <h4>${previous.children[1].innerText}</h4>
      <h4>${previous.children[2].innerText}</h4>
    </div>
    <img class="modal-img" src="${roomImage.src}" alt="${roomImage.alt}">
    <h5>Make Booking for: ${formatted}</h5>
    <button class="new-booking-as-manager">BOOK ROOM</button>
    <button class="close-modal close-manager-modal">CLOSE</button>
  </article>
  `
}

export const closeModal = () => {
  document.getElementById("userInputModal").style.display = "none"
}

export const closeManagerModal = () => {
  document.getElementById("managerModal").style.display = "none"
}

export const closeDeleteModal = () => {
  document.getElementById("deleteModal").style.display = "none"
}

export const renderDeleteModal = (modal, manager) => {
  modal.innerHTML = "";
  let id = event.target.previousElementSibling.innerText.split(': ')[1];
  manager.currentToDelete = id;
  modal.style.display = 'flex'
  modal.innerHTML += `
  <article class='user-input-content'>
    <h2>Are you sure you want to delete booking ${id}?<h2>
    <button class="delete-as-manager">DELETE BOOKING</button>
    <button class="close-modal close-delete-modal">CLOSE</button>
  </article>
  `
}

export const renderModal = (modal, datePicker) => {
  modal.innerHTML = "";
  let previous = event.target.previousElementSibling;
  let next = event.target.nextElementSibling
  let roomImage = next
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate, "YYYY-MM-DD").format('LL')

  modal.style.display = 'flex'
  modal.innerHTML += `
  <article class='user-input-content'>
    <div class='info-container modal'>
      <h3>${previous.children[0].innerText}</h3>
      <h4>${previous.children[1].innerText}</h4>
      <h4>${previous.children[2].innerText}</h4>
    </div>
    <img class="modal-img" src="${roomImage.src}" alt="${roomImage.alt}">
    <h5>Make Booking for: ${formatted}</h5>
    <button class="new-booking">BOOK ROOM</button>
    <button class="close-modal">CLOSE</button>
  </article>
  `
}

export const renderDatePicker = (element, name, manager) => {
  let formatted = manager.hotel.calendar.currentDate.split('/').join('-')
  element.innerHTML = "";
  element.innerHTML += `<h1>Create a booking for ${name}</h1>`
  element.innerHTML += `
  <label for="datePick">Select a Date:</label>
  <input id="datePick" type="date" name="datePick" min="${formatted}" value="${formatted}" max="2022-06-13">
  <h2 id="availableText">Rooms Available</h2>
  <section id="availableForUsers" class="available-rooms-section search-container">
  </section>
  `
  let availableForUsers = document.getElementById('availableForUsers')

  displayAvailableRooms(manager.hotel, availableForUsers)
  document.querySelectorAll("button[name='info']").forEach(element => {
    element.name = 'infoManager'
    element.classList.add('info-manager')
  })
  makeChangeable(document.getElementById('datePick'), manager)
}


export const renderSearch = (searchValue, manager) => {
  resetSearch();
  resetUserInfo();

  let found = manager.searchForUser(searchValue)
  let searchResults = document.getElementById('searchResults')
  let userInfo = document.getElementById('userSearchInfo')
  let pastBookings = document.getElementById('userPastSearchInfo')
  let upcomingBookings = document.getElementById('userUpcomingSearchInfo')
  let bookForUser = document.getElementById('bookForUser')

  if (!found) {
    userInfo.innerHTML += `
    <h1>No results found. Please try another search.</h1>
    `
    bookForUser.innerHTML = "";
    return
  }
  renderDatePicker(bookForUser, found.name, manager)

  userInfo.innerHTML += `
  <h2 id="searchedName">Name: ${found.name}</h2>
  <h3 id="searchedID">ID: ${found.id}</h3>
  <h3>Total Spent: $${found.spent}</h3>
  <h3>Room Preference: ${found.roomPreference}</h3>
  `

  if (found.bookings.present.length || found.bookings.future.length) {
    upcomingBookings.innerHTML += `
    <h2>Upcoming Bookings</h3>
    `
  }

  if (found.bookings.present.length) {
    found.bookings.present.forEach(booking => {
      upcomingBookings.innerHTML += `
      <article>
      <h3>Booking Today: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Number: ${booking.roomNumber}</h4>
      <h4>Room Cost: $${booking.cost}</h4>
      <h4 class="booking-id">Booking id: ${booking.id}</h4>
      <button class="delete">Delete Booking</button>
      </article>
      `
    })
  }

  if (found.bookings.future.length) {
    found.bookings.future.forEach(booking => {
      upcomingBookings.innerHTML += `
      <article>
      <h3>Booking On: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Number: ${booking.roomNumber}</h4>
      <h4>Room Cost: $${booking.cost}</h4>
      <h4 class="booking-id">Booking id: ${booking.id}</h4>
      <button class="delete">Delete Booking</button>
      </article>
      `
    })
  }

  pastBookings.innerHTML += `
  <h2>Past Bookings</h3>
  `
  found.bookings.past.forEach(booking => {
    pastBookings.innerHTML += `
    <article>
      <h3>Date stayed: ${booking.date}</h3>
      <h4>Room Type: ${booking.roomType.toUpperCase()}</h4>
      <h4>Room Number: ${booking.roomNumber}</h4>
      <h4>Room Cost: $${booking.cost}</h5>
    </article>
    `
  })
}

export const displayPageLevelError = (err) => {
  let dashboard = document.getElementById('dashboard')
  dashboard.innerHTML += `
  <h2>Technical Difficulties - try again later!</h2>
  `
  let notifierText = document.getElementById('notifier');
  notifierText.innerText = "";
  notifierText.innerText += `Sorry, we're having some trouble - Please try again later!`
  console.log(err)
}

export const updateHeader = (element) => {
  let selectedDate = element.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  let displayDate = dayjs(selectedDate).format('LL')
  availableText.innerText = "";
  availableText.innerText += `Thank you for booking with us!`
  setTimeout(function() {
    availableText.innerText = "";
    availableText.innerText += `All Rooms Available on ${displayDate}`
  }, 700)
}

export const unsuccessfulLogin = () => {
  let notifierText = document.getElementById('notifier');
  notifierText.innerText = "";
  notifierText.innerText += `Unsuccessful Login - Please try again`
}
