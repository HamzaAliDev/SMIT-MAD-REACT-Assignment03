import React, { useState, useEffect, useCallback, useMemo } from 'react';

import pizza1 from './../../assets/pic/pizza1.jpg';
import pizza2 from './../../assets/pic/pizza2.jpg';
import burger1 from './../../assets/pic/burger1.jpg';
import burger2 from './../../assets/pic/burger2.jpg';
import burger3 from './../../assets/pic/burger3.jpeg';
import apetz1 from './../../assets/pic/apetz1.webp';
import apetz2 from './../../assets/pic/apetz2.jpeg';
import apetz3 from './../../assets/pic/apetz3.jpg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const uniqueId = () => Math.random().toString(36).slice(2);
export default function MenuList() {

    const [activeTab, setActiveTab] = useState('tab-1')
    const [orders, setOrders] = useState([])
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const imgMap = useMemo(() => ({
        pizza1: pizza1,
        pizza2: pizza2,
        burger1: burger1,
        burger2: burger2,
        burger3: burger3,
        apetz1: apetz1,
        apetz2: apetz2,
        apetz3: apetz3
    }), []);
    const loadData = useCallback((activeTab) => {
        let storedOrders = JSON.parse(localStorage.getItem('Orders')) ||[]
        setOrders(storedOrders)

        let menuList = JSON.parse(localStorage.getItem('MenuList'))
        let filteredData = [];

        if (activeTab === 'tab-1') {
            filteredData = menuList.filter(item => item.category === 'pizza');
        } else if (activeTab === 'tab-2') {
            filteredData = menuList.filter(item => item.category === 'burger');
        } else if (activeTab === 'tab-3') {
            filteredData = menuList.filter(item => item.category === 'apetz');
        }

        const mappedData = filteredData.map(item => ({
            ...item,
            pic: imgMap[item.pic] || item.pic
        }));
        setData(mappedData);
    }, [imgMap]);

    useEffect(() => {
        loadData(activeTab);
    }, [activeTab, loadData]);

    
    const handleOrder = (item) => {
        let { name, price, ingredients, pic } = item;
        // console.log("pic",pic)
        
        let isAuth = localStorage.getItem('IsAuth');
        if (isAuth === 'false') { toast.warning("Please Login"); return navigate('/auth/login') }

        //get current user.
        let currentUser = JSON.parse(localStorage.getItem('RestaurantCurrentUser'))
        let userId = currentUser.id

        const order = {
            id: uniqueId(),
            name,
            price,
            ingredients,
            pic,
            userId
        }
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        localStorage.setItem('Orders', JSON.stringify(updatedOrders));

        toast.success("Order Add Successfully!");

    }

    return (
        <>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center ">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
                        <h1 className="mb-5">Most Popular Items</h1>
                    </div>
                    <div className="tab-class text-center">
                        <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                            <li className="nav-item">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-1' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-1" onClick={() => setActiveTab('tab-1')}>
                                    <i className="fa fa-pizza-slice fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Popular</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Pizzas</h6>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-2' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-2" onClick={() => setActiveTab('tab-2')}>
                                    <i className="fa fa-hamburger fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Special</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Burgers</h6>
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 nav-menu ${activeTab === 'tab-3' ? 'active' : ''}`}
                                    data-bs-toggle="pill" href="#tab-3" onClick={() => setActiveTab('tab-3')}>
                                    <i className="fa fa-cheese fa-2x text-primary"></i>
                                    <div className="ps-3">
                                        <small className="text-body">Lovely</small>
                                        <h6 className="mt-n1 mb-0 fs-5">Appetizers</h6>
                                    </div>
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id="tab-1" className={`tab-pane fade ${activeTab === 'tab-1' ? 'show active' : ''} p-0`}>
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.pic} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.name}</span>
                                                        <span className="text-primary">${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <span className='btn btn-primary p-1 px-3 rounded-4' onClick={() => { handleOrder(item) }}>Add</span>
                                                    </small>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div id="tab-2" className={`tab-pane fade ${activeTab === 'tab-2' ? 'show active' : ''} p-0`}>
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.pic} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.name}</span>
                                                        <span className="text-primary">${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <span className='btn btn-primary p-1 px-3 rounded-4' onClick={() => { handleOrder(item) }}>Add</span>
                                                    </small>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                            <div id="tab-3" className={`tab-pane fade ${activeTab === 'tab-3' ? 'show active' : ''} p-0`}>
                                <div className="row g-4">
                                    {data.map((item, index) => (
                                        <div key={index} className="col-lg-6 mb-2">
                                            <div className="d-flex align-items-center">
                                                <img className="flex-shrink-0 img-fluid rounded" src={item.pic} alt="" style={{ width: '80px' }} />
                                                <div className="w-100 d-flex flex-column text-start ps-4">
                                                    <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                        <span>{item.name}</span>
                                                        <span className="text-primary">${item.price}</span>
                                                    </h5>
                                                    <small className=" d-flex justify-content-between align-items-center">
                                                        <span className='fst-italic'>{item.ingredients}</span>
                                                        <span className='btn btn-primary p-1 px-3 rounded-4  btn-constant-height' onClick={() => { handleOrder(item) }}>Add</span>
                                                    </small>

                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
