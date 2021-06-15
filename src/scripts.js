import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

import apiCalls from './apiCalls'
import Hotel from './Hotel'
import User from './User'
import Manager from './Manager'
import Calendar from './Calendar'
import {
  greetUser,
  displayPreviousBookings,
  displayAvailableRooms,
  renderRoomTypes,
  renderFilter,
  renderDefaultDate,
  updateAvailableRooms,
  updateUserUpcomingBookings,
  renderAllUsers,
  displayUserDashboard,
  hideLoginShowManager,
  hide,
  show,
  resetManagerDashboard,
  displayManagerDashBoard,
  resetSearch,
  resetUserInfo,
  makeChangeable } from './domUpdates'

// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/single.jpg'
import './images/junior.jpg'
import './images/residential.jpg'
import './images/suite.jpg'
import './images/hotel-entrance.jpg'
import './images/pool-pic.jpg'


// Global Variables

let hotel, currentUser, manager;


const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn');

const login = (event) => {
  event.preventDefault();
  let username = userNameInput.value;
  let password = passwordInput.value;
  let userCheck = username.split('r')
  let passwordMatch = (password === 'overlook2021')
  let id = parseInt(userCheck[1])
  if (userCheck[0] === 'custome' && (id > 0 && id < 51) && passwordMatch) {
    fetch(id);
  }
  else if (username === 'manager' && passwordMatch) {
    loginManager();
  }
  else {
    unsuccessfulLogin();
    return
  }
}

loginBtn.addEventListener('click', login)

const unsuccessfulLogin = () => {
  alert("PLEASE TRY AGAIN")
}

const retrieveFreshManagerData = (found) => {
  apiCalls.getData().then(data => {
    let customerData = data[0];
    let bookingsData = data[1];
    let roomsData = data[2];

    let calendar = new Calendar()
    let instaUsers = customerData.customers.map(customer => new User(customer))
    hotel = new Hotel(instaUsers, roomsData.rooms, bookingsData.bookings, calendar)
    hotel.correlateData()
    manager = new Manager(hotel)
    let currentManager = manager
    hideLoginShowManager();
    renderAllUsers(currentManager)
    displayManagerDashBoard(currentManager);
    if (found) {
      renderSearch(found.name, currentManager)
    }
  })
  .catch(err => displayPageLevelError(err))
}


const loginManager = () => {
  retrieveFreshManagerData();
}


const fetch = (id) => {
  apiCalls.getData().then(data => {
    let customerData = data[0];
    let bookingsData = data[1];
    let roomsData = data[2];

    let calendar = new Calendar()
    let instaUsers = customerData.customers.map(customer => new User(customer))
    hotel = new Hotel(instaUsers, roomsData.rooms, bookingsData.bookings, calendar)
    hotel.correlateData()
    show(document.querySelector('main'))
    show(document.querySelector('nav'))
    hide(document.getElementById('login'))
    let availableRoomsSection = document.getElementById('availableRoomsSection')
    displayAvailableRooms(hotel, availableRoomsSection)
    let formattedForInput = hotel.calendar.currentDate.split('/').join('-')
    document.getElementById('dateSelector').setAttribute('min', `${formattedForInput}`)
    document.getElementById('dateSelector').setAttribute('value', `${formattedForInput}`)
    renderRoomTypes(hotel)
    getUser(id)
  })
  .catch(err => displayPageLevelError(err))
}

// const displayUserDashboard = () => {
//   show(document.querySelector('main'))
//   show(document.querySelector('nav'))
//   hide(document.getElementById('login'))
//   displayAvailableRooms(hotel)
// }

// const hideLoginShowManager = () => {
//   hide(document.getElementById('login'))
//   show(document.getElementById('managerDash'))
// }

// const resetManagerDashboard = () => {
//   document.getElementById('managerCurrentBookings').innerHTML = ""
//   document.getElementById('revenue').innerText = "";
//   document.getElementById('occupied').innerText = "";
//   document.getElementById('revenue').innerText += `Today's Revenue: `
//   document.getElementById('occupied').innerText += `Today's Occupancy: `
// }

// const displayManagerDashBoard = (manager) => {
//
//   resetManagerDashboard();
//   let managerCurrentBookings = document.getElementById('managerCurrentBookings')
//
//   manager.setCurrentBookings();
//   if (!manager.hotel.availableToday.bookedRooms.length) {
//     managerCurrentBookings.innerHTML += `
//     <h1>No bookings for today currently!</h1>
//     `
//   }
//   manager.hotel.availableToday.bookedRooms.forEach(booking => {
//     managerCurrentBookings.innerHTML += `
//       <article>
//         <div>
//           <h3>Booked By: ${booking.bookedBy}, customer ID: ${booking.customerID}</h3>
//           <h3>Booking ID: ${booking.bookingID}</h3>
//           <h3>Profit: $${booking.costPerNight}</h4>
//         </div>
//       </article>
//     `
//   })
//   document.getElementById('revenue').innerText += ` ${manager.getTotalRevenueOnDay(manager.hotel.calendar.currentDate)}`
//   document.getElementById('occupied').innerText += ` ${manager.occupiedPercentageOnDate(manager.hotel.calendar.currentDate)}`
// }

const displayPageLevelError = (err) => {
  let dashboard = document.getElementById('dashboard');
  dashboard.innerHTML = `
  <h2>Technical Difficulties - try again later!</h2>
  `
  console.log(err)
}

const getUser = (id) => {
  apiCalls.fetchUser(id).then(data => {
    let foundUser = hotel.customers.find(customer => customer.id === data.id)
    currentUser = foundUser
    currentUser.setRoomData(hotel);
    greetUser(currentUser)
    displayPreviousBookings(currentUser);
  })
}

const addBooking = (user, date, selection) => {
  let id = hotel.bookings.length + 1;
  let newBooking = {
    "id": id,
    "userID": user.id,
    "date": date,
    "roomNumber": selection.roomNumber,
    "roomServiceCharges": []
   }
  hotel.addBooking(newBooking)
  setNewBookingData(booking, hotel)

  apiCalls.postBooking(newBooking)
}

// const resetSearch = () => {
//   let searchResults = document.getElementById('searchResults')
//   searchResults.innerHTML = "";
//   searchResults.innerHTML += `
//   <div id="userSearchInfo" class="user-info-search">
//   </div>
//   <div id="userUpcomingSearchInfo" class="user-past-info-search">
//   </div>
//   <div id="userPastSearchInfo" class="user-upcoming-info-search">
//   </div>
//   `
// }
//
// const resetUserInfo = () => {
//   let userInfo = document.getElementById('userSearchInfo')
//   let pastBookings = document.getElementById('userPastSearchInfo')
//   let upcomingBookings = document.getElementById('userUpcomingSearchInfo')
//   userInfo.innerHTML = "";
//   pastBookings.innerHTML = "";
//   upcomingBookings.innerHTML = "";
// }
//
// const makeChangeable = (element) => {
//   element.addEventListener('change', () => {
//     let selectedDate = element.value;
//     let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
//     let displayDate = dayjs(selectedDate).format('LL')
//     updateAvailableRooms(hotel, formatted, document.getElementById('availableForUsers'));
//     document.querySelectorAll("button[name='info']").forEach(element => {
//       element.name = 'infoManager'
//       element.classList.add('info-manager')
//     })
//   })
// }

const renderDatePicker = (element, name, manager) => {
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


const renderSearch = (searchValue, manager) => {
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


let roomTypeFilter = document.getElementById('typeFilter');
let datePicker = document.getElementById('dateSelector');
let availableText = document.getElementById('availableText');
let availableSection = document.getElementById('availableRoomsSection');
const userSearch = document.getElementById('userSearch')
const searchBtn = document.getElementById('searchBtn');
let searchResults = document.getElementById('searchResults')



userSearch.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (userSearch.value) {
      renderSearch(userSearch.value, manager)
    }
  }
})

searchBtn.addEventListener('click', () => {
  if (userSearch.value) {
    renderSearch(userSearch.value, manager)
  }
})


datePicker.addEventListener('change', () => {
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  let displayDate = dayjs(selectedDate).format('LL')
  updateAvailableRooms(hotel, formatted, document.getElementById('availableRoomsSection'));
  availableText.innerText = `All Room Types Available on ${displayDate}`
  roomTypeFilter.selectedIndex = 0;
})

roomTypeFilter.addEventListener('change', () => {
  availableText.innerText = "";
  if (roomTypeFilter.value === 'viewAll') {
    let selectedDate = datePicker.value;
    let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
    let displayDate = dayjs(selectedDate).format('LL')
    updateAvailableRooms(hotel, formatted, document.getElementById('availableRoomsSection'));
    availableText.innerText += `All Room Types Available on ${displayDate}`
    return
  }
  let choice = roomTypeFilter.value;
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  let filtered = hotel.filterByType(choice, formatted);
  let displayDate = dayjs(selectedDate).format('LL')
  if (!filtered.length) {
    availableText.innerText = "";
    availableText.innerText +=`
    We're sorry! We're currently out of this room type for this date, please try another.`;
    renderFilter(filtered)
    return
  }
  availableText.innerText = "";
  availableText.innerText += `${choice.toUpperCase()} Rooms Available on ${displayDate}`
  renderFilter(filtered)
})

const renderModal = (modal) => {
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



const renderManagerModal = (modal) => {
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



document.body.addEventListener('click', (event) => {

  if (
  event.target.closest(".close-modal") || !event.target.closest(".user-input-modal")) {
    closeModal()
  }

  if (event.target.closest(".close-manager-modal")) {
    closeManagerModal();
  }

  if (event.target.closest(".close-delete-modal")) {
    closeDeleteModal();
  }

  if (event.target.closest(".info-manager")) {
    let managerModal = document.getElementById('managerModal')
    renderManagerModal(managerModal)

  }

  if (event.target.name === "info") {

    let modal = document.getElementById('userInputModal')
    renderModal(modal)
  }


  if (event.target.closest('.new-booking')) {
    bookRoom(event)
  }


  if (event.target.closest('.new-booking-as-manager')) {
    bookRoomAsManager(event)
  }

  if (event.target.closest('.delete')) {
    let deleteModal = document.getElementById('deleteModal')
    renderDeleteModal(deleteModal)
  }

  if (event.target.closest('.delete-as-manager')) {
    deleteBooking(event)
  }

})

const closeModal = () => {
  document.getElementById("userInputModal").style.display = "none"
}

const closeManagerModal = () => {
  document.getElementById("managerModal").style.display = "none"
}

const closeDeleteModal = () => {
  document.getElementById("deleteModal").style.display = "none"
}


const renderDeleteModal = (modal) => {
  modal.innerHTML = "";
    let id = event.target.previousElementSibling.innerText.split(': ')[1];
  // let id = event.target.closest('.booking-id');
    console.log(id)
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









// ADDING / DELETING BOOKINGS

const deleteBooking = () => {
  console.log(manager)
  const found = manager.currentSearch
  manager.deleteBooking(manager.currentSearch, manager.currentToDelete)
  apiCalls.deleteBooking(manager.currentToDelete)
  retrieveFreshManagerData(found)
  closeDeleteModal();
}

const bookRoom = (event) => {
  let bookingInfo = event.target.previousElementSibling
  .previousElementSibling
  .previousElementSibling;
  let bookingDate = event.target.previousElementSibling.innerText.split('for: ')[1];
  let formattedDate = dayjs(bookingDate).format("YYYY/MM/DD");
  // let id = hotel.bookings.length + 1;
  let roomNum = bookingInfo.children[0].innerText.split(': ')[1]

  let newBooking = {
    id: Date.now(),
    userID: currentUser.id,
    date: formattedDate,
    roomNumber: parseInt(roomNum),
    roomServiceCharges: []
  }
  hotel.addBooking(newBooking);
  apiCalls.postBooking(newBooking)
  console.log(newBooking)
  closeModal();
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  updateAvailableRooms(hotel, formatted, document.getElementById('availableRoomsSection'));
  roomTypeFilter.selectedIndex = 0;
  currentUser.setRoomData(hotel)
  updateUserUpcomingBookings(currentUser)
  updateHeader();
}

const bookRoomAsManager = (event) => {
  let bookingInfo = event.target.previousElementSibling
  .previousElementSibling
  .previousElementSibling;

  let bookingDate = document.getElementById('datePick').value;
  let formattedDate = dayjs(bookingDate).format("YYYY/MM/DD");
  let found = manager.currentSearch;
  let roomNum = bookingInfo.children[0].innerText.split(': ')[1]

  let newBooking = {
    id: Date.now(),
    userID: found.id,
    date: formattedDate,
    roomNumber: parseInt(roomNum),
    roomServiceCharges: []
  }

  // console.log("NEW BOOKING", newBooking)
  // manager.addBookingForUser(found, newBooking)
  apiCalls.postBooking(newBooking)
  retrieveFreshManagerData(found)
  closeManagerModal();
}



const updateHeader = () => {
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  let displayDate = dayjs(selectedDate).format('LL')
  availableText.innerText = "";
  availableText.innerText += `Thank you for booking with us!`
  setTimeout(function() {
    availableText.innerText = "";
    availableText.innerText += `All Rooms Available on ${displayDate}`
  }, 700)
}
