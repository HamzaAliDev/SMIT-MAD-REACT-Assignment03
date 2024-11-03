import React, { useCallback, useEffect, useState } from 'react';
import { HeartFilled } from '@ant-design/icons';
import HeaderOther from '../../../components/Header/HeaderOther'
import { useWishlistContext } from '../../../contexts/WishlistContext';
import { useMenuContext } from '../../../contexts/MenuContext';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../../contexts/CartContext';

export default function Favourites() {
  const { isAuthenticated, user } = useAuthContext();
  const { dataList, removeFavourites } = useWishlistContext();
  const { setCartCounting } = useCartContext();
  const { menuItems } = useMenuContext();
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const showData = useCallback(() => {
    let temp = [];
    (dataList || []).forEach((item) => {
      (menuItems || []).forEach((menu) => {
        if (item === menu.itemId) {
          temp.push(menu);
        }
      });
    });
    setData(temp);
  }, [dataList, menuItems]);

  const LoadData = () => {
    let data = JSON.parse(localStorage.getItem('Orders')) || [];
    setOrders(data);
  }

  useEffect(() => {
    showData();
    LoadData();
  }, [showData])

  const toggleWishlistRemove = (itemId) => {
    removeFavourites(itemId);

  }

  // place order in the cart 
  const handleOrder = (id) => {

    if (!isAuthenticated) { window.toastify("Please Login", 'error'); return navigate('/auth/login') }

    //get current user.
    let userId = user.id

    let verifyOrder = orders.find(odr => odr.itemId === id && odr.userId === userId)
    if (verifyOrder) { return window.toastify("Already in Cart", "info") }

    const order = {
      itemId: id,
      userId
    }
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('Orders', JSON.stringify(updatedOrders));

    const filteredData = updatedOrders.filter(item => item.userId === user.id) || [];
    setCartCounting(filteredData.length);

    window.toastify("Order Add Successfully!", 'success');
  }
  return (
    <>
      <HeaderOther title='Fovourites' />
      <main>
        <div className="container-xl">
          <div className="text-center">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">Fovourites</h5>
            <h1 className="mb-5" style={{ fontFamily: 'Lato' }}>Your Favourites</h1>
          </div>
          <div className='row d-flex flex-wrap align-items-center justify-content-center'>
            {data.map((item, index) => (
              <div key={index} className='col-lg-3 col-md-4 col-sm-6'>
                <div className="card rounded-5 mb-3">
                  <img src={item.imgUrl} className="card-img-top rounded-top-5" alt="..." style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="card-body">
                    <div className='d-flex justify-content-between'>
                      <h5 className="card-title">{item.title}</h5>
                      <h5 className="card-title">${item.price}</h5>
                    </div>
                    <p className="card-text" style={{ height: 48, overflow: "hidden", textOverflow: "ellipsis" }}>{item.ingredients}</p>
                    <div className='row px-1  d-flex flex-row justify-content-center align-items-center'>
                      <div className="col-10 p-0">
                        <button className='btn btn-primary w-100 p-1 rounded-4 add-btn' onClick={() => { handleOrder(item.itemId) }}>Add</button>
                      </div>
                      <div className="col-2">
                        <HeartFilled
                          className="wishlist-icon"
                          style={{ color: "red" }}
                          onClick={() => toggleWishlistRemove(item.itemId)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
