import dayjs from 'dayjs';
class Calendar {
  constructor() {
    this.currentDate = dayjs().format('YYYY/MM/DD')
  }
}

export default Calendar
