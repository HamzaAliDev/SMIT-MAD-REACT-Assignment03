import React, { useState, useEffect } from 'react'
import { Card, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import bgImg from '../../../src/assets/pic/bg.jpeg'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const initialState = {fullName:'',email:'',password:''};
const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const uniqueId = () => Math.random().toString(36).slice(4);
const storageKey = 'RestaurantUsers';

export default function Register() {

    const [state, setState] = useState(initialState);
    const [users,setUsers] = useState([]);
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();


    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    // Load users from local storage when the component mounts
    useEffect(() => {
        const storedUsers = localStorage.getItem(storageKey);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
    }, []);

    const handleChange = (e) => {
        setState(s =>({...s,[e.target.name]: e.target.value}))
    }

    const handleRegister = (e) => {
        e.preventDefault();
        let { fullName ,email, password } = state
        fullName = fullName.trim()
        email = email.trim()
    
        if(fullName === "" || email === "" || password === ''){ return toast.error("All fields are must required")}
        if(fullName.length < 3){return toast.error("Enter correct username")}
        if(!email.match(isValidEmail)){return toast.error("Invalid Email")}  
        if(password.length < 6){return toast.warning("Password must be 6 characters")}
        if(users.find(user => user.email === email)){return toast.info("Already Have an account")}
        
        let user = {
            fullName,
            email,
            password,
            addDate: new Date(),
            id:uniqueId(),
            status: "Active"
        }

        const updatedUsers = [...users, user];
        setUsers(updatedUsers);
        localStorage.setItem(storageKey, JSON.stringify(updatedUsers));

        toast.success("Added User Successfully!");
        setState(initialState);
        navigate("/auth/login");
        // console.log(user);
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
                            <h1 className='text-center fs-1 fw-semibold' style={{fontFamily:"Courier New"}}>Register</h1>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <Input type='text' size="large" placeholder="Full Name"  prefix={<UserOutlined />} name='fullName' value={state.fullName} onChange={handleChange} />
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
                        <button className='btn btn-primary fw-semibold' onClick={handleRegister}>Register</button>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <p className=' text-center fs-6 fw-semibold'>Already have an account? <Link to='/auth/login' style={{ color: '#f1733d', textDecoration:'none' }}>Login</Link></p>
                        </div>
                    </div>
                    </form>
                </Card>
        </main>
    )
}
