import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
export default function Footer() {
    const [state, setState] = useState('');
    const [userEmails, setUserEmails] = useState([])
    let year = new Date().getFullYear();

    // Load users from local storage when the component mounts
    useEffect(() => {
        const storedUserEmails = localStorage.getItem('UserEmails');
        if (storedUserEmails) {
            setUserEmails(JSON.parse(storedUserEmails));
        }
    }, []);

    const handleChange = (e) => {
        setState(s => ({...s,[e.target.name]: e.target.value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let {email} = state
        email = email.trim();

        if(!email.match(isValidEmail)){return toast.error("Invalid Email")};
        
        const updatedUserEmails = [...userEmails, email];
        setUserEmails(updatedUserEmails) 
        localStorage.setItem('UserEmails', JSON.stringify(updatedUserEmails));

        toast.success("Email add Successfully!");
        setState('');

    }

    return (
        <footer>
            <div className="container-fluid bg-dark text-light footer pt-5 mt-5">
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Company</h4>
                            <p className="btn btn-link" >About Us</p>
                            <p className="btn btn-link" >Contact Us</p>
                            <p className="btn btn-link" >Reservation</p>
                            <p className="btn btn-link" >Privacy Policy</p>
                            <p className="btn btn-link" >Terms & Condition</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Contact</h4>
                            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+92 3037777771</p>
                            <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
                            <div className="d-flex pt-2">
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-twitter"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-facebook-f"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-instagram"></i></p>
                                <p className="btn btn-outline-primary btn-social" ><i className="fab fa-linkedin-in"></i></p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Opening</h4>
                            <h5 className="text-light fw-normal">Monday - Saturday</h5>
                            <p>09AM - 09PM</p>
                            <h5 className="text-light fw-normal">Sunday</h5>
                            <p>10AM - 08PM</p>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h4 className="section-title ff-secondary text-start text-primary fw-normal mb-4">Newsletter</h4>
                            <p>Get the Best from Food Hub. Join Our Foodie Community!</p>
                            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
                                <input className="form-control border-primary w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" name='email' value={state.value} onChange={handleChange} />
                                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col text-center text-md-start mb-3 mb-md-0">
                                <p className='text-center'> &copy;{year} , All Right Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
