import React, { useEffect, useState } from 'react'
import HeaderOther from '../../../components/Header/HeaderOther'
import Reservation from '../../../components/Reservation'
import dayjs from 'dayjs';


export default function Booking() {
  const [bookings, setBookings] = useState([])


  // console.log(bookings)
  let currentUser = JSON.parse(localStorage.getItem('RestaurantCurrentUser'))

  const loadData = () => {
    let storedBookings = JSON.parse(localStorage.getItem('Bookings')) || []
    // let currentUser = JSON.parse(localStorage.getItem('RestaurantCurrentUser'))
    let userId = currentUser.id;

    let filteredBookings = storedBookings.filter(item => item.userId === userId) || []
    setBookings(filteredBookings)

  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCancelBooking = (id) => {
    let storedBookings = JSON.parse(localStorage.getItem('Bookings'))
    let updatedBookings = storedBookings.filter(item => item.bookingId !== id)

    localStorage.setItem('Bookings', JSON.stringify(updatedBookings))

    loadData()
  }

  return (
    <>
      <HeaderOther title='Booking' />
      <main>
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center ">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">Your Bookings</h5>
              <h1 className="mb-5" style={{fontFamily:'Lato'}}>Your Bookings are Here</h1>
            </div>

            <div className="row g-4">
              {bookings.map((item, i) => (
                <div key={i} className="col-lg-6 col-sm-6  mb-2">
                  <div className="booking-card rounded pt-3" >
                    <h4 className='text-primary text-center'>Booking Card</h4>
                    <div className="p-4">
                      <i className="fa fs-4 fa-user text-primary"></i><span className='fs-5 fw-normal ms-3'>{item.fullName}</span><br />
                      <i className="fa fs-4 fa-clock text-primary mt-4"></i><span className='fs-5 fw-normal ms-3'>{dayjs(item.reservedTime).format('MMMM D, YYYY h:mm A')}</span><br />
                      <i className="fa fs-4 fa-user-group text-primary mt-4"></i><span className='fs-5 fw-normal ms-3'>{item.noOfPeople} Person</span><br />
                      <i className="fa fs-4 fa-sticky-note text-primary mt-4 "></i><span className='fs-5 fw-normal ms-3'>{item.request}</span>
                      <div className='d-flex justify-content-end'>
                        <button className='btn btn-warning' onClick={() => { handleCancelBooking(item.bookingId) }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}


            </div>




          </div>
          <Reservation onBookingConfirmed={loadData} />
        </div>
      </main>
    </>
  )
}
