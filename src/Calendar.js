import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
dayjs.extend(dayOfYear)

class Calendar {
  constructor() {
    this.currentDate = dayjs().format('YYYY/MM/DD')
  }
  checkIfPastBooking(inputDate) {
    if (dayjs(inputDate).dayOfYear() < dayjs(this.currentDate).dayOfYear()) {
      return true
    }
    return false
  }
  checkIfCurrentBooking(inputDate) {
    if (dayjs(inputDate).dayOfYear() === dayjs(this.currentDate).dayOfYear()) {
      return true
    }
    return false
  }
}

export default Calendar
