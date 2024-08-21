import React, { useCallback, useEffect, useState } from 'react';
import HeaderOther from './../../../components/Header/HeaderOther'
import { Card, InputNumber } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Orders() {
  const [quantity, setQuantity] = useState({});
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleChange = (id, value) => {
    setQuantity(q => ({ ...q, [id]: value }))
  }


  let user = JSON.parse(localStorage.getItem('RestaurantCurrentUser'));
  const loadData = useCallback(() => {

    let orderList = JSON.parse(localStorage.getItem('Orders')) || [];
    let filteredData = orderList.filter(order => order.userId === user.id)

    setData(filteredData);

  }, []);


  const handleRemove = (order) => {
    let orderList = JSON.parse(localStorage.getItem('Orders')) || [];

    const updatedOrder = orderList.filter(item => item.id !== order.id)
    localStorage.setItem("Orders", JSON.stringify(updatedOrder))

    loadData()
  }


  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleConfirmOrder = () => {
    let storedOrders = JSON.parse(localStorage.getItem('Orders')) ||[]

    let filteredOrders = storedOrders.filter(order => order.userId === user.id)||[]

    if(filteredOrders.length === 0){
        toast.warning("Placed your Order")
        return navigate('/menu')
      }
    let confirmOrders = filteredOrders.map(order => ({
      ...order,
      quantity: quantity[order.id] || 1,
      CreatedDate : new Date()
    }))

    localStorage.setItem('ConfirmedOrders',JSON.stringify(confirmOrders))

    let remainingOrders = storedOrders.filter(order => order.userId !== user.id);
    localStorage.setItem('Orders', JSON.stringify(remainingOrders));

    toast.success("Order Confirmed")

    // Clear data state and quantities
    setData([]);
    setQuantity({});
  }



  return (
    <>
      <HeaderOther title='Orders' />
      <main>
        <div className="container-xxxl bg-white p-0">
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center ">
                <h5 className="section-title ff-secondary text-center text-primary fw-normal">Placed Orders</h5>
                <h1 className="mb-5 order-heading">Your Orders</h1>
                <div>
                  {data.map((order, i) => (
                    <Card key={i} hoverable className='mb-3' >
                      <div className='d-flex flex-row flex-wrap align-items-center justify-content-between'>
                        <div className="col-lg-6 mb-2">
                          <div className="d-flex align-items-center">
                            <img className="flex-shrink-0 img-fluid rounded" src={order.pic} alt="" style={{ width: '80px' }} />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                              <h5 className="d-flex justify-content-between border-bottom pb-2">
                                <span>{order.name}</span>
                                <span className="text-primary">${order.price}</span>
                              </h5>
                              <small className=" d-flex justify-content-between">
                                <span className='fst-italic'>{order.ingredients}</span>
                              </small>

                            </div>
                          </div>
                        </div>
                        <div className='col-lg-2 d-flex align-items-center'>
                          <InputNumber size="large" min={1} max={100} defaultValue={quantity[order.id] || 1} onChange={value => handleChange(order.id, value)} className='custom-input-field-antd' />
                          <button type='button' className='btn btn-primary ms-3' onClick={() => handleRemove(order)}>Remove</button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className='mt-5'>
                  <button className='btn btn-primary' onClick={handleConfirmOrder}>Confirm Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
