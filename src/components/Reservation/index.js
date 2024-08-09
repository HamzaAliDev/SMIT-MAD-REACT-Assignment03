import React,{useState, useEffect} from 'react';
import tableImg from './../../assets/pic/table.jpg';
import table2Img from './../../assets/pic/table2.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialState = {fullName: '',email:'',reservedTime:'',noOfPeople:'',request:''};
const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const uniqueId = () => Math.random().toString(36).slice(4);

export default function Reservation({ onBookingConfirmed }) {
    const [state, setState] = useState(initialState);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate()

      // Load users from local storage when the component mounts
      useEffect(() => {
        const storedBookings = localStorage.getItem('Bookings');
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        }
    }, []);

    const handleChange = (e) => {
        setState(s =>({...s,[e.target.name]: e.target.value}))
    }

    const handleBooking = (e) => {
        e.preventDefault();

        // check login.
        let isAuth = localStorage.getItem('IsAuth');
        if(isAuth === 'false'){ toast.warning("Please Login"); return  navigate('/auth/login') }

        let {fullName, email, reservedTime, noOfPeople, request} = state;
        fullName = fullName.trim();
        email = email.trim();

        if(fullName === "" || email === "" || noOfPeople === '' || reservedTime === ''){ return toast.error("All fields are must required")}
        if(fullName.length < 3){return toast.error("Enter correct username")}
        if(!email.match(isValidEmail)){return toast.error("Invalid Email")}  

        //get current user.
        let currentUser = JSON.parse(localStorage.getItem('RestaurantCurrentUser'))
        let userId = currentUser.id
        let userBooking = {
            userId,
            fullName,
            email,
            reservedTime,
            noOfPeople,
            request,
            bookingId: uniqueId(),
            bookingTime: new Date()
        }

        const updatedBookings = [...bookings, userBooking];
        setBookings(updatedBookings) 
        localStorage.setItem('Bookings', JSON.stringify(updatedBookings));

        toast.success("Added Booking Successfully!");
        onBookingConfirmed();
        setState(initialState);

    }

  return (
    <div className="container-xxl py-5 px-0 ">
          <div className="row g-0">
            <div className="col-md-6" >
              <img src={tableImg} alt="" style={{ width: "100%" }} />
              <img src={table2Img} alt="" style={{ height: 250, width: "100%" }} />
            </div>
            <div className="col-md-6 bg-dark d-flex align-items-center">
              <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
                <h5 className="section-title ff-secondary text-start text-primary fw-normal">Reservation</h5>
                <h1 className="text-white mb-4">Book A Table Online</h1>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" id="name" placeholder="Your Name" name='fullName' value={state.fullName} onChange={handleChange} />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" id="email" placeholder="Your Email" name='email' value={state.email} onChange={handleChange} />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating date" id="date3" data-target-input="nearest">
                        <input type="datetime-local" className="form-control datetimepicker-input" id="datetime" placeholder="Date & Time" data-target="#date3" data-toggle="datetimepicker" name='reservedTime' value={state.reservedTime} onChange={handleChange} />
                        <label htmlFor="datetime">Date & Time</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select className="form-select" id="select1" name='noOfPeople' value={state.noOfPeople} onChange={handleChange}>
                          <option value="">select</option>
                          <option value="1">People 1</option>
                          <option value="2">People 2</option>
                          <option value="3">People 3</option>
                        </select>
                        <label htmlFor="select1">No Of People</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea className="form-control" placeholder="Special Request" id="message" style={{ height: "100px" }} name='request' value={state.request} onChange={handleChange}></textarea>
                        <label htmlFor="message" >Special Request</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit" onClick={handleBooking}>Book Now</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

  )
}
