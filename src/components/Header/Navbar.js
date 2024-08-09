import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


export default function Navbar() {
    const {dispatch} = useContext(AuthContext);
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('RestaurantCurrentUser');
        localStorage.setItem('IsAuth','false');
        dispatch({type: 'SET_LOGGED_OUT'})
        navigate('/');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-4 px-lg-5 py-3 py-lg-1">
            <Link to='home'  className="navbar-brand p-0">
                <h1 className="text-primary m-0"><i className="fa fa-utensils me-3"></i>FoodHub</h1>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0 pe-4">
                    <NavLink to='home' className="nav-item nav-link" activeclassname="active" >Home</NavLink>
                    <NavLink to='service'  className="nav-item nav-link" activeclassname="active" >Service</NavLink>
                    <NavLink to='menu'  className="nav-item nav-link" activeclassname="active" >Menu</NavLink>
                    <NavLink to='orders'  className="nav-item nav-link" activeclassname="active" >Orders</NavLink>
                    <NavLink to='contact'  className="nav-item nav-link" activeclassname="active" >Contact</NavLink>
                    <div className="nav-item dropdown">
                        <Link  className="nav-link dropdown-toggle" data-bs-toggle="dropdown" >Pages</Link>
                        <div className="dropdown-menu dropdown-menu-header m-0 ">

                            <NavLink to='booking' className="dropdown-item dropdown-link" >Booking</NavLink>
                            <NavLink to='profile' className="dropdown-item dropdown-link">View Profile</NavLink>
                            <button  className="dropdown-item dropdown-link" onClick={handleLogout}>Log out</button>
                        </div>

                    </div>
                </div>
                <Link to='booking' className="btn btn-primary py-2 px-4">Book A Table</Link>
            </div>
        </nav>
    )
}
