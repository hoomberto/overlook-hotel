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
import { greetUser, displayPreviousBookings, displayAvailableRooms, renderRoomTypes, renderFilter, renderDefaultDate, updateAvailableRooms, updateUserUpcomingBookings } from './domUpdates'

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

// console.log('This is the JavaScript entry file - your code begins here.');

const userNameInput = document.getElementById('username');
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn');

// loginBtn.addEventListener('click', login)

const login = (event) => {
  event.preventDefault();
  let username = userNameInput.value;
  let password = passwordInput.value;
  // let customerCheck = username.split('r')
  let userCheck = username.split('r')
  let passwordMatch = (password === 'overlook2021')
  let id = parseInt(userCheck[1])
  // console.log('userCheck', customerCheck)
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
// const successfulLogin = (id) => {
//   fetch(id);
// }

const unsuccessfulLogin = () => {
  alert("PLEASE TRY AGAIN")
}

const hide = (element) => {
  element.classList.add('hidden')
}

const show = (element) => {
  element.classList.remove('hidden')
}

const loginManager = () => {
  apiCalls.getData().then(data => {
    let customerData = data[0];
    let bookingsData = data[1];
    let roomsData = data[2];

    let calendar = new Calendar()
    let instaUsers = customerData.customers.map(customer => new User(customer))
    hotel = new Hotel(instaUsers, roomsData.rooms, bookingsData.bookings, calendar)
    manager = new Manager(hotel)
    hotel.correlateData()
    displayManagerDashBoard();
    console.log(manager)
    // show(document.querySelector('main'))
    // show(document.querySelector('nav'))
    // hide(document.getElementById('login'))
    // displayAvailableRooms(hotel)
    // let formattedForInput = hotel.calendar.currentDate.split('/').join('-')
    // document.getElementById('dateSelector').setAttribute('min', `${formattedForInput}`)
    // document.getElementById('dateSelector').setAttribute('value', `${formattedForInput}`)
    // renderRoomTypes(hotel)
    // getUser(id)
  })
  .catch(err => displayPageLevelError(err))
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
    displayAvailableRooms(hotel)
    let formattedForInput = hotel.calendar.currentDate.split('/').join('-')
    document.getElementById('dateSelector').setAttribute('min', `${formattedForInput}`)
    document.getElementById('dateSelector').setAttribute('value', `${formattedForInput}`)
    renderRoomTypes(hotel)
    getUser(id)
  })
  .catch(err => displayPageLevelError(err))
}

const displayUserDashboard = () => {
  show(document.querySelector('main'))
  show(document.querySelector('nav'))
  hide(document.getElementById('login'))
  displayAvailableRooms(hotel)
}

const displayManagerDashBoard = () => {
  // show(document.querySelector('main'))
  // show(document.querySelector('nav'))
  hide(document.getElementById('login'))
  show(document.getElementById('managerDash'))
  // displayAvailableRooms(hotel)
}

// let fetched = apiCalls.getData().then(data => {
//   let customerData = data[0];
//   let bookingsData = data[1];
//   let roomsData = data[2];
//
//   let calendar = new Calendar()
//   let instaUsers = customerData.customers.map(customer => new User(customer))
//   hotel = new Hotel(instaUsers, roomsData.rooms, bookingsData.bookings, calendar)
//   hotel.correlateData()
//   displayAvailableRooms(hotel)
//   let formattedForInput = hotel.calendar.currentDate.split('/').join('-')
//   document.getElementById('dateSelector').setAttribute('min', `${formattedForInput}`)
//   document.getElementById('dateSelector').setAttribute('value', `${formattedForInput}`)
//   renderRoomTypes(hotel)
//   getUser(Math.floor(Math.random() * hotel.customers.length + 1))
//   let availableSingle = hotel.filterByType('single room', hotel.calendar.currentDate)
//   let residential = hotel.filterByType('residential suite', hotel.calendar.currentDate)
//   // console.log(availableSingle)
//   // console.log(residential)
//   let junior = hotel.filterByType('junior suite', hotel.calendar.currentDate)
//   let suite = hotel.filterByType('suite', hotel.calendar.currentDate)
//   // console.log(junior)
//   // console.log(suite)
// })
// .catch(err => displayPageLevelError(err))

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
  let newBooking = {
    "id": Date.now(),
    "userID": user.id,
    "date": date,
    "roomNumber": selection.roomNumber,
    "roomServiceCharges": []
   }
  hotel.addBooking(newBooking)
  setNewBookingData(booking, hotel)

  apiCalls.postBooking(newBooking)
}

// const updateUserDate = () => {
//   hotel.
// }

// let test = document.getElementById('test')
let test3 = document.getElementById('test3')
// test.addEventListener('click', function() {
//   console.log(currentUser)
// })
let roomTypeFilter = document.getElementById('typeFilter');
let datePicker = document.getElementById('dateSelector');
let availableText = document.getElementById('availableText');
let availableSection = document.getElementById('availableRoomsSection');


test3.addEventListener('click', function() {
  console.log(currentUser)
})

datePicker.addEventListener('change', () => {
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  let displayDate = dayjs(selectedDate).format('LL')
  updateAvailableRooms(hotel, formatted);
  availableText.innerText = `All Room Types Available on ${displayDate}`
  roomTypeFilter.selectedIndex = 0;
})

roomTypeFilter.addEventListener('change', () => {
  availableText.innerText = "";
  if (roomTypeFilter.value === 'viewAll') {
    let selectedDate = datePicker.value;
    let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
    let displayDate = dayjs(selectedDate).format('LL')
    updateAvailableRooms(hotel, formatted);
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



document.body.addEventListener('click', (event) => {

  if (
  event.target.closest(".close-modal") || !event.target.closest(".user-input-modal")) {
    closeModal()
  }

  if (event.target.name === "info") {

    let modal = document.getElementById('userInputModal')
    // alert("working")
    modal.innerHTML = "";
    let previous = event.target.previousElementSibling;
    let next = event.target.nextElementSibling
    let roomImage = next
    let selectedDate = datePicker.value;
    let formatted = dayjs(selectedDate, "YYYY-MM-DD").format('LL')

    console.log(roomImage)
    // console.log(previous.children[1].innerText)
    // document.getElementById('userInputModal').innerHTML = "";
    // <img class="${roomImg}-modal">
    modal.style.display = 'flex'
    modal.innerHTML += `
    <article class='user-input-content'>
      <div class='info-container modal'>
        <h3>${previous.children[0].innerText}</h3>
        <h4>${previous.children[1].innerText}</h4>
        <h4>${previous.children[2].innerText} + Tax</h4>
      </div>
      <img class="modal-img" src="${roomImage.src}" alt="${roomImage.alt}">
      <h5>Make Booking for: ${formatted}</h5>
      <button class="new-booking">BOOK ROOM</button>
      <button class="close-modal">CLOSE</button>
    </article>
    `


  }

  if (event.target.closest('.new-booking')) {
    bookRoom(event)
  }



})

const closeModal = () => {
  document.getElementById("userInputModal").style.display = "none"
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
  console.log(hotel)
  closeModal();
  let selectedDate = datePicker.value;
  let formatted = dayjs(selectedDate).format("YYYY/MM/DD")
  updateAvailableRooms(hotel, formatted);
  roomTypeFilter.selectedIndex = 0;
  currentUser.setRoomData(hotel)
  updateUserUpcomingBookings(currentUser)
  updateHeader();
  // console.log(newBooking)
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
  // availableText.innerText += `All Rooms Available on ${displayDate}`

}

// const getUniqueDates = (sorted) => {
//   let uniqueDates = [];
//   sorted.forEach((booking) => {
//     let date = booking.date
//     if (!uniqueDates.includes(date)) {
//       uniqueDates.push(date)
//     }
//   });
//   return uniqueDates;
// }
