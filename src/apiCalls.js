const fetchCustomersData = () => {
  return fetch('http://localhost:3001/api/v1/customers')
    .then(response => response.json())
    .catch(err => console.error("not working"))
}
const fetchBookingsData = () => {
  return fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
    .catch(err => console.error("not working"))
}

const fetchRoomsData = () => {
  return fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .catch(err => console.error("not working"))
}

const getData = () => {
  return Promise.all([fetchCustomersData(), fetchBookingsData(), fetchRoomsData()])
}
export default {
  getData
}
