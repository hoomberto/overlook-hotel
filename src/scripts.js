import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)

import apiCalls from './apiCalls'
import Hotel from './Hotel'
import Calendar from './Calendar'

// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'


// Global Variables

let hotel;


console.log('This is the JavaScript entry file - your code begins here.');
let fetched = apiCalls.getData().then(data => {
  let customerData = data[0];
  let bookingsData = data[1];
  let roomsData = data[2];
  // console.log(bookingsData)
  let calendar = new Calendar()
  hotel = new Hotel(customerData.customers, roomsData.rooms, bookingsData.bookings, calendar)
  console.log(hotel.calendar.currentDate)
  console.log(hotel)
  let bookedOnFirstDay = hotel.bookedOnDay("2020/01/08")
  let roomsBookedToday = hotel.roomsBookedOnDay(bookedOnFirstDay)
  let availableToday = hotel.roomsAvailableOnDay(bookedOnFirstDay)
  console.log(roomsBookedToday)
  console.log(availableToday)
  console.log(hotel.roomTypes)
  // let sorted = bookingsData.bookings.sort((a, b) => a.date > b.date ? 1 : -1);
  //
  // let uniqueDates =  getUniqueDates(sorted)
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
