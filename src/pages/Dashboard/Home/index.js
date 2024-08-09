import React, { useEffect, useState } from 'react'
import { Input, Layout, Menu, Modal, Select } from 'antd'
import { UserOutlined, UnorderedListOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

  const initialState = { name: '', ingredients: '', price: '', pic: '', category: ''}
export default function Home() {
  const [state, setState] = useState(initialState)
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1');
  const [userList, setUserList] = useState([])
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [history, setHistory] = useState([])
  const [feedback, setfeedback] = useState([])
  const [userEmails, setUserEmails] = useState([])
  const [menuList, setMenuList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Layout components data
  const items = [
    { key: '1', icon: <UserOutlined />, label: 'Users' },
    { key: '2', icon: <UnorderedListOutlined />, label: 'Table Bookings' },
    { key: '3', icon: <UnorderedListOutlined />, label: 'Orders' },
    { key: '4', icon: <UnorderedListOutlined />, label: 'Order History' },
    { key: '5', icon: <MessageOutlined />, label: 'User Feedback' },
    { key: '6', icon: <MailOutlined />, label: 'Users Email', },
    { key: '7', icon: <UnorderedListOutlined />, label: 'Menu List' },
    { key: '8', icon: <UnorderedListOutlined />, label: 'Add New Item' }
  ]

  // get data from local storage function
  const loadData = () => {
    const userList = JSON.parse(localStorage.getItem("RestaurantUsers")) || []
    const tableBookings = JSON.parse(localStorage.getItem("Bookings")) || []
    const currentOrders = JSON.parse(localStorage.getItem("ConfirmedOrders")) || []
    const orderHistory = JSON.parse(localStorage.getItem("OrderHistory")) || []
    const feedback = JSON.parse(localStorage.getItem("Messages")) || []
    const userEmails = JSON.parse(localStorage.getItem("UserEmails")) || []
    const menuList = JSON.parse(localStorage.getItem("MenuList")) || []

    setUserList(userList)
    setBookings(tableBookings)
    setOrders(currentOrders)
    setHistory(orderHistory)
    setfeedback(feedback)
    setUserEmails(userEmails)
    setMenuList(menuList)
  }

  useEffect(() => {
    loadData();
  }, [])

  // delete table Booking
  const handleDeleteBooking = (item) => {
    const updatedBookings = bookings.filter(b => b.bookingId !== item.bookingId)

    localStorage.setItem('Bookings', JSON.stringify(updatedBookings))

    toast.success("Booking remove Successfully")
    loadData();
  }

  // order completion
  const handleCompleteOrder = (order) => {
    const updateOrders = orders.filter(o => o.id !== order.id)
    const confirmOrder = orders.filter(o => o.id === order.id)

    setOrders(updateOrders);
    localStorage.setItem('ConfirmedOrders', JSON.stringify(updateOrders))
    localStorage.setItem('OrderHistory', JSON.stringify(confirmOrder));

    toast.success("Order Complete Successfully")
    loadData();
  }

  // delete menu in list
  const handleDeleteMenu = (item) => {
    const updatedMenu = menuList.filter(menu => menu.name !== item.name)

    localStorage.setItem('MenuList', JSON.stringify(updatedMenu))
    toast.success("Delete SuccessFully")
    loadData();
  }


  const handleChange = (e) => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  // update memu item
  const handleUpdateMenu = (item) => {
    setIsModalOpen(true)
    setState(item)

  }

  // confirm update.
  const handleOk = () => {
    const updatedMenuList = menuList.map((item) =>
      item.name === state.name ? { ...item, ...state } : item
    );

    localStorage.setItem('MenuList', JSON.stringify(updatedMenuList));
    toast.success("Menu updated successfully");
    loadData();
    setIsModalOpen(false);
  }

  // add new item in list
  const handleAddItem = () => {
    let {name, ingredients, price, pic,category} = state;
    name = name.trim();

    if(name === '' || ingredients === '' || price === '' || pic === '' || category === '')
    {return toast.warning("All field are must required")}

    price = Number(price)

    const item = {
      name,
      price,
      category,
      ingredients,
      pic
    }

    const storedMenu = JSON.parse(localStorage.getItem("MenuList")) || []

    const updatedMenuList = [...storedMenu, item]
    localStorage.setItem('MenuList', JSON.stringify(updatedMenuList))

    loadData()
    setState(initialState)
  }


  return (

    <>

      <main>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"
              items={items} onClick={({ key }) => setSelectedMenu(key)} />
          </Sider>
          <Layout>
            <Content>
              {/* user */}
              {selectedMenu === '1' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>Users</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Add Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{user.id}</td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{dayjs(user.addDate).format('MMMM D, YYYY h:mm A')}</td>
                          <td className='text-success'>{user.status}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}
              {/* table bookings */}
              {selectedMenu === '2' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>Table Bookings</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col"> Bkg Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Person</th>
                        <th scope="col">Request</th>
                        <th scope="col">Add Date</th>
                        <th scope="col">Reserved Date</th>
                        <th scope="col">user Id</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.bookingId}</td>
                          <td>{item.fullName}</td>
                          <td>{item.email}</td>
                          <td>{item.noOfPeople}</td>
                          <td>{item.request}</td>
                          <td>{dayjs(item.bookingTime).format('MMMM D, YYYY h:mm A')}</td>
                          <td className='text-success'>{dayjs(item.reservedTime).format('MMMM D, YYYY h:mm A')}</td>
                          <td className=''>{item.userId}</td>
                          <td><button className='btn btn-danger btn-sm' onClick={() => { handleDeleteBooking(item) }}>Delete</button></td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}
              {/*current Orders */}
              {selectedMenu === '3' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>Current Orders</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Add Date</th>
                        <th scope="col">user Id</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td className='text-success'>{dayjs(item.CreatedDate).format('MMMM D, YYYY h:mm A')}</td>
                          <td className=''>{item.userId}</td>
                          <td><button className='btn btn-danger btn-sm' onClick={() => { handleCompleteOrder(item) }}>Complete</button></td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}
              {/* Order history */}
              {selectedMenu === '4' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>Order History</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Add Date</th>
                        <th scope="col">user Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td className='text-success'>{dayjs(item.CreatedDate).format('MMMM D, YYYY h:mm A')}</td>
                          <td className=''>{item.userId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Feed back */}
              {selectedMenu === '5' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>User Feedback</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">fb Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Add Date</th>
                        <th scope="col">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.subject}</td>
                          <td className='text-success'>{dayjs(item.CreatedDate).format('MMMM D, YYYY h:mm A')}</td>
                          <td className=''>{item.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* user emails */}
              {selectedMenu === '6' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>User Emails</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userEmails.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Menu List */}
              {selectedMenu === '7' && (
                <div className='mx-3'>
                  <h3 className='text-center my-5'>Order History</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Category</th>
                        <th scope="col">Name</th>
                        <th scope="col">Ingredients</th>
                        <th scope="col">Price</th>
                        <th scope="col">Pic</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuList.map((item, i) => (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{item.category}</td>
                          <td>{item.name}</td>
                          <td>{item.ingredients}</td>
                          <td>{item.price}</td>
                          <td>{item.pic}</td>
                          <td><button className='btn btn-warning btn-sm me-2 mb-2' onClick={() => handleUpdateMenu(item)}>Update</button><button className='btn btn-danger btn-sm' onClick={() => handleDeleteMenu(item)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/*Add New Menu */}
              {selectedMenu === '8' && (
                <div className='mx-5'>
                  <h3 className='text-center my-5'>Add New Item</h3>
                  <div className='mx-5'>
                    <div className="row mb-3">
                      <div className="col">
                        <input type="text" className='form-control' placeholder="Name Item" name='name' value={state.name} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <input type="text" className='form-control' placeholder="Ingredients" name='ingredients' value={state.ingredients} onChange={handleChange}/>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <input type="text" className='form-control' placeholder="Price" name='price' value={state.price} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <select className='form-control' name="category" id="" value={state.category} onChange={handleChange}>
                          <option value="">Category</option>
                          <option value="pizza">Pizza</option>
                          <option value="burger">Burger</option>
                          <option value="apetz">Appetizer</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <select className='form-control' name="pic" id="" value={state.pic} onChange={handleChange}>
                          <option value="">Pic</option>
                          <option value="pizza1">pizza1</option>
                          <option value="pizza2">pizza2</option>
                          <option value="burger1">burger1</option>
                          <option value="burger2">burger2</option>
                          <option value="burger3">burger3</option>
                          <option value="apetz1">apetz1</option>
                          <option value="apetz2">apetz2</option>
                          <option value="apetz3">apetz3</option>
                        </select>
                      </div>
                    </div>
                    <div className="row px-5 py-3 d-flex justify-content-center">
                      <button className='btn btn-primary w-100 ' style={{ maxWidth: 230 }} onClick={handleAddItem}>Add</button>
                    </div>
                  </div>
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
        {/* Modal Component for update menu list */}
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div className="row mb-3">
            <div className="col">
              <Input type='text' size="large" placeholder="Name" name='name' value={state.name} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <Input type='text' size="large" placeholder="Ingredients" name='ingredients' value={state.ingredients} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <Input type='text' size="large" placeholder="Price" name='price' value={state.price} onChange={handleChange} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <Select defaultValue="none" size='large' name='category'  value={state.category} onChange={handleChange} style={{ width: '100%' }}
                options={[
                  { value: 'pizza', label: 'Pizza' },
                  { value: 'burger', label: 'Burger' },
                  { value: 'apetz', label: 'Appetizer' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
              />
            </div>
          </div>
        </Modal>
      </main>
    </>
  )
}
