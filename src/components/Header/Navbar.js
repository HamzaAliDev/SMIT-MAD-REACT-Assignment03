import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Badge } from 'antd';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';

export default function Navbar() {
    const { handleLogout, isAuthenticated, user } = useAuthContext();
    const { cartCounting } = useCartContext();
    const {wishlistCounting} = useWishlistContext();
    const navigate = useNavigate();


    // handle logout
    const handleLogOut = () => {
        handleLogout();
        window.toastify("Successfully Logout", "success")
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-4 px-lg-5 py-3 py-lg-1">
            <Link to='home' className="navbar-brand p-0">
                <h1 className="text-primary m-0 navbar-brand-name"><i className="fa fa-utensils me-3"></i>FoodHub</h1>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0 pe-4">
                    <NavLink to='home' className="nav-item nav-link" activeclassname="active" >Home</NavLink>
                    <NavLink to='service' className="nav-item nav-link" activeclassname="active" >Service</NavLink>
                    <NavLink to='menu' className="nav-item nav-link" activeclassname="active" >Menu</NavLink>
                    <NavLink to='contact' className="nav-item nav-link" activeclassname="active" >Contact</NavLink>
                    <NavLink to='orders' activeclassname="active" ><Badge count={cartCounting} size='small' color='#fb8500' className='nav-item nav-link badge-position p-0'><i className="fas fa-bag-shopping fa-lg " ></i></Badge></NavLink>
                    <NavLink to='favourites' activeclassname="active" ><Badge count={wishlistCounting} size='small' color='#fb8500' className='nav-item nav-link mt-4 p-0'><i className="fas fa-heart fa-lg " ></i></Badge></NavLink>
                    <div className="nav-item dropdown">
                        <Link className="nav-link " data-bs-toggle="dropdown" >
                            <div className='nav-img-container'>
                                {isAuthenticated && (
                                    user.profileImgUrl ? (
                                        <img src={user.profileImgUrl} alt="Profile" className="profile-picture-navbar rounded-5" />
                                    ) : (
                                        <i className="fa fa-user fa-lg text-white rounded-5 profile-icon-navbar p-2 "></i>
                                    )
                                )}

                            </div>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-header m-0 ">

                            <NavLink to='booking' className="dropdown-item dropdown-link" >Booking</NavLink>
                            <NavLink to='profile' className="dropdown-item dropdown-link">View Profile</NavLink>
                            <button className="dropdown-item dropdown-link" onClick={handleLogOut}>Log out</button>
                        </div>

                    </div>
                </div>
                {!isAuthenticated &&
                    <>
                        <NavLink to='auth/login' className="btn btn-outline-primary py-1 rounded-5 me-3 fw-semibold">sign In</NavLink>
                        <Link to='auth/register' className="btn btn-primary py-1 rounded-5 fw-semibold">sign Up</Link>
                    </>
                }
            </div>
        </nav>
    )
}
