import React, { useEffect, useState } from 'react'
import HeaderOther from '../../../components/Header/HeaderOther'
import { Card, Input, Modal } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const initialState = {fullName: '', oldPassword: '', newPassword:''}
export default function Profile() {
    const [state, setState] = useState(initialState)
    const [currentUser, setCurrentUser] = useState({});
    const [orders, setOrders] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalSelection, setModalSelection] = useState('')

   // Initialize OrderHistory only if it doesn't exist
   useEffect(() => {
    if (!localStorage.getItem('OrderHistory')) {
        localStorage.setItem('OrderHistory', JSON.stringify([]))
    }
}, [])

    const loadData = () => {
        const user = JSON.parse(localStorage.getItem('RestaurantCurrentUser'))
        setCurrentUser(user)
    }
    useEffect(() => {
        loadData();
    }, [])


    const showModal = (value) => {
        setIsModalOpen(true);

        if (value === 'current-order') {
            const confirmedOrders = JSON.parse(localStorage.getItem('ConfirmedOrders')) || []
            const filterOrders = confirmedOrders.filter(order => order.userId === currentUser.id)
            setOrders(filterOrders)
            setModalSelection(value)
        } else if (value === "update-profile") {
            setModalSelection(value)
        } else {
            setModalSelection(value)
            const orderHistory = JSON.parse(localStorage.getItem('OrderHistory')) || []
            const filterHistory = orderHistory.filter(o => o.userId === currentUser.id)
            // console.log("filterHistory",filterHistory)
            setOrders(filterHistory)
        }
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const handleChange = (e) => {
        setState(s => ({...s,[e.target.name]: e.target.value}) )
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        let { fullName ,oldPassword, newPassword } = state
        fullName = fullName.trim()
    
        if(fullName === "" || oldPassword === "" || newPassword === ''){ return toast.error("All fields are must required")}
        if(fullName.length < 3){return toast.error("Enter correct username")} 
        if(oldPassword.length < 6 || newPassword.length < 6){return toast.warning("Password must be 6 characters")}
        if(oldPassword !== currentUser.password){return toast.error("Incorrect Old Password")}

        
        let updatedUser = {
            ...currentUser,
            fullName,
            password: newPassword
        }

        localStorage.setItem('RestaurantCurrentUser', JSON.stringify(updatedUser))

         // Update the user in RestaurantUsers
         const userList = JSON.parse(localStorage.getItem('RestaurantUsers')) || [];
         const updatedUsers = userList.map(user => user.id === currentUser.id ? updatedUser : user);
         localStorage.setItem('RestaurantUsers', JSON.stringify(updatedUsers));
 
         toast.success("Profile updated successfully!");
         setState(initialState);
         loadData();
         setIsModalOpen(false);
    }

    return (
        <>
            <HeaderOther title='Profile' />
            <main>
                <div className="container-xxxl bg-white p-0">
                    <div className="container-xxl py-5">
                        <div className="container">
                            <div className="text-center">
                                <h5 className="section-title ff-secondary text-center text-primary fw-normal">User Profile</h5>
                                <h1 className="mb-5" style={{fontFamily:'Lato'}}>Your Profile</h1>
                                <div className="row d-flex  justify-content-center">
                                    <div className="col-lg-6">
                                        <Card hoverable>
                                            <div className="card-body">
                                                <h4 className='card-title text-primary' style={{fontFamily:'Lato'}}>Profile Card</h4>
                                                <div style={{ textAlign: 'left',fontFamily:'Lato' }}>
                                                    <i className="fa fs-4 fa-user text-primary ms-3 mt-4 text-left"></i>
                                                    <span className='fs-5 fw-semibold ms-4 '>{currentUser.fullName}</span><br />
                                                    <i className='fa fs-4 fa-receipt text-primary ms-3 mt-4'></i>
                                                    <span className='fs-5 fw-semibold ms-4' onClick={() => showModal('current-order')}>Current Order</span><br />
                                                    <i className='fa fs-4 fa-list-alt text-primary ms-3 mt-4'></i>
                                                    <span className='fs-5 fw-semibold ms-3' onClick={() => showModal('order-history')}>Order History</span><br />
                                                    <i className='fa fs-4 fa-user-edit text-primary ms-3 mt-4'></i>
                                                    <span className='fs-5 fw-semibold ms-3' onClick={() => showModal('update-profile')}>Update Profile</span><br />
                                                </div>
                                            </div>

                                        </Card>
                                    </div>

                                </div>
                            </div>
                            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                {modalSelection === 'current-order' &&
                                    orders.map((order, i) => (
                                        <Card key={i} hoverable className='mb-3' >
                                            <div className='d-flex flex-row flex-wrap align-items-center justify-content-between'>
                                                <div className="col mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <img className="flex-shrink-0 img-fluid rounded" src={order.pic} alt="" style={{ width: '80px' }} />
                                                        <div className="w-100 d-flex flex-column text-start ps-4">
                                                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                <span>{order.name}</span>
                                                                <span className="text-primary">${order.price}</span>
                                                            </h5>
                                                            <small className=" d-flex justify-content-between">
                                                                <span className='fst-italic'>Quantity: {order.quantity}</span>
                                                                <span className='fst-italic'>{dayjs(order.CreatedDate).format('MMMM D, YYYY')}</span>
                                                            </small>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                    )) }
                                {modalSelection === 'order-history' &&
                                    orders.map((order, i) => (
                                        <Card key={i} hoverable className='mb-3' >
                                            <div className='d-flex flex-row flex-wrap align-items-center justify-content-between'>
                                                <div className="col mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <img className="flex-shrink-0 img-fluid rounded" src={order.pic} alt="" style={{ width: '80px' }} />
                                                        <div className="w-100 d-flex flex-column text-start ps-4">
                                                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                                <span>{order.name}</span>
                                                                <span className="text-primary">${order.price}</span>
                                                            </h5>
                                                            <small className=" d-flex justify-content-between">
                                                                <span className='fst-italic'>Quantity: {order.quantity}</span>
                                                                <span className='fst-italic'>{dayjs(order.CreatedDate).format('MMMM D, YYYY')}</span>
                                                            </small>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                    )) }
                                {modalSelection === 'update-profile' &&
                                    <Card  style={{
                                        width: 440,
                                        border: 'none',
                                        transition: 'box-shadow 0.3s ease-in-out',
                                        background: 'transparent'
                                    }}>
                                        <form action="">
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <h1 className='text-center fs-1 fw-semibold' style={{ fontFamily: "Courier New" }}>Update Profile</h1>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Input type='text' size="large" placeholder="Full Name" prefix={<UserOutlined />} name='fullName' value={state.fullName} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Input.Password size="large" placeholder="Old Password" name='oldPassword' value={state.oldPassword}  onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Input.Password size="large" placeholder="New Password" name='newPassword' value={state.newPassword}  onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="row px-3">
                                                <button className='btn btn-primary fw-semibold' onClick={handleUpdate}>Update</button>
                                            </div>
                                            
                                        </form>
                                    </Card>}
                            </Modal>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
