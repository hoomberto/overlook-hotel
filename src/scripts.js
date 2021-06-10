import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(dayOfYear)

import apiCalls from './apiCalls'

// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/base.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'


// Global Variables

let customerData, bookingsData, roomsData;


console.log('This is the JavaScript entry file - your code begins here.');
let fetched = apiCalls.getData().then(data => {
  customerData = data[0];
  bookingsData = data[1];
  roomsData = data[2];
  // console.log(bookingsData)

  let sorted = bookingsData.bookings.sort((a, b) => a.date > b.date ? 1 : -1);

  let uniqueDates =  getUniqueDates(sorted)
  setCalendarDays(uniqueDates)
  // console.log(uniqueDates)
  //
  //
  // let startOfBookings = uniqueDates[0] // Jan 8, 2020
  // let endOfBookings = uniqueDates[uniqueDates.length-1] // Jun 18, 2020
  // let startDayOfYear = dayjs(startOfBookings).dayOfYear()
  // let endDayOfYear = dayjs(endOfBookings).dayOfYear()
  // There are 162 days between the start and end dates for bookings
  // So the currentDate will be assigned as the day that falls between these two
  // (162/2)
  //
  // let currentDayOfYear = (endDayOfYear - startDayOfYear) / 2
  //
  //
  // let currentDate = dayjs(startOfBookings).dayOfYear(currentDayOfYear).format("YYYY/MM/DD")
  // console.log('CURRENT DAY OF YEAR >>>>', currentDayOfYear)
  // console.log('CURRENT DATE >>>>>', currentDate)
  // console.log('Start Date>>>>', startOfBookings)
  // console.log('End Date>>>>', endOfBookings)
  //


})

const setCalendarDays = (uniqueDates) => {
  let startOfBookings = uniqueDates[0] // Jan 8, 2020
  let endOfBookings = uniqueDates[uniqueDates.length-1] // Jun 18, 2020
  let startDayOfYear = dayjs(startOfBookings).dayOfYear()
  let endDayOfYear = dayjs(endOfBookings).dayOfYear()
  // There are 162 days between the start and end dates for bookings
  // So the currentDate will be assigned as the day that falls between these two
  // (162/2)

  let currentDayOfYear = (endDayOfYear - startDayOfYear) / 2
  let currentDate = dayjs(startOfBookings).dayOfYear(currentDayOfYear).format("YYYY/MM/DD")
  console.log('CURRENT DAY OF YEAR >>>>', currentDayOfYear)
  console.log('CURRENT DATE >>>>>', currentDate)
  console.log('Start Date>>>>', startOfBookings)
  console.log('End Date>>>>', endOfBookings)
}


const getUniqueDates = (sorted) => {
  let uniqueDates = [];
  sorted.forEach((booking) => {
    let date = booking.date
    if (!uniqueDates.includes(date)) {
      uniqueDates.push(date)
    }
  });
  return uniqueDates;
}
