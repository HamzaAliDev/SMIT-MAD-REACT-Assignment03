import React, { useContext, useState } from 'react'
import { Card, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bgImg from '../../../src/assets/pic/bg.jpeg';
import { AuthContext } from '../../contexts/AuthContext';

const initialState = {email:'',password:''};
const storageKey = 'RestaurantUsers';
const currentUserKey = "RestaurantCurrentUser";
export default function Login() {
    const {dispatch} = useContext(AuthContext);
    const [state, setState] = useState(initialState)
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleChange = (e) => {
        setState(s =>({...s,[e.target.name]: e.target.value}))
    }

    const handleLogin = (e) => {
        e.preventDefault();
        let { email, password } = state;
        email = email.trim();

        let storedUsers = JSON.parse(localStorage.getItem(storageKey)) || [];

        // check if user exists or password matches
        let CheckedUser = storedUsers.find(user => user.email === email && user.password === password)

        if (CheckedUser) {
            localStorage.setItem(currentUserKey, JSON.stringify(CheckedUser));
            localStorage.setItem('IsAuth', 'true');
            
            dispatch({type: 'SET_LOGGED_IN'})
            toast.success("Login successfully");
            setState(initialState);
            navigate('/home');

        } else {
            toast.error("Invalid email or password.");
        }
    }


    return (
        <main className='d-flex justify-content-center align-items-center position-relative'
            style={{height:'100vh',
                backgroundImage:`url(${bgImg})`,
                backgroundSize:'cover',
                backgroundPosition: 'center',
                backgroundRepeat:'no-repeat',}} >
            <div className="overlay"></div>
                <Card className='login-register-card' style={{
                    width: 440,
                    border: 'none',
                    boxShadow: hover ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    transition: 'box-shadow 0.3s ease-in-out',
                    background:'transparent'}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <form action="">
                    <div className="row mb-3">
                        <div className="col">
                            <h1 className='text-center fs-1 fw-semibold' style={{fontFamily:"Courier New"}}>Login</h1>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <Input type='email' size="large" placeholder="email" prefix={<UserOutlined />} name='email' value={state.email} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <Input.Password size="large" placeholder="password" name='password' value={state.password} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row px-3">
                        <button className='btn btn-primary fw-semibold' onClick={handleLogin}>Login</button>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <p className=' text-center fs-6 fw-semibold' >Don't have an account? <Link to='/auth/register' style={{ color: '#f1733d', textDecoration:'none' }}>Register</Link></p>
                        </div>
                    </div>
                    </form>
                </Card>
        </main>
    )
}
