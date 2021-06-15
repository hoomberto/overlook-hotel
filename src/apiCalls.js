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

const fetchUser = (id) => {
  return fetch(`http://localhost:3001/api/v1/customers/${id}`)
    .then(response => response.json())
    .catch(err => console.error("not working"))
}

const postBooking = (newBooking) => {
  let url = 'http://localhost:3001/api/v1/bookings/'
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBooking)
  })
  .then(checkResponse);
}

const checkResponse = (response) => {
  if (response.ok) {
    // document.getElementById('errorMessage').innerText = ""
    let message = {
      message: `Booking successfully posted`,
    };
    console.log(message)
    return response.json();
  }
  else {
    console.log(response.status)
    if (response.status === 422) {
      let error = new Error('Bad Post Request')
      // let message = `${response.status} ${error.message} - Please enter data correctly`
      // document.getElementById('errorMessage').innerText = message
      throw error;
    }
    else {
      let error = new Error('Something went wrong')
      let message = `${error.message}`;
      alert(message)
      // document.getElementById('errorMessage').innerText = message
      throw error
    }
  }
}

const deleteBooking = (bookingID) => {
  let url = 'http://localhost:3001/api/v1/bookings/'
  fetch(url + bookingID, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
  })
  .then(checkResponse);
}



const getData = () => {
  return Promise.all([fetchCustomersData(), fetchBookingsData(), fetchRoomsData()])
}
export default { getData, fetchUser, postBooking, deleteBooking }
