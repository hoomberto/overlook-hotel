import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

import apiCalls from './apiCalls'
import Hotel from './Hotel'
import User from './User'
import Calendar from './Calendar'
import { greetUser, displayPreviousBookings } from './domUpdates'

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
  getUser(Math.floor(Math.random() * hotel.customers.length + 1))
  let availableSingle = hotel.filterByType('single room', hotel.calendar.currentDate)
  let residential = hotel.filterByType('residential suite', hotel.calendar.currentDate)
  console.log(availableSingle)
  console.log(residential)
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


test3.addEventListener('click', function() {
  console.log(currentUser)
})

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
