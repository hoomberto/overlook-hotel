// DAYJS

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

// App Imports

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
  renderManagerModal,
  closeModal,
  closeManagerModal,
  closeDeleteModal,
  renderDeleteModal,
  renderModal,
  renderSearch,
  renderDatePicker,
  displayPageLevelError,
  updateHeader,
  unsuccessfulLogin } from './domUpdates'

// CSS
import './css/base.scss';

// Images
import './images/single.jpg'
import './images/junior.jpg'
import './images/residential.jpg'
import './images/suite.jpg'
import './images/hotel-entrance.jpg'
import './images/pool-pic.jpg'


// Global Variables

let hotel, currentUser, manager;

// Query Selectors

const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn');
const roomTypeFilter = document.getElementById('typeFilter');
const datePicker = document.getElementById('dateSelector');
const availableText = document.getElementById('availableText');
const availableSection = document.getElementById('availableRoomsSection');
const userSearch = document.getElementById('userSearch')
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults')

// FETCH / GET

const getUser = (id) => {
  apiCalls.fetchUser(id).then(data => {
    let foundUser = hotel.customers.find(customer => customer.id === data.id)
    currentUser = foundUser
    currentUser.setRoomData(hotel);
    greetUser(currentUser)
    displayPreviousBookings(currentUser);
  })
}

const retrieveFreshManagerData = (found) => {
  apiCalls.getData().then(data => {

    let customerData = data[0];
    let bookingsData = data[1];
    let roomsData = data[2];

    if (!customerData) {
      return
    }

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

const fetch = (id) => {
  apiCalls.getData().then(data => {
    let customerData = data[0];
    let bookingsData = data[1];
    let roomsData = data[2];

    if (!customerData) {
      return
    }

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

// Login Form

const loginManager = () => {
  retrieveFreshManagerData();
}

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

// POSTING / DELETING Bookings

const deleteBooking = () => {
  // console.log(manager.currentSearch, manager.currentToDelete)
  const found = manager.currentSearch
  manager.deleteBooking(manager.currentToDelete)
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
  updateHeader(document.getElementById('dateSelector'));
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
  apiCalls.postBooking(newBooking)
  retrieveFreshManagerData(found)
  closeManagerModal();
}

// EVENT LISTENERS

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
    let datePicker = document.getElementById('dateSelector')
    renderModal(modal, datePicker)
  }

  if (event.target.closest('.new-booking')) {
    bookRoom(event)
  }

  if (event.target.closest('.new-booking-as-manager')) {
    bookRoomAsManager(event)
  }

  if (event.target.closest('.delete')) {
    let deleteModal = document.getElementById('deleteModal')
    renderDeleteModal(deleteModal, manager)
  }

  if (event.target.closest('.delete-as-manager')) {
    deleteBooking(event)
  }
})

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

loginBtn.addEventListener('click', login)
