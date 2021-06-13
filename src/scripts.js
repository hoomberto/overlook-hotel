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
import Calendar from './Calendar'
import { greetUser, displayPreviousBookings, displayAvailableRooms, renderRoomTypes, renderFilter, renderDefaultDate } from './domUpdates'

// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'


// Global Variables

let hotel, currentUser;

console.log('This is the JavaScript entry file - your code begins here.');
let fetched = apiCalls.getData().then(data => {
  let customerData = data[0];
  let bookingsData = data[1];
  let roomsData = data[2];

  let calendar = new Calendar()
  let instaUsers = customerData.customers.map(customer => new User(customer))
  hotel = new Hotel(instaUsers, roomsData.rooms, bookingsData.bookings, calendar)
  hotel.correlateData()
  displayAvailableRooms(hotel)
  let formattedForInput = hotel.calendar.currentDate.split('/').join('-')
  document.getElementById('dateSelector').setAttribute('min', `${formattedForInput}`)
  document.getElementById('dateSelector').setAttribute('value', `${formattedForInput}`)
  renderRoomTypes(hotel)
  getUser(Math.floor(Math.random() * hotel.customers.length + 1))
  let availableSingle = hotel.filterByType('single room', hotel.calendar.currentDate)
  let residential = hotel.filterByType('residential suite', hotel.calendar.currentDate)
  // console.log(availableSingle)
  // console.log(residential)
  let junior = hotel.filterByType('junior suite', hotel.calendar.currentDate)
  let suite = hotel.filterByType('suite', hotel.calendar.currentDate)
  // console.log(junior)
  // console.log(suite)
})
.catch(err => displayPageLevelError(err))

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

roomTypeFilter.addEventListener('change', () => {
  let choice = roomTypeFilter.value;
  let selectedDate = datePicker.value;
  let filtered = hotel.filterByType(choice, selectedDate);
  let formatted = dayjs(selectedDate, "YYYY-MM-DD").format('LL')
  availableText.innerText = "";
  availableText.innerText += `${choice.toUpperCase()} Rooms Available on ${formatted}`
  renderFilter(filtered)
})

document.body.addEventListener('click', (event) => {
event.preventDefault();
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
    <div class=info-container>
      <h3>${previous.children[0].innerText}</h3>
      <h4>${previous.children[1].innerText}</h4>
      <h4>${previous.children[2].innerText}</h4>
    </div>
    <img src="${roomImage.src}" alt="${roomImage.alt}">
    <h5>Make Booking for: ${formatted}</h5>
    <button class="new-booking">BOOK ROOM</button>
    <button class="close-modal">CLOSE</button>
    </article>
    `


    // body.addEventListener('click', function() {
    //   modal.style.display = "none";
    // })

  }



})

const closeModal = () => {
  document.getElementById("userInputModal").style.display = "none"
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
