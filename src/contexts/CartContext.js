import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext';

const Cart = createContext();

export default function CartContext({ children }) {
  const [cartCounting, setCartCounting] = useState(0);
  const { user } = useAuthContext();

  const loadData = useCallback(() => {
    const data = JSON.parse(localStorage.getItem('orders')) || [];
    const filteredData = data.filter((item) => item.userId === user.id) || [];
    setCartCounting(filteredData.length);
  }, [user.id])
  useEffect(() => {
    loadData();
  }, [user, loadData]);

  return (
    <Cart.Provider value={{ cartCounting, setCartCounting }}>
      {children}
    </Cart.Provider>
  )
}

export const useCartContext = () => useContext(Cart)