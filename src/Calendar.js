import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
dayjs.extend(dayOfYear)

class Calendar {
  constructor() {
    this.currentDate = dayjs().format('YYYY/MM/DD')
  }
  checkIfPastBooking(inputDate) {
    let inputYear = inputDate.split('/')[0];
    let currentYear = this.currentDate.split('/')[0];
    if (inputYear > currentYear) {
      return false
    }
    else if (inputYear < currentYear) {
      return true
    }
    else {
      if (dayjs(inputDate).dayOfYear() < dayjs(this.currentDate).dayOfYear()) {
        return true
      }
      return false
    }
  }
  checkIfCurrentBooking(inputDate) {
    let inputYear = inputDate.split('/')[0];
    let currentYear = this.currentDate.split('/')[0];
    let equalDays = (dayjs(inputDate).dayOfYear() === dayjs(this.currentDate).dayOfYear())
    let equalYears = (inputYear === currentYear)
    if (equalDays && equalYears) {
      return true
    }
    return false
    // if (dayjs(inputDate).dayOfYear() === dayjs(this.currentDate).dayOfYear()) {
    //   return true
    // }
    // return false
  }
}

export default Calendar
