import React, {useState , useEffect} from 'react'
import HeaderOther from '../../../components/Header/HeaderOther';
import { toast } from 'react-toastify';

const initialState = {name:'', email:'', subject:'', message:''};
const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const uniqueId = () => Math.random().toString(36).slice(4);

export default function Contact() {
    const [state,setState] = useState(initialState);
    const [messages, setMessages] = useState([]);

    
    // Load users from local storage when the component mounts
    useEffect(() => {
        const storedMessages = localStorage.getItem('Messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);


    const handleChange = (e) => {
        setState(s => ({...s,[e.target.name]: e.target.value}))
    }

    const handleMessage = (e) => {
        e.preventDefault();
        let {name, email, subject, message} = state;
        name = name.trim()
        email = email.trim()
    
        if(name === "" || email === "" || subject === '' || message === ''){ return toast.error("All fields are must required")};
        if(name.length < 3){return toast.error("Enter correct username")};
        if(!email.match(isValidEmail)){return toast.error("Invalid Email")};  
        
        let msg = {
            name,
            email,
            subject,
            message,
            addDate: new Date(),
            id:uniqueId(),
        }

        const updatedMessages = [...messages, msg];
        setMessages(updatedMessages);
        localStorage.setItem('Messages', JSON.stringify(updatedMessages));

        toast.success("Added Message Successfully!");
        setState(initialState);
    }


    return (
        <>
            <HeaderOther title='Contact' />
            <main>
                <div className="container-xxl py-5">
                    <div className="container">
                        <div className="text-center">
                            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Contact Us</h5>
                            <h1 className="mb-5" style={{fontFamily:'Lato'}}>Contact For Any Query</h1>
                        </div>
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="row gy-4">
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">Booking</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>book@example.com</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">General</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>info@example.com</p>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="section-title ff-secondary fw-normal text-start text-primary">Technical</h5>
                                        <p><i className="fa fa-envelope-open text-primary me-2"></i>tech@example.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 wow fadeIn" data-wow-delay="0.1s">
                                <iframe className="position-relative rounded w-100 h-100"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                                    frameBorder="0" style={{ minHeight: '350px', border: 0 }} allowFullScreen="" aria-hidden="false"
                                    tabIndex="0" title="Google Maps"></iframe>
                            </div>
                            <div className="col-md-6">
                                <div className="">
                                    <form>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="name" placeholder="Your Name" name='name' value={state.name} onChange={handleChange} />
                                                    <label htmlFor="name">Your Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control" id="email" placeholder="Your Email" name='email' value={state.email} onChange={handleChange} />
                                                    <label htmlFor="email">Your Email</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control" id="subject" placeholder="Subject" name='subject' value={state.subject} onChange={handleChange} />
                                                    <label htmlFor="subject">Subject</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <textarea className="form-control" placeholder="Leave a message here" id="message" style={{ height: "150px" }} name='message' value={state.message} onChange={handleChange}></textarea>
                                                    <label htmlFor="message">Message</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100 py-3" type="submit" onClick={handleMessage}>Send Message</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
