import React, { useState } from 'react'
import { Button, Card, Input } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../../../src/assets/pic/bg.jpeg';
import { useAuthContext } from '../../contexts/AuthContext';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const initialState = { email: '', password: '' };

export default function Login() {
    const { dispatch } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [hover, setHover] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate();

    // handle card hover effect.
    const handleMouseEnter = () =>  setHover(true);
    const handleMouseLeave = () =>  setHover(false);

    // handle state.
    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    // handle login.
    const handleLogin = (e) => {
        e.preventDefault();
        let { email, password } = state;
        email = email.trim();

        if (email === '' || password === '') { return window.toastify("All fields are must required", 'error') }
        if (password.length < 6) { return window.toastify("Password must contain 6 chars", 'error') }

        setIsProcessing(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                window.toastify("Successfully login", "success")
                setIsProcessing(false);
                dispatch({ type: 'SET_LOGGED_IN', payload: { user } })
                setState(initialState);
                navigate('/home')
            })
            .catch((error) => {
                console.log("error", error)
                switch (error.code) {
                    case 'auth/invalid-credential':
                        window.toastify("Invalid email and password", 'error'); break;
                    default:
                        window.toastify("Something went wrong  while signing", 'error');
                }
                setIsProcessing(false);
            }
        );
    }

    return (
        <main className='d-flex justify-content-center align-items-center position-relative'
            style={{
                height: '100vh',
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }} >
            <div className="overlay"></div>
            <Card className='login-register-card' style={{
                width: 440,
                border: 'none',
                boxShadow: hover ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'box-shadow 0.3s ease-in-out',
                background: 'transparent'
            }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <form action="">
                    <div className="row mb-3">
                        <div className="col">
                            <h1 className='text-center fs-1 fw-semibold' style={{ fontFamily: "Courier New" }}>Login</h1>
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
                        <Button className='btn btn-primary fw-semibold login-btn' size="large" loading={isProcessing} onClick={handleLogin}>Login</Button>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            <p className=' text-center fs-6 fw-semibold' >Don't have an account? <Link to='/auth/register' style={{ color: '#f1733d', textDecoration: 'none' }}>Register</Link></p>
                        </div>
                    </div>
                </form>
            </Card>
        </main>
    )
}
